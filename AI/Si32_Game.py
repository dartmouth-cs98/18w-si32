from unit_command import Unit_command
from Player import Player
from Map import Map
from Rules import Rules
from json_helpers import json_to_object_list


class Game_state:

    def __init__(self, map, rules, number_of_players, user_code, gameId=1000):

        # Game state is determined by map, players, and rules. Higher level
        # game state takes these objects and runs games, allowing for a
        # game agnostic framework

        self.map = map(number_of_players)

        self.players = self.initialize_players(number_of_players, self.map, user_code)

        self.rules = rules(self.map, self.players)

        self.game_over = False

        self.gameId = gameId

        self.initialize_game_log()

    def initialize_game_log(self):
        game_log = open(str(self.gameId) + "_game_log.txt","w+")
        game_log.write("Replay log of game " + str(self.gameId) + "\n")

    # ------------------ Main Functions ---------------------

    def play_game(self):

        while not self.game_over:  # Main loop. Simulates both players taking a turn until someone wins
            self.play_a_turn()

    def play_a_turn(self):  # gets moves from both players and executes them
        moves = []
        i = 0

        for player in self.players:
            #TODO: Replace the get random moves with real calls to user code
            moves.append(player.get_random_moves())

        #TODO: Update() - updates game state given player moves
        # Update() will have two parts,

    def execute_moves(self, moves, player):
        moves = json_to_object_list(moves)

        for move in moves:
            execute_move(move, player)


    # ------------ Initializing function ------------------

    def initialize_players(self, number_of_players, map, user_code):  # initalizes players
        i = 0
        players = []

        while i < number_of_players:
            temp_player = Player(i, self.map, user_code[i])
            i += 1
            players.append(temp_player)

        return players


test = Game_state(Map, Rules, 2, 'hi')
print(test.players[0].get_occupied_tiles()[0])
print(test.players[1].get_occupied_tiles()[0])

test.play_a_turn()
print(test.players[0].get_occupied_tiles()[0])
print(test.players[1].get_occupied_tiles()[0])
