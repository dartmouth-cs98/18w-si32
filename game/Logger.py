# Logger.py
# Class implementation for 'Logger'

import json
import gzip
import msgpack
from copy import copy

# Logger strips out unneeded properties and stores/logs only the information needed
# and in the format expected by the front-end. By maintaining this independently,
# as the game underneath changes, we can keep the same log format.
#
# Constructor Arguments
# map (Map) - game Map instance associated with game for which log will be generated.

class Logger:
    def __init__(self, map):
        self.log = {}

        self.width = map.width
        self.height = map.height

        self.log['w'] = map.width
        self.log['h'] = map.height
        self.log['turns'] = []
        self.log['rankedBots'] = []

        self.cell_resources = {}

    # turn log is a temporary array of moves built up over a turn that
    # gets pushed into the complete log at the end of a turn
    def new_turn(self, map):
        map_state = map.get_state()
        cells = []

        # when adding a turn to the log, only include cell data that's needed
        # server will assume that it's zeros if the property is not included
        for row in map_state:
            this_row = []
            for c in row:
                cleaned_cell = { 'r': c.resource }
                for u in c.units:
                    if u > 0:
                        cleaned_cell['u'] = copy(c.units)
                        break

                if c.building:
                    cleaned_cell['b'] = c.building.ownerId

                if len(cleaned_cell) == 0:
                    cleaned_cell = None

                this_row.append(cleaned_cell)
            cells.append(this_row)
        self.turn_log = {
            'map': cells,
            'cmd': []
        }

    # turn log is a temporary array of moves built up over a turn that
    # gets pushed into the complete log at the end of a turn
    def barebones_new_turn(self, map):
        map_state = map.get_state()
        cells = []

        # when adding a turn to the log, only include cell data that's needed
        # server will assume that it's zeros if the property is not included
        for row in map_state:
            this_row = []
            for c in row:
                cleaned_cell = {}
                if (c.position not in self.cell_resources) or (self.cell_resources[c.position] != c.resource):
                    self.cell_resources[c.position] = c.resource
                    cleaned_cell['r'] = c.resource
                for owner, u in enumerate(c.units):
                    if u > 0:
                        cleaned_cell['u'] = u
                        cleaned_cell['p'] = owner
                        break

                if c.building:
                    cleaned_cell['b'] = c.building.ownerId

                this_row.append(cleaned_cell)
            cells.append(this_row)
        self.turn_log = {
            'map': cells,
            'cmd': []
        }

    def end_turn(self):
        self.log['turns'].append(self.turn_log)

    def add_move(self, command):
        coded_position = command.position.x * self.width + command.position.y

        clean_command = {
            'u': command.playerId,
            'p': coded_position,
            'd': command.direction,
            'n': command.num_units,
        }

        self.turn_log['cmd'].append(clean_command)

    def add_ranked_players(self, players):
        for p in players:
            self.log['rankedBots'].append({
                '_id': p.bot.name,
                'crashed': p.crashed,
                'timedOut': p.timed_out,
                'rank': p.rank
            })

    def get_log(self):
        return gzip.compress(msgpack.packb(self.log))

    def get_raw_log(self):
        return json.dumps(self.log)

    def write(self, fileName=None):
        if not fileName:
            print(self.log)
            return

        with gzip.open("%s.mp.gz"%fileName, 'w') as log_file:
            log_file.write(msgpack.packb(self.log))
