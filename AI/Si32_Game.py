import json
from Command import Command
from Game import Game
from Player import Player
from Map import Map
from Tile import Tile
from Rules import Rules
from json_helpers import json_to_object_list

class Game_state(Game):

    def __init__(self, map, rules, bots):
        # Game state is determined by map, players, and rules. Higher level
        # game state takes these objects and runs games, allowing for a
        # game agnostic framework
        num_players = len(bots)

        self.map = map(num_players)

        self.initialize_players(bots, self.map)

        self.game_over = False

        self.json_log = self.initialize_json_log()

        self.rules = rules(self.map, self.players)

        self.iter = 0

        self.state_log = []
        # super().__init__(bots)


    # ------------ Initializing function ------------------

    def initialize_players(self, bots, map):  # initalizes players
        i = 0
        self.players = {}
        for i, bot in enumerate(bots):
            self.players[i] = Player(i, self.map, bot, (i*5, i*5))

    # ------------------ Main Functions ---------------------
    def start():
        pass

    def game_loop():
        pass

    def play_game(self):
        while not self.game_over and self.iter < 30:  # Main loop. Simulates both players taking a turn until someone wins
            self.play_a_turn()
            self.iter += 1

    # gets moves from both players and executes them
    def play_a_turn(self, moves):
        print("Play turn")

        # Check moves for combat, and sort by type of command
        moves = self.rules.update_combat_phase(moves)  # Run both players moves through combat phase, return updated list of moves
        moves = sort_moves(moves)

        for player_moves in moves:
            self.execute_moves(player_moves)

        # Update statuses/unit numbers, etc.
        for col in self.map.tiles:
            for tile in col:
                tile.update_tile()

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
        board_info['player1'] = self.players[0].starting_pos
        board_info['player2'] = self.players[1].starting_pos
        json_log['board_state'] = board_info
        json_log['commands'] = []
        json_log['rank'] = []

        return json_log

    def json_log_move(self, move):
        print("LOGGING", move)
        self.json_log['commands'].append(move.to_json())

# We want to execute commmands in the following order: move, build, mine
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

test = Game_state(Map, Rules, [1,2])

# moves = self.get_random_player_moves()

# self.map.get_tile([39,40]).increment_units(1, 2)
moves = [ [], [] ]
moves[0].append(Command(0, test.map.get_tile([0,0]), 'move', 1, [1,0]))
moves[1].append(Command(1, test.map.get_tile([5,5]), 'move', 1, [1,0]))

test.play_a_turn(moves)
p1 = test.players[0].get_occupied_tiles()
p2 = test.players[1].get_occupied_tiles()
test.write_game_log()

print(test.map.tiles[1][0])
