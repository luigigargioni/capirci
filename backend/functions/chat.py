from django.http import HttpResponse, HttpRequest
from backend.utils.response import (
    HttpMethod,
    invalid_request_method,
    error_response,
    success_response,
    unauthorized_request,
)
from backend.models import Task, Action
from django.contrib.auth.models import User
from json import loads
from backend.dictionary import (
    find_synonyms,
    all_synonyms,
    negative_response,
    positive_response,
    sensor_synonyms,
)
from backend.utils.xml import add_external_tag_XML, add_end_tag_XML
from xml.etree.ElementTree import Element, dump, tostring, fromstring
from stanza import Pipeline
from stanza.pipeline.core import DownloadMethod
from nltk import word_tokenize, pos_tag
from backend.relation_states import PickAndPlace
from word2number import w2n
from django.db.models import Q
from backend.utils.string import (
    CHAT_MESSAGE_TIMES,
    CHAT_MESSAGE_EVENT,
    CHAT_MESSAGE_MSG_NOT_UNDERSTAND,
    CHAT_MESSAGE_QUESTION_GRAPHIC,
    CHAT_MESSAGE_OPEN_GRAPHIC,
    CHAT_MESSAGE_NOT_OPEN_GRAPHIC,
    CHAT_MESSAGE_ACTION,
)


def new_message(request: HttpRequest) -> HttpResponse:
    try:
        if request.user.is_authenticated:
            if request.method == HttpMethod.POST.value:
                data = loads(request.body)
                task_id = data.get("id")
                message = data.get("message")
                question = data.get("question")
                end = data.get("end")
                data_result = {}
                if end == 0 and question == 0:
                    response, end, card = question_pick_place(message, task_id)
                    data_result["message"] = [response]
                    if end == 1 and question == 0:
                        if card == "while" or card.isdigit():
                            data_result["question"] = 2
                            data_result["end"] = 2
                            data_result["message"] = [response, CHAT_MESSAGE_ACTION]
                        else:
                            data_result["question"] = 1
                            data_result["end"] = 1
                            data_result["message"] = [response, CHAT_MESSAGE_TIMES]
                elif end == 1 and question == 1:
                    response, end = question_times(message.lower(), task_id)
                    if end == 2 and response == "ok":
                        data_result["question"] = 2
                        data_result["end"] = 2
                        data_result["message"] = [CHAT_MESSAGE_ACTION]
                    else:
                        data_result["question"] = 1
                        data_result["end"] = 1
                        data_result["message"] = [
                            CHAT_MESSAGE_MSG_NOT_UNDERSTAND,
                            CHAT_MESSAGE_TIMES,
                        ]
                elif end == 2 and question == 2:
                    response, end = question_action(
                        message.lower(), task_id, request.user.id
                    )
                    if end == 3 and (response == "ok" or response == "no"):
                        data_result["question"] = 3
                        data_result["end"] = 3
                        data_result["message"] = [CHAT_MESSAGE_EVENT]
                    else:
                        data_result["question"] = 2
                        data_result["end"] = 2
                        data_result["message"] = [
                            CHAT_MESSAGE_MSG_NOT_UNDERSTAND,
                            CHAT_MESSAGE_ACTION,
                        ]
                elif end == 3 and question == 3:
                    response, end = question_event(message.lower(), task_id)
                    if end == 4 and (response == "ok" or response == "no"):
                        data_result["question"] = 4
                        data_result["end"] = 4
                        data_result["message"] = [CHAT_MESSAGE_QUESTION_GRAPHIC]
                    else:
                        data_result["question"] = 3
                        data_result["end"] = 3
                        data_result["message"] = [
                            CHAT_MESSAGE_MSG_NOT_UNDERSTAND + CHAT_MESSAGE_EVENT
                        ]
                elif end == 4 and question == 4:
                    response, end = question_graphic(message.lower())
                    if end == 5 and response == "yes":
                        data_result["question"] = 5
                        data_result["end"] = 5
                        data_result["openGraphic"] = True
                        data_result["message"] = [CHAT_MESSAGE_OPEN_GRAPHIC]
                    elif end == 5 and response == "no":
                        data_result["question"] = 5
                        data_result["end"] = 5
                        data_result["openTasks"] = True
                        data_result["message"] = [CHAT_MESSAGE_NOT_OPEN_GRAPHIC]
                    else:
                        data_result["question"] = 4
                        data_result["end"] = 4
                        data_result["message"] = [
                            CHAT_MESSAGE_MSG_NOT_UNDERSTAND,
                            CHAT_MESSAGE_QUESTION_GRAPHIC,
                        ]

                return success_response(data_result)
            else:
                return invalid_request_method
        else:
            return unauthorized_request()
    except Exception as e:
        return error_response(str(e))


