from xml.etree.ElementTree import Element, tostring, SubElement, dump, fromstring
from backend.models import Task
from ..dictionary import all_synonyms


def iterator(parents, nested=False):
    for child in reversed(parents):
        if nested:
            if len(child) >= 1:
                iterator(child)
        if True:  # Add your entire condition here
            parents.remove(child)


# This method add an external tag to existing XML file
def add_external_tag_XML(task_id, newExtTag, newExtTagText):
    taskCode = Task.objects.filter(id=task_id).values_list("code", flat=True).first()
    root = fromstring(taskCode)
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
    Task.objects.filter(id=task_id).update(code=mydata)


def create_XML_program(task_id, pickPlace):
    root = None

    if Task.objects.filter(id=task_id).exists():
        taskCode = (
            Task.objects.filter(id=task_id).values_list("code", flat=True).first()
        )
        if taskCode is not None and taskCode != "":
            root = fromstring(taskCode)

    data = None
    pickExists = False
    placeExists = False

    if root is not None:
        data = root
        for child in root:
            # solo figli diretti
            tag = child.tag
            if tag == "pick":
                pickExists = True
            if tag == "place":
                placeExists = True
    else:
        data = Element("program")

    pick_data = pickPlace.pick
    place_data = pickPlace.place

    if pick_data is not None and pickExists is False:
        pick = SubElement(data, "pick")
        pick.set("adj", pick_data.object.adjective)
        card = pick_data.object.cardinality
        if (
            # card == "1" or
            (not card.isnumeric() and all_synonyms.__contains__(card))
            or card == "0"
            or card == ""
        ):
            card = "1"
        pick.set("card", card)
        pick.text = pick_data.object.name

    if place_data is not None and placeExists is False:
        place = SubElement(data, "place")
        place.set("adj", place_data.location.adjective)
        place.text = place_data.location.name

    mydata = tostring(data, encoding="unicode")
    Task.objects.filter(id=task_id).update(code=mydata)


# This method add an end tag to existing XML file
def add_end_tag_XML(task_id, newExtTag, newExtTagText, newExtTagType):
    taskCode = Task.objects.filter(id=task_id).values_list("code", flat=True).first()
    root = fromstring(taskCode)
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
    Task.objects.filter(id=task_id).update(code=mydata)
