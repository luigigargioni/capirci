from nltk import word_tokenize, pos_tag
from .relation_states import PickAndPlace
from django.contrib.auth.models import User
from .dictionary import (
    find_sinonimi,
    pick_sinonimi,
    place_sinonimi,
    all_sinonimi,
    negative_response,
    assert_response,
    sensor,
)
from word2number import w2n
from xml.etree.ElementTree import Element, dump as xmlDump, tostring, fromstring
from django.db.models import Q
from stanza import Pipeline
from stanza.pipeline.core import DownloadMethod
from os import path
from .XML_utilities import add_external_tag_XML, add_end_tag_XML
from .models import Action, Task
from pickle import load, dump as pickleDump, HIGHEST_PROTOCOL

server = None


def about(program):
    print("Wait...")
    pickandplace = pick_sinonimi + place_sinonimi
    program_list = program.split(".")

    print("program list:", program_list)
    for sentence in program_list:
        tokenized_sentence = word_tokenize(sentence)
        tagged = pos_tag(tokens=tokenized_sentence)
        print("tagged:", tagged)
        for i in range(0, len(tagged)):
            if tagged[i][1] == "VB" or tagged[i][1] == "VBD":
                verbo = tagged[i][0]
                if pickandplace.__contains__(verbo):
                    print("about pick and place")
                else:
                    print("not found")
    return program_list


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


def parseDependencies(lista_dep, tokens):
    for i in range(0, len(lista_dep)):
        print("relazione:", lista_dep[i])
        print(tokens[lista_dep[i][1] - 1] + "-" + tokens[lista_dep[i][2] - 1])


# Quante volte devo eseguire il compito
def main_dialog_condition(text_to_parse, taskname, username):
    print("PROGRAM NAME IN DIALOG COND")
    times = 0
    result = ""
    end = ""
    find = 0

    tokens, dependencies = calcDependencies(text_to_parse)
    tagged = get_tagged_sentence(text_to_parse)
    print("TOKENS:", tokens)
    print("DEP:", dependencies)
    print("TAG:", tagged)

    for i in range(0, len(tokens)):
        print(tokens[i])
        if all_sinonimi.__contains__(tokens[i].lower()):
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
    print("TIMES", str(times))
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
    print("TOKENS:", tokens)
    print("DEP:", dependencies)
    print("TAG:", tagged)

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
            print(element.tag)
            if element.tag == "repeat":
                if repeat != "":
                    element.insert(1, r)
                    r.insert(0, c)
                else:
                    element.insert(1, c)
                break

        xmlDump(root)
        mydata = tostring(root, encoding="unicode")
        Task.objects.filter(name=taskname).filter(owner=username).update(code=mydata)
        result = "ok"

    end = "3"

    return result, end


# ending condition
def main_dialog_end(text_to_parse, taskname, username):
    print("PROGRAM NAME IN DIALOG END")
    obj = ""
    adj = ""
    word = ""
    result = ""
    end = ""
    negative = 0
    find = 0

    tokens, dependencies = calcDependencies(text_to_parse)
    tagged = get_tagged_sentence(text_to_parse)
    print("TOKENS:", tokens)
    print("DEP:", dependencies)
    print("TAG:", tagged)

    for i in range(0, len(tagged)):
        print("tagged:", tagged[i])
        if sensor.__contains__(tagged[i][0].lower()):
            word = tagged[i][0].lower()
            find = 1
            break
    print("FIND:", find)
    if find == 0:
        for i in range(0, len(dependencies)):
            print("DDD:", tokens[dependencies[i][2] - 1])
            if dependencies[i][0] == "obj" and findInlList(
                find_sinonimi, tokens[dependencies[i][1] - 1]
            ):
                obj = tokens[dependencies[i][2] - 1]
                find = 1
            if dependencies[i][0] == "amod":
                adj = tokens[dependencies[i][2] - 1]
            if dependencies[i][0] == "compound":
                adj = tokens[dependencies[i][2] - 1]

    print("OBJ", str(obj))
    print("ADJ", str(adj))
    print("WORD SENS", str(word))
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
    print("PROGRAM NAME IN DIALOG END")

    result = ""
    end = ""
    yes = 0
    negative = 0

    tokens, dependencies = calcDependencies(text_to_parse)
    tagged = get_tagged_sentence(text_to_parse)
    print("TOKENS:", tokens)
    print("DEP:", dependencies)
    print("TAG:", tagged)

    for i in range(0, len(tokens)):
        if assert_response.__contains__(tokens[i].lower()):
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
def main_dialog(text_to_parse, username, taskname):
    task_name_pkl = str(username) + "_" + taskname + ".pkl"
    """Se non c'è ancora il file lo creo -> non ho ancora un pick place, quindi lo creo"""
    """Se ho il file ho il pickPlace() , ma è completo?"""

    if path.isfile(task_name_pkl):
        with open(task_name_pkl, "rb") as input:
            pickPlace = load(input)  # carico il contenuto
        # leggo il file, se è un pick place completo dovrei poter aggiungere un altro pick place al file
    else:
        pickPlace = (
            PickAndPlace()
        )  # creo il nuovo oggetto PickPlace perchè non ho file .pkl

    print("I'm ready to execute the program:", text_to_parse)
    program_list = about(text_to_parse)
    for sentence in program_list:
        tokens, dependencies = calcDependencies(sentence)
        tagged = get_tagged_sentence(sentence)
        print("Tokens Parse:", tokens)
        print("Dependency parser Parse:", dependencies)
        parseDependencies(dependencies, tokens)
        print("PRINT PICK PLACE", pickPlace)
        result, end, card = pickPlace.process_dependencies(
            lista=dependencies,
            tokens=tokens,
            tagged=tagged,
            username=username,
            taskname=taskname,
        )
        with open(task_name_pkl, "wb") as output:
            pickleDump(pickPlace, output, HIGHEST_PROTOCOL)

        return result, end, card
