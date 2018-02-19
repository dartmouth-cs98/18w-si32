from random import random, randint
from unit_command import Unit_command

starting_distance = 30


class Player:
    def __init__(self, playerId, map, user_code):
        self.playerId = playerId
        self.map = map
        self.user_code = user_code
        self.winner = False
        self.resources = 100

        self.starting_x = int((self.map.width / 2) + (0.5 - self.playerId) * starting_distance)
        self.starting_y = int((self.map.height / 2) + (0.5 - self.playerId) *starting_distance)

        starting_tile = self.map.get_tile([self.starting_x, self.starting_y])
        starting_tile.increment_units(playerId)

    def make_move(self):
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

    # Top level method for getting all moves
    def get_random_moves(self):
        tiles = self.get_occupied_tiles()
        moves = []

        for tile in tiles:
            moves += self.random_moves_by_tile(tile)

        return moves

    # Method for making random moves on a specific tile
    def random_moves_by_tile(self, tile):
        moves = []
        units = tile.units[self.playerId]

        while units != 0:
            move = self.make_random_move(tile, units)
            moves.append(move)
            units -= move.number_of_units

        return moves

    def make_random_move(self, tile, units_available):

        units = randint(1, units_available)

        direction = self.get_random_direction()

        random_move = Unit_command(self.playerId, tile, 'move', units, direction)

        return random_move


    def get_random_direction(self):
        rand_number = randint(0,100)

        if rand_number > 75:
            return (0,-1)

        elif rand_number > 50:
            return (0, 1)

        elif rand_number > 25:
            return (-1, 0)

        else:
            return (1, 0)

    def add_building(self, building):
        self.buildings.append(building)

    def increment_resources(self, number):
        self.resources += number

    def decrement_resource(self, number):
        self.resources -= number

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
