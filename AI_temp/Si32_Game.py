from unit_command import Unit_command
from Player import Player
from json_helpers import json_to_object_list


class Game_state:

    def __init__(self, map, rules, number_of_players, user_code):

        # Game state is determined by map, players, and rules. Higher level
        # game state takes these objects and runs games, allowing for a
        # game agnostic framework

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
        moves = json_to_object_list(moves)

        for move in moves:
            execute_move(move, player)
