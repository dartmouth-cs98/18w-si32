# Player.py
# Class definition for 'Player'

import json
import signal
from random import random, randint

from game.Command import Command
from game.Coordinate import Coordinate

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

        self.rank = None # finih position

        self.winner = False
        self.timed_out = False
        self.crashed = False

        self.playerId = playerId
        self.map = map

        self.resources = INITIAL_RESOURCES
        self.starting_pos = starting_pos
        self.units_produced = 0

        starting_cell = self.map.get_cell(self.starting_pos)
        starting_cell.increment_units(playerId)

    # tell each bot their number and # of players in the game
    def send_init_data(self):
        self.bot.write(self.playerId)
        self.bot.write(self.map.num_players)

    def send_state(self, state):
        if self.crashed or self.timed_out:
            return

        self.bot.write(state)

    def get_move(self):
        if self.crashed or self.timed_out:
            return []

        # read a turn from the bot
        commands = []
        try:
            with timeout(seconds=3):
                move = self.bot.read()

                # parse out the moves for this turn
                commands = [Command.from_dict(self.playerId, c) for c in move]
                for command in commands:
                    command.position = Coordinate(command.position)

        except TimeoutError as err:
            # if the bot timed out, mark so
            print("TIMED OUT")
            self.timed_out = True
            return []

        return commands

    def total_units(self):
        units = 0
        cells = self.get_occupied_cells()
        for cell in cells:
            units += cell.units[self.playerId]

        return units

    # Find all cells in which player has units to control
    def get_occupied_cells(self):
        cells = []
        for col in self.map.cells:
            for cell in col:
                if cell.units[self.playerId] > 0:
                    cells.append(cell)

        return cells

    def get_buildings(self):
        cells = []
        for col in self.map.cells:
            for cell in col:
                if cell.building and cell.building.ownerId == self.playerId:
                    cells.append(cell)

        return cells

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
