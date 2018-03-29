from copy import copy
import json
import msgpack
import gzip

# logger strips out unneeded properties and stores/logs only the information needed
# and in the format expected by the front-end. By maintaining this independently,
# as the game underneath changes, we can keep the same log format
class Logger:
    def __init__(self, map, players):
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

                if c.building:
                    cleaned_cell['b'] = c.building.ownerId

                if len(cleaned_cell) == 0:
                    cleaned_cell = None

                this_row.append(cleaned_cell)
            tiles.append(this_row)
        self.turn_log = {
            'map': tiles,
            'cmd': []
        }

    # turn log is a temporary array of moves built up over a turn that
    # gets pushed into the complete log at the end of a turn
    def barebones_new_turn(self, map):
        map_state = map.get_state()

        tiles = []

        # when adding a turn to the log, only include tile data that's needed
        # server will assume that it's zeros if the property is not included
        for row in map_state:
            this_row = []
            for c in row:
                cleaned_cell = {}
                if (tuple(c.position) not in self.cell_resources) or (self.cell_resources[tuple(c.position)] != c.resource):
                    self.cell_resources[(tuple(c.position))] = c.resource
                    cleaned_cell['r'] = c.resource
                for u in c.units:
                    if u > 0:
                        cleaned_cell['u'] = copy(c.units)
                        break

                if c.building:
                    cleaned_cell['b'] = c.building.ownerId

                this_row.append(cleaned_cell)
            tiles.append(this_row)
        self.turn_log = {
            'map': tiles,
            'cmd': []
        }

    def end_turn(self):
        self.log['turns'].append(self.turn_log)

    def add_move(self, command):
        coded_directions = {
            (0, 0): -1,
            (1,0): 0,
            (0,1): 1,
            (-1,0): 2,
            (0,-1): 3
        }

        coded_position = command.position[0] * self.width + command.position[1]

        direction = coded_directions[tuple(command.direction)] if command.direction else None
        clean_command = {
            'u': command.playerId,
            'p': coded_position,
            'd': direction,
            'n': command.number_of_units,
        }

        self.turn_log['cmd'].append(clean_command)

    def add_ranked_player(self, player):
        self.log['rankedBots'].append({
            '_id': player.bot.name,
            'crashed': player.crashed,
            'timedOut': player.timed_out,
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
