from Unit import Unit
from random import randint
from Map import width, height

starting_distance = 30

class Player:
    def __init__(self, playerId, map, user_code):
        self.playerID = playerId
        self.map = map
        self.user_code = user_code

    def make_move(self):
        # 1 = move north, 2 = move east, 3 = move south, 4 = move west, 5 = build north, 6 = build east, 7 = build south, 8 = build west, 9 = mine

        move_as_list = []

        # the numbers in the tuple will correspond to commands given to each unit
        for unit in self.units:
            move_as_list.append(randint(1, 10))

        move_as_tuple = tuple(move_as_list)
        return move_as_tuple

    def add_building(self, building):
        self.buildings.append(building)


    def __str__(self):
        string = "Player " + str(self.playerId) + "\n"

        string += "Resource: " + str(self.resource) + "\n"

        for unit in self.units:
            string += str(unit)
            string += "\n"


        for building in self.buildings:
            string += str(building)
            string += "\n"


        return string
