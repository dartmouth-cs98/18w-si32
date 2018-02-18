from unit_command import Unit_command
from Player import Player
from Map import Map
from Tile import Tile
from Rules import Rules
from json_helpers import json_to_object_list


class Game_state:

    def __init__(self, map, rules, number_of_players, user_code, gameId=1000, replay=False):

        # Game state is determined by map, players, and rules. Higher level
        # game state takes these objects and runs games, allowing for a
        # game agnostic framework

        self.map = map(number_of_players)

        self.players = self.initialize_players(number_of_players, self.map, user_code)

        self.rules = rules(self.map, self.players)

        self.game_over = False

        self.gameId = gameId

        self.replay = replay

        self.game_log_file = self.initialize_game_log()


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

        for player_moves in moves:
            self.execute_moves(player_moves)

        #TODO: Update() - updates game state given player moves
        # Update() will have two parts,

    # ---------------- PLAYER MOVES FUNCTIONS ----------------

    def execute_moves(self, moves):
        #moves = json_to_object_list(moves, 'move')

        for move in moves:
            self.execute_move(move)

    def execute_move(self, move):
        if self.rules.verify_move(move):

            self.rules.update_by_move(move)
            self.log_move(move)


    # ------------ Initializing function ------------------

    def initialize_players(self, number_of_players, map, user_code):  # initalizes players
        i = 0
        players = []

        while i < number_of_players:
            temp_player = Player(i, self.map, user_code[i])
            i += 1
            players.append(temp_player)

        return players

    # ------------ REPLAY FILE FUNCTIONS ----------------

    def initialize_game_log(self):
        if not self.replay:
            file_name = str(self.gameId) + "_game_log.txt"
            game_log = open(file_name,"w+")

            starting_1 = [self.players[0].starting_x, self.players[0].starting_y]
            starting_2 = [self.players[1].starting_x, self.players[1].starting_y]
            game_log.write("Replay log of game " + str(self.gameId) + "\n")
            game_log.write(str(self.map.width)+ ',' +str(self.map.height)+ ',' +str(starting_1)+ ',' +str(starting_2)+ '\n')
            game_log.close()

            return file_name

    def log_move(self, move):
        if not self.replay:
            game_log = open(self.game_log_file,"a")
            game_log.write(move.to_json() + "\n")
            game_log.close()



test = Game_state(Map, Rules, 2, 'hi')
print(test.players[0].get_occupied_tiles()[0])
print(test.players[1].get_occupied_tiles()[0])

test_tile = Tile([40,40], 2)

test.play_a_turn()
print(test.players[0].get_occupied_tiles()[0])
print(test.players[1].get_occupied_tiles()[0])
#print(test.rules.verify_move(Unit_command(0, test_tile, 'move', 2, [1,0])))
