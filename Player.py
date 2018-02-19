import random
from random import randint
from ActionCommand import ActionCommand
from Tile import Tile
from collections import deque

starting_distance = 30

class Player:
    def __init__(self, playerId, map, user_code):
        self.playerID = playerId
        self.map = map
        self.user_code = user_code
        self.winner = False
        self.buildings = []
        self.resource = 0

        self.positions_with_units = []
        self.action_commands_from_position_dictionary = {}

    def get_move(self):

        move = set()

        for position in self.positions_with_units:
            tile = self.map.get_tile(position)

            number_of_tile_units_controlled_by_player = tile.units[self.playerID]

            number_of_units_to_move = randint(0, number_of_tile_units_controlled_by_player)
            number_of_units_to_build = randint(0, number_of_tile_units_controlled_by_player - number_of_units_to_move)
            number_of_units_to_mine = number_of_tile_units_controlled_by_player - number_of_units_to_move - number_of_units_to_build

            number_of_units_to_move_north = randint(0, number_of_units_to_move)
            number_of_units_to_move_east = randint(0, number_of_units_to_move - number_of_units_to_move_north)
            number_of_units_to_move_south = randint(0, number_of_units_to_move - number_of_units_to_move_north - number_of_units_to_move_east)
            number_of_units_to_move_west = number_of_units_to_move - number_of_units_to_move_north - number_of_units_to_move_east - number_of_units_to_move_south

            '''
            if (self.playerID == 0):
                number_of_units_to_build = 0
                number_of_units_to_mine = 0
                number_of_units_to_move_north = 1
                number_of_units_to_move_east = 0
                number_of_units_to_move_south = 0
                number_of_units_to_move_west = 0
            elif (self.playerID == 1):
                number_of_units_to_build = 0
                number_of_units_to_mine = 0
                number_of_units_to_move_north = 0
                number_of_units_to_move_east = 0
                number_of_units_to_move_south = 1
                number_of_units_to_move_west = 0
            '''


            action_command_set = set()



            if (number_of_units_to_move_north > 0):
                action_command_north = ActionCommand(tile, 'move', number_of_units_to_move_north, (0, 1))
                action_command_set.add(action_command_north)

            if (number_of_units_to_move_east > 0):
                action_command_east = ActionCommand(tile, 'move', number_of_units_to_move_east, (1, 0))
                action_command_set.add(action_command_east)

            if (number_of_units_to_move_south > 0):
                action_command_south = ActionCommand(tile, 'move', number_of_units_to_move_south, (0, -1))
                action_command_set.add(action_command_south)

            if (number_of_units_to_move_west > 0):
                action_command_west = ActionCommand(tile, 'move', number_of_units_to_move_west, (-1, 0))
                action_command_set.add(action_command_west)

            if (number_of_units_to_build > 0):
                action_command_build = ActionCommand(tile, 'build', number_of_units_to_build, None)
                action_command_set.add(action_command_build)

            if (number_of_units_to_mine > 0):
                action_command_mine = ActionCommand(tile, 'mine', number_of_units_to_mine, None)
                action_command_set.add(action_command_mine)

            for action_command in action_command_set:
                move.add(action_command)

            self.action_commands_from_position_dictionary[position] = action_command_set

        return move

    def add_building(self, building):
        self.buildings.append(building)

    def __str__(self):
        string = "Player " + str(self.playerID) + "\n"

        string += "Resource: " + str(self.resource) + "\n"

        for pos in self.positions_with_units:
            tile = self.map.get_tile(pos)
            string += str(tile.units[self.playerID]) + " units at " + str(tile.position)
            string += "\n"

        for building in self.buildings:
            string += str(building) + " at " + str(building.position)
            string += "\n"

        return string
