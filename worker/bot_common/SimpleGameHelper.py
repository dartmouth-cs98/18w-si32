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

        self.log_file = open('output.log', 'w')
        self.log_file.write(str(time()) + '\n')


    def get_state(self):
        l = sys.stdin.readline()
        while l == '':
            l = sys.stdin.readline()
        state = json.loads(l)

        for player, attributes in state.items():
            attributes = json.loads(attributes)
            player = int(player)

            if player not in self.players:
                self.players[player] = self.SimpleGamePlayer()
            self.log(attributes)
            self.log(type(attributes))
            self.log(player)
            self.log(type(player))
            self.players[player].position = attributes['position']

        return self.format_state()

    def format_state(self):
        state = {
            'players': self.players,
            'myId': self.players[self.myId]
        }

    def create_move_command(self, direction):
        return {
            'player': self.myId,
            'direction': direction
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
