# Player.py
# Class definition for 'Player'

import json
import pickle
import signal
from random import random, randint

from game.Command import Command

from game.params import INITIAL_RESOURCES

# ------------------------------------------------------------------------------
# Player

# A Player represents a single game agent. 
#
# Constructor Arguments
# playerId (number)     - the unique id associated with this player.
# map (Map)             - the map for this game instance.
# bot (Bot)             - the bot associated with this player, for this game instance.
# starting_pos (tuple)  - the starting map position for this player, for this game instance.

class Player:
    def __init__(self, playerId, map, bot, starting_pos):
        self.bot = bot

        self.winner = False
        self.timed_out = False
        self.crashed = False

        self.playerId = playerId
        self.map = map

        self.resources = INITIAL_RESOURCES
        self.starting_pos = starting_pos
        self.units_produced = 0

        starting_tile = self.map.get_tile(self.starting_pos)
        starting_tile.increment_units(playerId)

    def send_state(self, players):
        if self.crashed or self.timed_out:
            return

        to_send = {
            "map": self.map,
            "player": {
                "resources": self.resources
            }
        }
        self.bot.write_binary(pickle.dumps(to_send))

    def get_move(self):
        if self.crashed or self.timed_out:
            return []

        # read a turn from the bot
        commands = []
        try:
            with timeout(seconds=3):
                move_str = self.bot.read()

                # parse out the moves for this turn
                commands = pickle.loads(eval(move_str))

        except TimeoutError as err:
            # if the bot timed out, mark so
            print("TIMED OUT")
            self.timed_out = True
            return []

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

# ------------------------------------------------------------------------------
# Timeout (Helper Class)

class timeout:
    def __init__(self, seconds=1, error_message='Timeout'):
        self.seconds = seconds
        self.error_message = error_message

    def handle_timeout(self, signum, frame):
        raise TimeoutError(self.error_message)

    def __enter__(self):
        signal.signal(signal.SIGALRM, self.handle_timeout)
        signal.alarm(self.seconds)

    def __exit__(self, type, value, traceback):
        signal.alarm(0)
