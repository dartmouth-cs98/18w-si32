import json
import sys
from time import time

# THIS IS THE EXTERNAL LIBRARY THAT WE LET USERS DOWNLOAD AND IMPORT INTO THEIR CODE
directions = {
    'up': [-1,0],
    'down': [1,0],
    'left': [0,-1],
    'right': [0,1]
}

class SimpleGameHelper():

    def __init__(self):
        self.players = {}

        # first thing the game server sends us through STDIN is our player id
        l = sys.stdin.readline()
        self.myId = int(l)

        self.log_file = open('output.log', 'a')
        self.log_file.write(str(time()) + '\n')


    def load_state(self):
        l = sys.stdin.readline()
        while l == '':
            l = sys.stdin.readline()

        board_state = json.loads(l)

        self.board = board_state

        return self.board

    # returns a list of all tiles that have units for this player on them
    def get_my_units(self):
        self.tiles = []

        for r in self.board:
            for c in r:
                if c['units'][self.myId] > 0:
                    self.tiles.append(c)

        self.log(self.tiles)

        return self.tiles

    def create_move_command(self, location, direction, n_units):
        return {
            'playerId': self.myId,
            'location': location,
            'command': 'move',
            'number_of_units': n_units,
            'direction': directions[direction]
        }

    def send_commands(self, commands):
        print(json.dumps(commands))
        sys.stdout.flush()

    def log(self, log):
        self.log_file.write(str(log) + '\n')
        self.log_file.flush()


    class SimpleGamePlayer():
        def __init__(self):
            self.position = None
        def toJSON(self):
            return json.dumps(self, default=lambda o: o.__dict__,
                sort_keys=True)
