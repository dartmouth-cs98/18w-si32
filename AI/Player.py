from random import random, randint
from .Command import Command

starting_distance = 30

class Player:
    def __init__(self, playerId, map, bot, starting_pos):
        # self.bot = bot

        self.playerId = playerId
        self.map = map
        self.winner = False
        self.resources = 100

        self.starting_pos = starting_pos

        starting_tile = self.map.get_tile(self.starting_pos)
        starting_tile.increment_units(playerId)

    def get_move(self):
        # 1 = move north, 2 = move east, 3 = move south, 4 = move west, 5 = build north, 6 = build east, 7 = build south, 8 = build west, 9 = mine

        move_as_list = []

        # the numbers in the tuple will correspond to commands given to each unit
        for unit in self.units:
            move_as_list.append(randint(1, 10))

        move_as_tuple = tuple(move_as_list)
        return move_as_tuple

    # Find all tiles in which player has units to control
    def get_occupied_tiles(self):
        tiles = []

        for col in self.map.tiles:
            for tile in col:
                if tile.units[self.playerId] > 0:
                    tiles.append(tile)

        return tiles

    def add_building(self, building):
        self.buildings.append(building)

    def increment_resources(self, number):
        self.resources += number

    def decrement_resources(self, number):
        self.resources -= number

    def __str__(self):
        string = "Player " + str(self.playerId) + "\n"

        string += "Resource: " + str(self.resources) + "\n"

        for unit in self.units:
            string += str(unit)
            string += "\n"

        for building in self.buildings:
            string += str(building)
            string += "\n"

        return string
