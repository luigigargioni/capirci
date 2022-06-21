from xml.etree.ElementTree import parse, Element, tostring, SubElement, dump
from pickle import load
from .dictionary import all_sinonimi
from os import path


def readcontent(fname):
    file_content = open(fname, "r").read()
    return file_content


def deletecontent(fname):
    with open(fname, "w"):
        pass


def iterator(parents, nested=False):
    for child in reversed(parents):
        if nested:
            if len(child) >= 1:
                iterator(child)
        if True:  # Add your entire condition here
            parents.remove(child)


# This method add an external tag to existing XML file
def add_external_tag_XML(fileName, newExtTag, newExtTagText):
    root = parse(fileName + ".xml").getroot()

    children = []

    for child in root:
        # solo figli diretti
        tag = child.tag
        if tag != "program":
            children.append(child)

    iterator(root, False)

    c = Element(newExtTag)

    if newExtTag == "repeat":
        c.set("times", str(newExtTagText))
    root.insert(0, c)

    repeat = root.find(newExtTag)

    for i in range(0, len(children)):
        tag = children[i].tag
        if tag != "program":
            repeat.insert(i, children[i])
            i = i + 1

    dump(root)
    mydata = tostring(root, encoding="unicode")
    myfile = open(fileName + ".xml", "w")
    myfile.write(mydata)


# this method read info about pickPlace task from .pkl file and write corresponding tags in .xml file
def create_XML_program(fileName, username):
    task_name_pkl = str(username) + "_" + readcontent(fileName) + ".pkl"
    program_name_xml = str(username) + "_" + readcontent(fileName) + ".xml"

    data = Element("program")
    pick = SubElement(data, "pick")
    place = SubElement(data, "place")

    if path.isfile(task_name_pkl):
        with open(task_name_pkl, "rb") as input:
            pick_place_data = load(input)
            pick_data = pick_place_data.pick
            place_data = pick_place_data.place

    pick.set("adj", pick_data.object.adjective)
    card = pick_data.object.cardinality
    if (
        card == "1"
        or (not card.isnumeric() and all_sinonimi.__contains__(card))
        or card == "0"
    ):
        card = ""

    pick.set("card", card)
    place.set("adj", place_data.location.adjective)
    place.set("card", place_data.location.cardinality)

    pick.text = pick_data.object.name
    place.text = place_data.location.name
    mydata = tostring(data, encoding="unicode")
    myfile = open(program_name_xml, "w")
    myfile.write(mydata)


# This method add an end tag to existing XML file
def add_end_tag_XML(fileName, newExtTag, newExtTagText, newExtTagType):
    root = parse(fileName + ".xml").getroot()
    c = Element(newExtTag)

    if newExtTagType == "obj":
        c.set("obj", newExtTagText)
    c.set("type", newExtTagType)
    root.insert(0, c)

    children = []

    for child in root:
        # solo figli diretti
        tag = child.tag
        if tag != "program" and tag != newExtTag:
            children.append(child)
            root.remove(child)

    event = root.find(newExtTag)

    for i in range(0, len(children)):
        tag = children[i].tag
        if tag != "program" and tag != newExtTag:
            event.insert(i, children[i])
            i = i + 1

    dump(root)
    mydata = tostring(root, encoding="unicode")
    myfile = open(fileName + ".xml", "w")
    myfile.write(mydata)