def question_pick_place(message: str, task_id: int) -> dict:
    data_result = {}
    response, end, card = main_dialog(message, task_id)
    data_result["response"] = response
    data_result["end"] = end
    if (
        (not card.isnumeric() and all_synonyms.__contains__(card))
        or card == "0"
        or card == ""
    ):
        data_result["card"] = ""
    else:
        data_result["card"] = card
    if end == "1":
        root = None
        if Task.objects.filter(id=task_id).exists():
            taskCode = (
                Task.objects.filter(id=task_id).values_list("code", flat=True).first()
            )
            if taskCode is not None and taskCode != "":
                root = fromstring(taskCode)

        pick_data_card = None

        if root is not None:
            for child in root:
                # only direct children
                tag = child.tag
                if tag == "pick":
                    pick_data_card = child.attrib.get("card")

        if pick_data_card != "" and pick_data_card != "0":
            if not pick_data_card.isnumeric() and all_synonyms.__contains__(
                pick_data_card
            ):
                add_external_tag_XML(task_id, "repeat", "while")
                data_result["card"] = "while"
            elif pick_data_card.isnumeric():
                add_external_tag_XML(
                    task_id,
                    "repeat",
                    pick_data_card,
                )
    return data_result["response"], data_result["end"], data_result["card"]


def main_dialog(text_to_parse, task_id):
    pickPlace = PickAndPlace()

    program_list = text_to_parse.split(".")
    for sentence in program_list:
        tokens, dependencies = calcDependencies(sentence)
        tagged = get_tagged_sentence(sentence)
        result, end, card = pickPlace.process_dependencies(
            lista=dependencies, tokens=tokens, tagged=tagged, task_id=task_id
        )
        return result, end, card


def question_times(text_to_parse, task_id):
    times = 0
    result = ""
    end = ""
    find = 0

    tokens, dependencies = calcDependencies(text_to_parse)
    tagged = get_tagged_sentence(text_to_parse)

    for i in range(0, len(tokens)):
        if all_synonyms.__contains__(tokens[i].lower()):
            times = "while"
            add_external_tag_XML(task_id, newExtTag="repeat", newExtTagText=str(times))
            result = "ok"
            end = 2
            return result, end

    for i in range(0, len(dependencies)):
        if dependencies[i][0] == "nummod":
            times = str(w2n.word_to_num(tokens[dependencies[i][2] - 1]))
            find = 1
            break

    if find == 0:
        for i in range(0, len(tagged)):
            if tagged[i][1] == "CD":
                times = tagged[i][0]
                find = 1
                break
    if find == 1:
        add_external_tag_XML(task_id, newExtTag="repeat", newExtTagText=str(times))
        result = "ok"
    else:
        result = "ko"
    end = 2

    return result, end


def question_action(text_to_parse, task_id, user_id):
    action = ""
    repeat = ""
    result = ""
    end = ""
    find = 0

    tokens, dependencies = calcDependencies(text_to_parse)
    tagged = get_tagged_sentence(text_to_parse)

    for j in range(0, len(tokens)):
        if negative_response.__contains__(tokens[j].lower()):
            result = "no"
            end = 3
            return result, end

    for i in range(0, len(tagged)):
        if (
            tagged[i][1] == "NN"
            or tagged[i][1] == "VB"
            or tagged[i][1] == "VBD"
            or tagged[i][1] == "VBG"
            or tagged[i][1] == "VBN"
        ):
            if find == 0:
                action = tagged[i][0]

                # actionExist
                nameExist = False
                action_name = action
                user = User.objects.get(id=user_id)

                actions = Action.objects.filter(name=action_name)
                if not actions:
                    actions = Action.objects.filter(
                        Q(owner=user) | Q(shared=True)
                    ).filter(name=action_name)

                if actions:
                    nameExist = True

                if nameExist is True:
                    find = 1

        if tagged[i][1] == "CD" or tagged[i][0] == "twice" or tagged[i][0] == "thrice":
            if tagged[i][0] == "twice":
                repeat = "2"
            elif tagged[i][0] == "thrice":
                repeat = "3"
            elif tagged[i][1] == "CD" and tagged[i][0] != "1":
                repeat = tagged[i][0]
                if not repeat.isnumeric():
                    repeat = str(w2n.word_to_num(repeat))

    if find == 1:
        xmlCode = Task.objects.filter(id=task_id).values_list("code", flat=True).first()
        root = fromstring(xmlCode)
        c = Element("action")
        c.text = action
        r = Element("repeat")
        if repeat != "":
            r.set("times", repeat)

        for element in root:
            if element.tag == "repeat":
                if repeat != "":
                    element.insert(1, r)
                    r.insert(0, c)
                else:
                    element.insert(1, c)
                break

        dump(root)
        mydata = tostring(root, encoding="unicode")
        Task.objects.filter(id=task_id).update(code=mydata)
        result = "ok"

    end = 3

    return result, end


