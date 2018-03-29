import json
from game.Command import Command
from game.Game import Game
from game.Player import Player
from game.Map import Map
from game.Tile import Tile
from game.Rules import Rules
from game.Logger import Logger
import signal

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

MAX_ITERS = 3000

class Game_state(Game):

    def __init__(self, bots):
        # Game state is determined by map, players, and rules. Higher level
        # game state takes these objects and runs games, allowing for a
        # game agnostic framework
        # GB - I'm more tightly coupling these at the moment to get things off
        # the ground. Won't be hard to abstract back out when needed.

        num_players = len(bots)

        self.map = Map(num_players)

        self.initialize_players(bots, self.map)

        self.logger = Logger(self.map, self.players)

        self.debugLogFile = open("./gameserver.log", "w")

        self.rules = Rules(self.map, self.players)

        self.iter = 0

        self.winner = None

        self.state_log = []

        super().__init__(bots)


    # ------------ Initializing function ------------------

    def initialize_players(self, bots, map):  # initalizes players
        i = 0
        self.players = []

        # hardcoded for two bots
        self.players.append(Player(0, self.map, bots[0], (5, 5)))
        self.players.append(Player(1, self.map, bots[1], (15, 15)))

        self.map.get_tile((4,4)).create_building(0)
        self.map.get_tile((16,16)).create_building(1)

    # ------------------ Main Functions ---------------------
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

        # log one more turn, so that viz has a final state to work with
        # self.logger.new_turn(self.map) # uncomment this line and comment the one under to get more verbose log
        self.logger.barebones_new_turn(self.map)
        self.logger.end_turn()


    # send all players the updated game state so they can make decisions
    def send_state(self):
        for p in self.players:
            try:
                p.send_state(self.players)
            except Exception as err:
                p.crashed = True

    # read all moves from the players and update state accordingly
    def read_moves(self):

        moves = []
        for p in self.players:
            # a timed-out or crashed player is done; they just sit there
            # attempt to get moves for the bot
            try: 
                with timeout(seconds=3):
                    m = p.get_move()
                    moves.append(m)
            except (TimeoutError, Exception) as err:
                # if the bot timed out, mark so
                if type(err) is TimeoutError:
                    p.timed_out = True
                    moves.append([]) 

                # TODO figure out how to handle a crashed bot in here
                # right now seems like because the docker container crashes it falls
                # all the way through to startWorker.py instead of here?


        # Check moves for combat, and sort by type of command
        moves = self.rules.update_combat_phase(moves)  # Run both players moves through combat phase, return updated list of moves
        moves = sort_moves(moves)

        for player_moves in moves:
            self.execute_moves(player_moves)

        # Update statuses/unit numbers, etc.
        for col in self.map.tiles:
            for tile in col:
                tile.update_tile(self.players)

    def update_units_numbers(self):
        for tiles in self.map.tiles:
            for tile in tiles:
                tile.update_units_number()

    def has_living_player(self):
        # TODO should return false if all players have timed or errored out
        return True

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

    # ---------------- PLAYER MOVES FUNCTIONS ----------------

    def execute_moves(self, moves):
        for move in moves:
            self.execute_move(move)

    def execute_move(self, move):
        if self.rules.verify_move(move):
            self.logger.add_move(move)
            self.rules.update_by_move(move)

    def write_log(self, file_name):
        self.logger.write(file_name)

    def get_log(self):
        return self.logger.get_log()

    def get_ranked_by_units(self):
        if self.players[0].total_units() > self.players[1].total_units():
            return self.players

        return [self.players[1], self.players[0]]

    def log_winner(self):
        result = self.players
        if result[0] != self.winner:
            temp = result[0]
            result[0] = result[1]
            result[1] = temp

        for player in result:
            self.logger.add_ranked_bot(player.bot)

    def log(self, out):
        self.debugLogFile.write(str(out) + "\n")
        self.debugLogFile.flush()

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

