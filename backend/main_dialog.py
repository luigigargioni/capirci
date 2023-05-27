from nltk import word_tokenize, pos_tag
from django.contrib.auth.models import User
from word2number import w2n
from xml.etree.ElementTree import Element, dump, tostring, fromstring
from django.db.models import Q
from stanza import Pipeline
from stanza.pipeline.core import DownloadMethod
from .relation_states import PickAndPlace
from .utils.xml import add_external_tag_XML, add_end_tag_XML
from .models import Action, Task
from .dictionary import (
    find_synonyms,
    all_synonyms,
    negative_response,
    positive_response,
    sensor_synonyms,
)


def get_tagged_sentence(sentence):
    tokenized_sentence = word_tokenize(sentence)
    tagged = pos_tag(tokens=tokenized_sentence)
    return tagged


def calcDependencies(program):
    nlp = Pipeline(
        "en",
        processors="tokenize, pos, lemma, depparse",
        download_method=DownloadMethod.REUSE_RESOURCES,
    )
    doc = nlp(program)
    dependencies = []

    for sentence in doc.sentences:
        for word in sentence.words:
            dependencies.append((word.deprel, word.head, word.id))

    tokens = word_tokenize(program)
    return tokens, dependencies


# Quante volte devo eseguire il compito
def main_dialog_condition(text_to_parse, taskname, username):
    times = 0
    result = ""
    end = ""
    find = 0

    tokens, dependencies = calcDependencies(text_to_parse)
    tagged = get_tagged_sentence(text_to_parse)

    for i in range(0, len(tokens)):
        if all_synonyms.__contains__(tokens[i].lower()):
            times = "while"
            add_external_tag_XML(
                taskname, username, newExtTag="repeat", newExtTagText=str(times)
            )
            result = "ok"
            end = "2"
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
        add_external_tag_XML(
            taskname, username, newExtTag="repeat", newExtTagText=str(times)
        )
        result = "ok"
    else:
        result = "ko"
    end = "2"

    return result, end


# ending condition
def main_dialog_action(text_to_parse, taskname, username):
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
            end = "3"
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
                user = User.objects.get(username=username)

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
        xmlCode = (
            Task.objects.filter(name=taskname)
            .filter(owner=username)
            .values_list("code", flat=True)
            .first()
        )
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
        Task.objects.filter(name=taskname).filter(owner=username).update(code=mydata)
        result = "ok"

    end = "3"

    return result, end


# ending condition
def main_dialog_end(text_to_parse, taskname, username):
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
                taskname=taskname,
                username=username,
                newExtTag="event",
                newExtTagText=str(word),
                newExtTagType="sens",
            )
        else:
            if adj != "":
                obj = adj + " " + obj
            add_end_tag_XML(
                taskname=taskname,
                username=username,
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
    end = "4"

    return result, end


def findInlList(lista, word):
    find = False
    for i in range(0, len(lista)):
        if lista[i] == word:
            find = True
    return find


# assert or deny
def main_dialog_assert(text_to_parse, taskname, username):
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

    end = "5"

    return result, end


# pick place
def main_dialog(text_to_parse, taskname, username):
    pickPlace = PickAndPlace()

    program_list = text_to_parse.split(".")
    for sentence in program_list:
        tokens, dependencies = calcDependencies(sentence)
        tagged = get_tagged_sentence(sentence)
        result, end, card = pickPlace.process_dependencies(
            lista=dependencies,
            tokens=tokens,
            tagged=tagged,
            taskname=taskname,
            username=username,
        )
        return result, end, card
