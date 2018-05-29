# Game.py
# Class implementation for 'Game'

import sys
from copy import copy
from subprocess import Popen, PIPE
from abc import ABC, abstractmethod

from game.Map import Map
from game.Cell import Cell
from game.Rules import Rules
from game.Logger import Logger
from game.Player import Player
from game.Command import Command
from game.Coordinate import Coordinate

from game.params import (
    MAX_ITERS,
    MOVE_COMMAND,
    MINE_COMMAND,
    BUILD_COMMAND,
    STARTING_POSITIONS,
    DEBUG_LOG_FN,
    LOG_FE
)

# ------------------------------------------------------------------------------
# Game

# Constructor Arguments
# bots (list)       - a list of the bots involved in this game instance
# uniform (boolean) - True if distribution of map resources should be uniform, False otherwise

class Game(ABC):
    def __init__(self, bots, uniform=False):
        self.map = Map(len(bots), uniform)

        self.initialize_players(bots, self.map)

        self.logger = Logger(self.map)

        self.debug_fp = open(DEBUG_LOG_FN, "w")

        self.rules = Rules(self.map, self.players)

        self.iter = 0

        self.winner = None

        self.bots = bots

        for b in self.bots:
            b.prep()

        for b in self.bots:
            b.run()

        super().__init__()

    # --------------------------------------------------------------------------
    # MAIN METHODS

    # initalizes players
    def initialize_players(self, bots, map):
        self.players = []
        positions = STARTING_POSITIONS[len(bots) - 1]

        # create a player object for each bot
        for count, bot in enumerate(bots):
            pos = Coordinate(x=positions[count][0], y=positions[count][1])
            self.players.append(Player(count, self.map, bots[count], pos))

        # create a starting hive for each player
        for player in self.players:
            self.map.get_cell(player.starting_pos).create_hive(player.playerId)

    # runs a game and returns when it is over
    def start(self):
        for p in self.players:
            p.send_init_data()

        # loop until somebody wins, or we time out!
        while not self.is_game_over():
            # reset log for this turn
            self.logger.new_turn(self.map, self.players)

            self.send_state()
            self.read_moves()

            # log that the turn is over
            self.logger.end_turn()

            self.iter += 1

        # once game ends, log one more turn,
        # so that viz has a final state to work with
        self.logger.new_turn(self.map, self.players)
        self.logger.end_turn()

        self.rank_players()
        self.log_winner()

    # send all players the updated game state so they can make decisions
    def send_state(self):
        # use the logger's representation of the map
        cur_state = self.logger.get_current_turn()

        # and send that to everyone
        for p in self.players:
            p.send_state(cur_state)

    # read all moves from the players and update state accordingly
    def read_moves(self):
        moves_by_player = []
        # will be nested list [ [commands for player1], [commands for player2], ... ]

        for p in self.players:
            m = p.get_move()
            moves_by_player.append(m)

        # check moves for combat, and sort by type of command
        # run both players moves through combat phase, return updated list of moves
        moves_by_player = self.rules.update_combat_phase(moves_by_player)
        moves_by_player = sort_moves(moves_by_player)
        moves_by_player = self.add_implicit_commands(moves_by_player)

        for player_moves in moves_by_player:
            self.execute_moves(player_moves)

        # update statuses / unit numbers, etc.
        for col in self.map.cells:
            for cell in col:
                cell.update_cell(self.players)

    # returns true if at least one player in the game is still "alive"
    # in terms of valid code execution
    def has_running_player(self):
        for p in self.players:
            # if any player is alive, return true
            if not (p.crashed or p.timed_out):
                return True
        return False

    def is_game_over(self):
        return self.has_combat_winner() or self.time_limit_reached() or (not self.has_running_player())

    def rank_players(self):
        crashed_players = [] # bots that crashed
        valid_players = [] # bots that did not crash

        # partition players by whether they crashed
        for p in self.players:
            (crashed_players if p.crashed else valid_players).append(p)

        # first we order by # of units, then by # of hives
        # effectively, this uses units as tiebreaker, since the sort is stable
        ranked_players = sorted(valid_players, key=lambda p: p.total_units(), reverse=True)
        ranked_players = sorted(ranked_players, key=lambda p: len(p.get_hives()), reverse=True)

        for i, p in enumerate(ranked_players):
            p.rank = i + 1

        # we'll say that all crashed players tied
        rank_crashed = len(valid_players) + 1
        for p in crashed_players:
            p.rank = rank_crashed

        # put them all together
        self.ranked_players = ranked_players + crashed_players

    # returns true if only one player has hives left
    def has_combat_winner(self):
        return sum([1 for p in self.players if p.has_hive()]) <= 1

    # returns true if the game is over due to time
    def time_limit_reached(self):
        return self.iter >= MAX_ITERS

    # --------------------------------------------------------------------------
    # PLAYER MOVEMENT METHODS

    def execute_moves(self, moves):
        for move in moves:
            self.execute_move(move)

    def execute_move(self, move):
        if self.rules.verify_move(move):
            self.rules.update_by_move(move)
            self.logger.add_move(move)

    def count_units_sent(self, moves):
        cells = {}

        for move in moves:
            if move.position not in cells:
                cells[move.position] = move.num_units
            else:
                cells[move.position] += move.num_units

        return cells

    def add_implicit_commands(self, moves):
        new_moves = copy(moves)
        counts = []

        for player_moves in moves:
            counts.append(self.count_units_sent(player_moves))

        for i, command_count in enumerate(counts):
            for cell_position in command_count:
                cell = self.map.get_cell(cell_position)

                if command_count[cell_position] < cell.units[i]:
                    remaining_units = cell.units[i] - command_count[cell_position]
                    new_moves[i].append(Command(i, cell_position, MINE_COMMAND, remaining_units, direction=None))

        return new_moves

    # --------------------------------------------------------------------------
    # LOGGING METHODS

    def log_winner(self):
        self.logger.add_ranked_players(self.ranked_players)

    def write_log(self, fn):
        self.logger.write(fn)

    def get_log(self):
        return self.logger.get_log()

    def get_raw_log(self):
        return self.logger.get_raw_log()

    def get_ranked_players(self):
        return self.ranked_players

    # log to the debug file
    def write_debug_log(self, out):
        self.debug_fp.write(str(out) + "\n")
        self.debug_fp.flush()

# ------------------------------------------------------------------------------
# Helper Functions

# sort moves so that they are executed in the correct order:
# move, build, mine
def sort_moves(moves_by_player):
    sorted_moves = []

    for individual_player_moves in moves_by_player:
        move_commands = []
        build_commands = []
        mine_commands = []

        for command in individual_player_moves:
            if command.command == MOVE_COMMAND:
                move_commands.append(command)
            elif command.command == BUILD_COMMAND:
                build_commands.append(command)
            elif command.command == MINE_COMMAND:
                mine_commands.append(command)
            else:
                # TODO: panic!
                pass

        sorted_moves.append(move_commands + build_commands + mine_commands)

    # end result is a flat list of the form
    # sorted_moves = [
    #   ...all move commands from all players...
    #   ...all build commands from all players...
    #   ...all mine commands from all players...
    # ]
    return sorted_moves
