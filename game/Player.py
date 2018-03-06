from random import random, randint
import json
from .Command import Command
import pickle

starting_distance = 30

class Player:
    def __init__(self, playerId, map, bot, starting_pos):
        self.bot = bot

        self.playerId = playerId
        self.map = map
        self.winner = False
        self.resources = 100

        self.starting_pos = starting_pos

        self.units_produced = 0

        starting_tile = self.map.get_tile(self.starting_pos)
        starting_tile.increment_units(playerId)


    def send_state(self, players):
        to_send = {
            "map": self.map,
            "player": {
                "resources": self.resources
            }
        }
        self.bot.write_binary(pickle.dumps(to_send))

    def get_move(self):
        # read a turn from the bot
        move_str = self.bot.read()
        commands = []

        # parse out the moves for this turn
        try:
            commands = pickle.loads(eval(move_str))
            # commands = [ Command.from_dict(self.playerId, d) for d in move_list ]
        except Exception as err:
            print(err)
            # TODO: if invalid command sent, should probably just kick this noob out of the game

        return commands

    def total_units(self):
        units = 0
        tiles = self.get_occupied_tiles()
        for tile in tiles:
            units += tile.units[self.playerId]

        return units

    # Find all tiles in which player has units to control
    def get_occupied_tiles(self):
        tiles = []

        for col in self.map.tiles:
            for tile in col:
                if tile.units[self.playerId] > 0:
                    tiles.append(tile)

        return tiles

    def get_buildings(self):
        tiles = []

        for col in self.map.tiles:
            for tile in col:
                if tile.building and tile.building.ownerId == self.playerId:
                    tiles.append(tile)

        return tiles

    def has_building(self):
        return len(self.get_buildings()) > 0

    def increment_units_produced(self):
        self.units_produced += 1

    def increment_resources(self, number):
        self.resources += number

    def decrement_resources(self, number):
        self.resources -= number
