from word2number import w2n
from xml.etree.ElementTree import fromstring
from .dictionary import place_synonyms, pick_synonyms
from .utils.xml import create_XML_program
from .models import Task
from .utils.string import (
    CHAT_MESSAGE_MSG_NOT_UNDERSTAND,
    CHAT_PROCESSING_OBJECT,
    CHAT_PROCESSING_LOCATION,
    CHAT_PROCESSING_PICK_PLACE,
)


class Object:
    def __init__(self, name, cardinality, adjective):
        self.name = name
        self.cardinality = cardinality
        self.adjective = adjective


class Location:
    def __init__(self, name, adjective):
        self.name = name
        self.adjective = adjective


class Pick:
    def __init__(self, object):
        self.object = object


class Place:
    def __init__(self, pick, location):
        self.pick = pick
        self.location = location


class PickAndPlace:
    def __init__(self):
        self.pick = None
        self.place = None

    # find and return the adjectve relative to an object
    def find_object_adj(self, object_name, lista, tokens):
        adjective = ""
        for i in range(0, len(lista)):
            # (‘amod’, ball-red)
            if (lista[i][0] == "amod") and (tokens[lista[i][1] - 1] == object_name):
                adjective = tokens[lista[i][2] - 1]
                break
            if (lista[i][0] == "compound") and (tokens[lista[i][1] - 1] == object_name):
                adjective = tokens[lista[i][2] - 1]
                break
        return adjective

    # find and return the cardinality relative to an object
    def find_object_cardinality(self, object_name, lista, tokens):
        cardinality = ""
        for i in range(0, len(lista)):
            # relazione: ('det', ball, the)
            if (lista[i][0] == "det:predet") and (
                tokens[lista[i][1] - 1] == object_name
            ):
                cardinality = tokens[lista[i][2] - 1]
                break
            # relazione: ('nummod', chocolates, 5)
            if (lista[i][0] == "nummod") and (tokens[lista[i][1] - 1] == object_name):
                cardinality = str(w2n.word_to_num(tokens[lista[i][2] - 1]))
                break
            # relazione: ('det', chocolates, the)
            if (lista[i][0] == "det") and (tokens[lista[i][1] - 1] == object_name):
                if tokens[lista[i][2] - 1] == "the":
                    cardinality = "1"
                else:
                    cardinality = tokens[lista[i][2] - 1]
                break
        return cardinality

    # define all the elements of a pick and place task
    def process_dependencies(self, lista, tokens, tagged, task_id):
        # definizione pick
        # CASO 1: take the obj and put it on place
        for i in range(0, len(lista)):
            if (
                lista[i][0] == "obj"
                or lista[i][0] == "dep"
                or lista[i][0] == "compound"
            ):
                if lista[i][0] == "compound":
                    if pick_synonyms.__contains__(tokens[lista[i][2] - 1]):
                        self.define_direct_object(
                            lista, tokens[lista[i][1] - 1], tokens, i
                        )
                else:
                    if pick_synonyms.__contains__(tokens[lista[i][1] - 1]):
                        if self.pick is None:
                            self.define_direct_object(
                                lista, tokens[lista[i][2] - 1], tokens, i
                            )

            elif (lista[i][0] == "obj") and (
                place_synonyms.__contains__(tokens[lista[i][1] - 1])
            ):
                object = tokens[lista[i][2] - 1]
                word = self.search_in_tagged(tagged, object)
                if word != "PRP":
                    self.define_direct_object(lista, tokens[lista[i][2] - 1], tokens, i)

            elif lista[i][0] == "case":
                self.define_location(lista, tokens, i)

        # Controllo se esiste già in db
        root = None

        if Task.objects.filter(id=task_id).exists():
            taskCode = (
                Task.objects.filter(id=task_id).values_list("code", flat=True).first()
            )
            if taskCode is not None and taskCode != "":
                root = fromstring(taskCode)

        pick = None
        place = None
        pick_card = ""

        if root is not None:
            for child in root:
                # only direct children
                tag = child.tag
                if tag == "pick":
                    pick = child.text
                    pick_card = child.attrib.get("card")
                if tag == "place":
                    place = child.text

        if (self.pick is None and pick is None) and self.place is not None:
            create_XML_program(task_id, self)
            msg = CHAT_PROCESSING_OBJECT
            end = 0
            card = ""
            return msg, end, card
        elif (self.place is None and place is None) and (self.pick is not None):
            create_XML_program(task_id, self)
            msg = CHAT_PROCESSING_LOCATION.format(self.pick.object.name)
            end = 0
            card = self.pick.object.cardinality
            return msg, end, card
        elif (self.pick is not None or pick is not None) and (
            self.place is not None or place is not None
        ):
            pickData = self.pick.object.name if pick is None else pick
            placeData = self.place.location.name if place is None else place
            msg = CHAT_PROCESSING_PICK_PLACE.format(pickData, placeData)
            end = 1
            card = self.pick.object.cardinality if pick is None else pick_card
            create_XML_program(task_id, self)
            return msg, end, card
        elif (self.pick is None) and (self.place is None):
            msg = CHAT_MESSAGE_MSG_NOT_UNDERSTAND
            end = 0
            card = ""
            return msg, end, card

    # search and define the class object -> manipulable
    def define_direct_object(self, lista, object_name, tokens, i):
        object_adjective = self.find_object_adj(object_name, lista, tokens)
        object_cardinality = self.find_object_cardinality(object_name, lista, tokens)
        object = Object(object_name, object_cardinality, object_adjective)
        self.pick = Pick(object)

    def define_location(self, lista, tokens, i):
        location_name = tokens[lista[i][1] - 1]
        location_adjective = self.find_object_adj(location_name, lista, tokens)
        location = Location(location_name, location_adjective)
        self.place = Place(self.pick, location)

    # search and return the tag of a word
    def search_in_tagged(self, tagged, word):
        for i in range(0, len(tagged)):
            if tagged[i][0] == word:
                return tagged[i][1]