def question_event(text_to_parse, task_id):
    obj = ""
    adj = ""
    word = ""
    result = ""
    end = ""
    negative = 0
    find = 0

    tokens, dependencies = calcDependencies(text_to_parse)
    tagged = get_tagged_sentence(text_to_parse)

    for i in range(0, len(tagged)):
        if sensor_synonyms.__contains__(tagged[i][0].lower()):
            word = tagged[i][0].lower()
            find = 1
            break
    if find == 0:
        for i in range(0, len(dependencies)):
            if dependencies[i][0] == "obj" and findInlList(
                find_synonyms, tokens[dependencies[i][1] - 1]
            ):
                obj = tokens[dependencies[i][2] - 1]
                find = 1
            if dependencies[i][0] == "amod":
                adj = tokens[dependencies[i][2] - 1]
            if dependencies[i][0] == "compound":
                adj = tokens[dependencies[i][2] - 1]

    if find == 1:
        if word != "":
            add_end_tag_XML(
                task_id=task_id,
                newExtTag="event",
                newExtTagText=str(word),
                newExtTagType="sens",
            )
        else:
            if adj != "":
                obj = adj + " " + obj
            add_end_tag_XML(
                task_id=task_id,
                newExtTag="event",
                newExtTagText=str(obj),
                newExtTagType="obj",
            )

        result = "ok"

    else:
        for j in range(0, len(tokens)):
            if negative_response.__contains__(tokens[j].lower()):
                negative = 1
                break
        result = "no"

    if negative == 0 and find == 0:
        result = "ko"
    end = 4

    return result, end


def question_graphic(text_to_parse):
    result = ""
    end = ""
    yes = 0
    negative = 0

    tokens, dependencies = calcDependencies(text_to_parse)

    for i in range(0, len(tokens)):
        if positive_response.__contains__(tokens[i].lower()):
            yes = 1
            break

    if yes == 0:
        for j in range(0, len(tokens)):
            if negative_response.__contains__(tokens[j].lower()):
                negative = 1
                break

    if yes == 1 and negative == 0:
        result = "yes"
    if yes == 0 and negative == 1:
        result = "no"
    if yes == 0 and negative == 0:
        result = "ko"
    if yes == 1 and negative == 1:
        result = "ko"

    end = 5

    return result, end


def calcDependencies(program):
    nlp = Pipeline(
        "en",
        processors="tokenize, pos, lemma, depparse",
        download_method=DownloadMethod.REUSE_RESOURCES,
        logging_level="WARN",
    )
    doc = nlp(program)
    dependencies = []

    for sentence in doc.sentences:
        for word in sentence.words:
            dependencies.append((word.deprel, word.head, word.id))

    tokens = word_tokenize(program)
    return tokens, dependencies


def get_tagged_sentence(sentence):
    tokenized_sentence = word_tokenize(sentence)
    tagged = pos_tag(tokens=tokenized_sentence)
    return tagged


def findInlList(lista, word):
    find = False
    for i in range(0, len(lista)):
        if lista[i] == word:
            find = True
    return find


""" def parseXmlToJson(xml):
    response = {}
    for child in list(xml):
        if len(list(child)) > 0:
            if child.tag == "repeat":
                response[child.tag] = {
                    "times": str(child.get("times")),
                    "body": parseXmlToJson(child),
                }
                continue
                # return response
            else:
                response[child.tag] = {"body": parseXmlToJson(child)}

            if child.tag == "event":
                if child.get("type") == "obj":
                    response[child.tag] = {
                        "type": child.get("type"),
                        "obj": child.get("obj"),
                        "adj": child.get("adj"),
                        "body": parseXmlToJson(child),
                    }
                else:
                    response[child.tag] = {
                        "type": child.get("type"),
                        "body": parseXmlToJson(child),
                    }
            else:
                response[child.tag] = {"body": parseXmlToJson(child)}
        else:
            if child.tag == "pick" or child.tag == "place":
                response[child.tag] = {
                    "card": child.get("card"),
                    "adj": child.get("adj"),
                    "obj": child.text,
                }
            elif child.tag == "repeat":
                response[child.tag] = {"times": child.get("times")}
            else:
                response[child.tag] = child.text or ""
    return response """
