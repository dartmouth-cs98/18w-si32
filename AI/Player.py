from random import random, randint
import json
from .Command import Command

starting_distance = 30

class Player:
    def __init__(self, playerId, map, bot, starting_pos):
        self.bot = bot

        self.playerId = playerId
        self.map = map
        self.winner = False
        self.resources = 100

        self.starting_pos = starting_pos

        starting_tile = self.map.get_tile(self.starting_pos)
        starting_tile.increment_units(playerId)

    def send_state(self):
        self.bot.write(self.map.to_json())
        self.bot.write("\n")

    def get_move(self):
        # read a turn from the bot
        move_str = self.bot.read()
        commands = []

        # parse out the moves for this turn
        try:
            move_list = json.loads(move_str)
            commands = [ Command.from_dict(d) for d in move_list ]
            print(commands[0])
        except Exception as err:
            print(err)
            # TODO: if invalid command sent, should probably just kick this noob out of the game

        return commands

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
