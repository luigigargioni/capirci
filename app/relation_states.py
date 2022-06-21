from .dictionary import place_sinonimi, pick_sinonimi
from pickle import load, dump, HIGHEST_PROTOCOL
from os import path
from word2number import w2n


class Object:
    def __init__(self, name, cardinality, adjective):
        self.name = name
        self.cardinality = cardinality
        self.adjective = adjective


class Location:
    def __init__(self, name, cardinality, adjective):
        self.name = name
        self.cardinality = cardinality
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
    def process_dependencies(self, lista, tokens, tagged, username, taskname):
        task_name_pkl = str(username) + "_" + taskname + ".pkl"
        # definizione pick
        # CASO 1: take the obj and put it on place
        for i in range(0, len(lista)):
            print("qui leggo LISTA:", lista[i])
            if (
                lista[i][0] == "obj"
                or lista[i][0] == "dep"
                or lista[i][0] == "compound"
            ):
                print("TROV COMPOUND?")
                print(
                    "TROV COMPOUND?:",
                    lista[i],
                    lista[i][1] - 1,
                    tokens[lista[i][1] - 1],
                )
                if lista[i][0] == "compound":
                    if pick_sinonimi.__contains__(tokens[lista[i][2] - 1]):
                        # take-ball
                        print(
                            "define_direct_object2 - ho trovato obj or dep:", lista[i]
                        )
                        self.define_direct_object2(lista, tokens, i, username, taskname)
                else:
                    if pick_sinonimi.__contains__(tokens[lista[i][1] - 1]):
                        # take-ball
                        print("define_direct_object - ho trovato obj or dep:", lista[i])
                        if self.pick is None:
                            self.define_direct_object(
                                lista, tokens, i, username, taskname
                            )
                        print(self.pick.object.name)

                ##############
                # obj(place, it)  or  obj(place, the box)
            elif (lista[i][0] == "obj") and (
                place_sinonimi.__contains__(tokens[lista[i][1] - 1])
            ):
                print("Place=Place()")
                object = tokens[lista[i][2] - 1]
                print("word da cercare", object)
                word = self.search_in_tagged(tagged, object)
                if word == "PRP":
                    print("preposition")  # l'oggetto è definito da altre parti
                elif word != "PRP":  # and (self.pick==None):
                    print("cerco l'oggetto : ho put the obj on place")
                    self.define_direct_object(lista, tokens, i, username, taskname)

                else:
                    print("non cerco: ripete nome obj")

            elif lista[i][0] == "case":
                print("loc destination")
                self.define_location(lista, tokens, i, username, taskname)

        """Leggo pick and place"""
        # pick_data = None
        # place_data = None

        if path.isfile(task_name_pkl):
            with open(task_name_pkl, "rb") as input:
                pick_place_data = load(input)
                pick_data = pick_place_data.pick
                place_data = pick_place_data.place

            # print("from data place: --->", place_data.location.name)  # -> banana

            if pick_data is None and place_data is not None:
                print("NO PICK 1")
                msg = "which is the object to be taken?"
                end = "0"
                card = ""
                return msg, end, card

            elif place_data is None and pick_data is not None:
                msg = "Where should I put the " + pick_data.object.name + "?"
                end = "0"
                card = pick_data.object.cardinality
                return msg, end, card
            elif pick_data is not None and place_data is not None:
                msg = (
                    "I have to put the "
                    + pick_data.object.adjective
                    + " "
                    + pick_data.object.name
                    + " in the "
                    + place_data.location.name
                    + "."
                )
                end = "1"
                card = pick_data.object.cardinality
                return msg, end, card
            elif place_data is None and pick_data is None:
                msg = "I did not understand what you said. Tell me again what to do."
                end = "0"
                card = ""
                return msg, end, card
        else:
            if self.pick is None and self.place is not None:
                print("NO PICK")
                msg = "which is the object to be taken?"
                end = "0"
                card = ""
                return msg, end, card

            elif (self.place is None) and (self.pick is not None):
                msg = "Where should I put the " + self.pick.object.name + "?"
                end = "0"
                card = self.pick.object.cardinality
                return msg, end, card
            elif (self.pick is not None) and (self.place is not None):
                msg = (
                    "I have to put the "
                    + self.pick.object.name
                    + " in the "
                    + self.place.location.name
                    + "."
                )
                end = "1"
                card = self.pick.object.cardinality
                return msg, end, card
            elif (self.pick is None) and (self.place is None):
                msg = "I did not understand what you said. Tell me again what to do."
                end = "0"
                card = ""
                return msg, end, card

    # search and define the class object -> manipulable
    def define_direct_object(self, lista, tokens, i, username, taskname):

        task_name_pkl = str(username) + "_" + taskname + ".pkl"

        object_name = tokens[lista[i][2] - 1]
        object_adjective = self.find_object_adj(object_name, lista, tokens)
        object_cardinality = self.find_object_cardinality(object_name, lista, tokens)
        object = Object(object_name, object_cardinality, object_adjective)
        self.pick = Pick(object)
        print("Pick=Pick()")

        """ salvo pick """

        # with open('pick.pkl', 'wb') as output:
        #    pickle.dump(self.pick, output, pickle.HIGHEST_PROTOCOL)
        with open(task_name_pkl, "wb") as output:
            dump(self, output, HIGHEST_PROTOCOL)

        if self.pick is not None:
            print("Object to pick:", self.pick.object.name)

    def define_direct_object2(self, lista, tokens, i, username, taskname):

        task_name_pkl = str(username) + "_" + taskname + ".pkl"

        object_name = tokens[lista[i][1] - 1]
        object_adjective = self.find_object_adj(object_name, lista, tokens)
        object_cardinality = self.find_object_cardinality(object_name, lista, tokens)
        object = Object(object_name, object_cardinality, object_adjective)
        self.pick = Pick(object)
        print("Pick=Pick()")

        """ salvo pick """

        # with open('pick.pkl', 'wb') as output:
        #    pickle.dump(self.pick, output, pickle.HIGHEST_PROTOCOL)
        with open(task_name_pkl, "wb") as output:
            dump(self, output, HIGHEST_PROTOCOL)

        if self.pick is not None:
            print("Object to pick:", self.pick.object.name)

    def define_location(self, lista, tokens, i, username, taskname):

        task_name_pkl = str(username) + "_" + taskname + ".pkl"

        location_name = tokens[lista[i][1] - 1]
        location_adjective = self.find_object_adj(location_name, lista, tokens)
        location_cardinality = self.find_object_cardinality(
            location_name, lista, tokens
        )
        location = Location(location_name, location_cardinality, location_adjective)
        self.place = Place(self.pick, location)
        print("IN DEFINE LOCATION")
        print("LOCATION name: ", self.place.location.name)
        print("LOCATION card: ", self.place.location.cardinality)
        print("LOCATION adj: ", self.place.location.adjective)

        with open(task_name_pkl, "wb") as output:
            dump(self, output, HIGHEST_PROTOCOL)

        """ salvo place """
        # with open('place.pkl', 'wb') as output:
        #   pickle.dump(self.place, output, pickle.HIGHEST_PROTOCOL)

        if self.pick is not None:
            print("OBJECT name: ", self.place.pick.object.name)
            print("OBJECT card: ", self.place.pick.object.cardinality)
            print("OBJECT adj: ", self.place.pick.object.adjective)

    # search and return the tag of a word
    def search_in_tagged(self, tagged, word):
        for i in range(0, len(tagged)):
            if tagged[i][0] == word:
                print("search in tagged", tagged[i][1])
                return tagged[i][1]
