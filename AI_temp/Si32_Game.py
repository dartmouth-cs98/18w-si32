import json
from unit_command import Unit_command
from Player import Player
from collections import namedtuple


def json_to_object(json_object, type):  # helper function for json -> object

    if type == "unit_command":
        return Unit_command(json_object['tile'], json_object['unit_command'], json_object['number_of_units'], json_object['direction'])


def json_to_object_list(json_list, type):  # turn list of json to list of objects
    objects = []

    if type == 'unit_command':  # checking type to allow other json -> object ops

        for json_obj in json_list:
            objects.append(json_to_object(json_obj, type))

        return objects

class Game_state:

    def __init__(self, map, rules, number_of_players, user_code):

        self.map = map

        self.players = self.initialize_players(number_of_players, map, user_code)

        self.rules = rules(self.map, self.players)

        self.game_over = False

    def play_game(self):

        while not self.game_over:  # Main loop. Simulates both players taking a turn until someone wins
            self.play_a_turn()

    def play_a_turn(self):  # gets moves from both players and executes them
        moves = []
        i = 0

        for player in self.players:
            moves.append(player.get_moves())

        while i < self.number_of_players:
            self.execute_moves(moves[i], i)
            i += 1

    def initialize_players(self, number_of_players, map, user_code):  # initalizes players
        i = 0
        players = []

        while i < number_of_players:
            temp_player = Player(i, self.map, user_code[i])
            i += 1
            players.append(temp_player)

        return players

    def execute_moves(self, moves, player):
        moves = self.json_to_object_list(moves)

        for move in moves:
            execute_move(move, player)
