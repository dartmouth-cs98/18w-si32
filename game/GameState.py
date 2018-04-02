# GameState.py
# Class implementation for GameState

import json
from copy import copy

from game.Command import Command
from game.Game import Game
from game.Player import Player
from game.Map import Map
from game.Cell import Cell
from game.Rules import Rules
from game.Logger import Logger

from game.params import MAX_ITERS

# ------------------------------------------------------------------------------
# GameState

# Constructor Arguments
# bots (list) - a list of the bots involved in this game instance.

class GameState(Game):
    def __init__(self, bots):

        # Game state is determined by map, players, and rules.
        # Higher level game state takes these objects and runs games, allowing for a
        # game agnostic framework
        #
        # GB - I'm more tightly coupling these at the moment to get things off
        # the ground. Won't be hard to abstract back out when needed.

        self.map = Map(len(bots))

        self.initialize_players(bots, self.map)

        self.logger = Logger(self.map)

        self.debugLogFile = open("./gameserver.log", "w")

        self.rules = Rules(self.map, self.players)

        self.iter = 0

        self.winner = None

        super().__init__(bots)


    # --------------------------------------------------------------------------
    # INITIALIZING FUNCTION

    def initialize_players(self, bots, map):  # initalizes players
        i = 0
        self.players = []

        # hardcoded for two bots
        self.players.append(Player(0, self.map, bots[0], (5, 5)))
        self.players.append(Player(1, self.map, bots[1], (15, 15)))

        self.map.get_cell((4,4)).create_building(0)
        self.map.get_cell((16,16)).create_building(1)

    # --------------------------------------------------------------------------
    # MAIN FUNCTIONS

    def start(self):
        self.game_loop()

    def game_loop(self):
        # loop until somebody wins, or we time out!
        while self.winner is None:
            # reset log for this turn
            self.logger.barebones_new_turn(self.map)

            self.send_state()
            self.read_moves()

            # log that the turn is over
            self.logger.end_turn()

            self.iter += 1

            self.check_game_over()

        # once game ends, log one more turn, so that viz has a final state to work with

        # uncomment this line and comment the one under to get more verbose log
        # self.logger.new_turn(self.map)
        self.logger.barebones_new_turn(self.map)
        self.logger.end_turn()


    # send all players the updated game state so they can make decisions
    def send_state(self):
        for p in self.players:
            p.send_state(self.players)

    # read all moves from the players and update state accordingly
    def read_moves(self):
        moves = []
        for p in self.players:
            m = p.get_move()
            moves.append(m)

        # check moves for combat, and sort by type of command
        # run both players moves through combat phase, return updated list of moves
        moves = self.rules.update_combat_phase(moves)
        moves = sort_moves(moves)
        moves = self.add_implicit_commands(moves)

        for player_moves in moves:
            self.execute_moves(player_moves)

        # update statuses / unit numbers, etc.
        for col in self.map.cells:
            for cell in col:
                cell.update_cell(self.players)

    def update_units_numbers(self):
        for cells in self.map.cells:
            for cell in cells:
                cell.update_units_number()

    # returns true if at least one player in the game is still "alive"
    # in terms of valid code execution
    def has_living_player(self):
        for p in self.players:
            # if any player is alive, return true
            if not (p.crashed or p.timed_out):
                return True
        return False

    def check_game_over(self):
        if (self.check_unit_victory_condition()) or (self.time_limit_reached()) or not self.has_living_player():
            self.log_winner()
            return True
        else:
            return False

    def check_unit_victory_condition(self):
        player1_b = self.players[0].has_building()
        player2_b = self.players[1].has_building()

        if (player1_b and not player2_b):
            self.winner = self.players[0]
            return True

        if (player2_b and not player1_b):
            self.winner = self.players[1]
            return True

        return False

    def check_unit_victory_condition_multi(self):
        i = 0
        index = -1

        players_with_buildings = 0 #the number of players who own at least one building

        for player in self.players:
            if player.has_building(): #if a player has a building
                index = i #save their ID
                players_with_buildings += 1
            i += 1

        if (players_with_buildings == 1): #if only one player has nonzero buildings, then they are the winner
            self.winner = self.players[index] #the saved ID must therefore also be the winner's ID
            return True

        return False

    def time_limit_reached(self):
        if self.iter < MAX_ITERS:
            return False

        p1units = self.players[0].total_units()
        p2units = self.players[1].total_units()

        if p1units > p2units:
            self.winner = self.players[0]

        else:
            self.winner = self.players[1]

        return True

    def time_limit_reached_multi(self): #if time limit reached, the player with the highest number of units is the winner
        if self.iter < MAX_ITERS:
            return False

        max_player = -1 #ID of the player with the most units (so far)
        max_units = -1 # number of units controlled by 'max_player'

        i = 0
        for player in self.players:
            if (player.total_units() >= max_units):
                max_player = i
                max_units = player.total_units()

            i += 1

        self.winner = self.players[max_player]

        return True

    # --------------------------------------------------------------------------
    # PLAYER MOVEMENT FUNCTIONS

    def execute_moves(self, moves):
        for move in moves:
            self.execute_move(move)

    def execute_move(self, move):
        if self.rules.verify_move(move):
            self.logger.add_move(move)
            self.rules.update_by_move(move)

    def count_units_sent(self, moves):
        cells = {}

        for move in moves:
            if tuple(move.position) not in cells:
                cells[tuple(move.position)] = move.number_of_units

            else:
                cells[tuple(move.position)] += move.number_of_units

        return cells

    def add_implicit_commands(self, moves):
        new_moves = copy(moves)
        counts = []

        for player in moves:
            counts.append(self.count_units_sent(player))

        i = 0

        while i < len(counts):
            command_count = counts[i]

            for cell_position in command_count:

                cell = self.map.get_cell(list(cell_position))

                if command_count[cell_position] < cell.units[i]:

                    remaining_units = cell.units[i] - command_count[cell_position]

                    new_moves[i].append(Command(i, list(cell_position), 'mine', remaining_units, [0,0]))

            i += 1

        return new_moves


    def write_log(self, file_name):
        self.logger.write(file_name)

    def get_log(self):
        return self.logger.get_log()

    def get_ranked_by_units(self):
        if self.players[0].total_units() > self.players[1].total_units():
            return self.players

        return [self.players[1], self.players[0]]

    def get_ranked_by_units_multi(self):
        s = sorted(self.players, key=lambda player: player.total_units()) #sort the list of players by their number of units

        return s.reverse() #return the reversed list since the players with the most units are ranked first

    def log_winner(self):
        result = self.players
        if result[0] != self.winner:
            temp = result[0]
            result[0] = result[1]
            result[1] = temp

        for player in result:
            self.logger.add_ranked_player(player)

    # TODO: write a multiplayer version of log_winner

    def log(self, out):
        self.debugLogFile.write(str(out) + "\n")
        self.debugLogFile.flush()

# ------------------------------------------------------------------------------
# Helper Functions

# execute commmands in the following order: move, build, mine
def sort_moves(moves):
    sorted_moves = []

    for player in moves:
        move = []
        build = []
        mine = []

        for command in player:
            if command.command == 'move':
                move.append(command)
            elif command.command == 'build':
                build.append(command)
            else:
                mine.append(command)

        sorted_moves.append(move + build + mine)

    return sorted_moves
