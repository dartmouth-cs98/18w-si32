import json
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

        self.json_log = self.initialize_json_log()


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

        self.map.get_tile([39,40]).increment_units(1, 2)
        moves[1].append(Unit_command(1, self.map.get_tile([39,40]), 'move', 2, [1,0]))

        moves = self.rules.update_combat_phase(moves)  # Run both players moves through combat phase, return updated list of moves

        for player_moves in moves:
            self.execute_moves(player_moves)

    def update_units_numbers(self):
        for tiles in self.map.tiles:
            for tile in tiles:
                tile.update_units_number()

    # ---------------- PLAYER MOVES FUNCTIONS ----------------

    def execute_moves(self, moves):
        #moves = json_to_object_list(moves, 'move')

        for move in moves:
            self.execute_move(move)

    def execute_move(self, move):
        if self.rules.verify_move(move):

            self.json_log_move(move)
            self.rules.update_by_move(move)


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

    def write_game_log(self):
        temp = json.dumps(self.json_log)
        json_log = json.loads(temp)

        with open('data.txt', 'w') as outfile:
            json.dump(json_log, outfile)

    def initialize_json_log(self):
        json_log = {}
        board_info = {}
        board_info['width'] = self.map.width
        board_info['height'] = self.map.height
        board_info['player1'] = [self.players[0].starting_x, self.players[0].starting_y]
        json_log['board_state'] = board_info
        json_log['commands'] = []
        json_log['rank'] = []

        return json_log

    def json_log_move(self, move):
        if not self.replay:
            self.json_log['commands'].append(move.to_json())


test = Game_state(Map, Rules, 2, 'hi')


test.play_a_turn()
p1 = test.players[0].get_occupied_tiles()
p2 = test.players[1].get_occupied_tiles()
test.write_game_log()

print('tesdf')

for x in p1:
    print(x)

for b in p2:
    print(b)
