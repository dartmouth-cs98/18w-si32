from copy import copy
import json
import msgpack

# logger strips out unneeded properties and stores/logs only the information needed
# and in the format expected by the front-end. By maintaining this independently,
# as the game underneath changes, we can keep the same log format
class Logger:
    def __init__(self, map, players):
        self.log = {}

        board_info = {}
        board_info['width'] = map.width
        board_info['height'] = map.height
        board_info['player1'] = players[0].starting_pos
        board_info['player2'] = players[1].starting_pos

        self.log['board_state'] = board_info
        self.log['turns'] = []
        self.log['rankedBots'] = []

    # turn log is a temporary array of moves built up over a turn that
    # gets pushed into the complete log at the end of a turn
    def new_turn(self, map):
        map_state = map.get_state()

        tiles = []

        # when adding a turn to the log, only include tile data that's needed
        # server will assume that it's zeros if the property is not included
        for row in map_state:
            this_row = []
            for c in row:
                cleaned_cell = {
                    'r': c.resource
                }
                for u in c.units:
                    if u > 0:
                        cleaned_cell['u'] = copy(c.units)
                        break

                if len(cleaned_cell) == 0:
                    cleaned_cell = None

                this_row.append(cleaned_cell)
            tiles.append(this_row)
        self.turn_log = {
            'map': tiles,
            'cmd': []
        }

    def end_turn(self):
        self.log['turns'].append(self.turn_log)

    def add_move(self, command):
        clean_command = {
            'u': command.playerId,
            'p': command.position,
            'd': command.direction,
            'n': command.number_of_units,
        }

        self.turn_log['cmd'].append(clean_command)

    def add_ranked_bot(self, bot):
        self.log['rankedBots'].append(bot.name)

    def get_log(self):
        return self.log

    def write(self, fileName=None):
        if not fileName:
            print(self.log)
            return
        with open(fileName, 'wb') as log_file:
            msgpack.pack(self.log, log_file)
