import json
import sys
from time import time

# THIS IS THE EXTERNAL LIBRARY THAT WE LET USERS DOWNLOAD AND IMPORT INTO THEIR CODE
class SimpleGameHelper():

    def __init__(self):
        self.players = {}

        # first thing the game server sends us through STDIN is our player id
        l = sys.stdin.readline()
        self.myId = int(l)

        self.log_file = open('output.log', 'a')
        self.log_file.write(str(time()) + '\n')


    def get_state(self):
        l = sys.stdin.readline()
        while l == '':
            l = sys.stdin.readline()

        board_state = json.loads(l)

        self.board = board_state

        return self.board

    def create_move_command(self, location, direction):
        return {
            'playerId': self.myId,
            'location': [0,0],
            'command': 'move',
            'number_of_units': 1,
            'direction': [1,0]
        }

    def send_commands(self, commands):
        print(json.dumps(commands))
        sys.stdout.flush()

    def log(self, log):
        self.log_file.write(str(log) + '\n')


    class SimpleGamePlayer():
        def __init__(self):
            self.position = None
        def toJSON(self):
            return json.dumps(self, default=lambda o: o.__dict__,
                sort_keys=True)
