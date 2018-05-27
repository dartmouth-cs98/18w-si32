# GameHelper.py
# Class implementation for 'GameHelper'

import sys
import json
import struct
import msgpack

from game.Map import Map
from game.Command import Command
from game.Coordinate import Coordinate, direction_deltas
from game.params import MOVE_COMMAND, BUILD_COMMAND, MINE_COMMAND, HIVE_COST, Direction

from game.ObstacleMapProblem import ObstacleMapProblem

from game.Bot import read, write
from game.astar_search import astar_search

# ------------------------------------------------------------------------------
# GameHelper

# A GameHelper instance wraps all of the game logic functionality into
# a convenient package to aid users in bot development.

class GameHelper:
    def __init__(self):
        # first thing the game server sends us through STDIN is our player id
        self.myId = read(sys.stdin.buffer)

        # second thing is number of players
        self.numPlayers = read(sys.stdin.buffer)

        self.params = {}    # default the params to an empty dict
        self.load_params()  # then load in the params (3rd thing sent to a bot)

        self.map = None

        # list of enemy IDs
        self.eIds = list(range(self.numPlayers))
        self.eIds.remove(self.myId)

        self.me = {"resources": 0}

        self.turn_handler = None
        self.logfile = open("./game" + str(self.myId) + ".log", "w")
        self.log(self.myId)

        self.move_dict = {}
        self.command_queue = []

    def __del__(self):
        self.logfile.close()

    # --------------------------------------------------------------------------
    # BOT PARAMETERS

    # Reads bot parameters over stdin and sets them in parameter dictionary
    def load_params(self):
        params = read(sys.stdin.buffer)

        if not params:
            return

        # for each param, parse it into the correct type
        for p in params:
            if p['type'] == 'INT':
                self.params[p['name']] = int(p['value'])
            elif p['type'] == 'FLOAT':
                self.params[p['name']] = float(p['value'])
            else:
                self.params[p['name']] = p['value']

    def set_default_params(self, params):
        for (val, key) in enumerate(params):
            if key not in self.params:
                self.params[key] = val

    # Get the value for a parameter specified externally (via the web UI)
    # Return:
    #   value, or None if nonexistent param
    def param(self, param_name):
        if param_name in self.params:
            return self.params[param_name]
        return None

    # --------------------------------------------------------------------------
    # TODO: fix

    def get_movement_directions(self):
        return [
            Direction.EAST,
            Direction.WEST,
            Direction.NORTHEAST,
            Direction.NORTHWEST,
            Direction.SOUTHEAST,
            Direction.SOUTHWEST,
            Direction.NONE
        ]

    # --------------------------------------------------------------------------
    # COMMAND CREATION

    # Create a move command and append it to the command queue.
    # Return: (None)
    def move(self, position_from, num_units, direction):
        command = Command(self.myId, Coordinate(position_from), MOVE_COMMAND, num_units, direction)
        if command:
            self.command_queue.append(command)

    # Create a move command and append it to the command queue,
    # this time with an additional layer of abstraction to aid development.
    # Return: (None)
    def move_towards(self, position_from, position_to, num_units=None):
        position_to = Coordinate(position_to)
        position_from = Coordinate(position_from)

        if position_from == position_to:
            return None

        if position_from.x < position_to.x:
            d = Direction.EAST
        elif position_from.x > position_to.x:
            d = Direction.WEST
        elif position_from.y < position_to.y:
            d = Direction.SOUTHWEST
        elif position_from.y > position_to.y:
            d = Direction.NORTHEAST

        n = num_units if num_units else self.get_unit_count_by_position(position_from.x, position_from.y)
        self.move(position_from, n, d)

    # Create a build command and append it to the command queue.
    # Return: (None)
    def build(self, position):
        # TODO: track concurrent mine and build commands:
        #   right now, hive simply requires a single unit in a cell
        #   do we care though that this unit will also be able to mine as well?
        #   the difference is small, but it will be more realistic in some sense
        #   if we have this logic.
        command = Command(self.myId, Coordinate(position), BUILD_COMMAND, 1, Direction.NONE)
        if command:
            self.command_queue.append(command)

    # Create a mine command and append it to the command queue.
    # Return: (None)
    def mine(self, position, num_units):
        command = Command(self.myId, Coordinate(position), MINE_COMMAND, num_units, Direction.NONE)
        if command:
            self.command_queue.append(command)

    # --------------------------------------------------------------------------
    # CELL GETTERS

    # Get map cell at specified (x, y) coordinate.
    # Return: (Cell)
    #   Cell at <position> if <position> is valid, else None
    def get_cell(self, x, y=None):
        if type(x) == Coordinate:
            return self.map.get_cell(x)

        # map handles validity check
        return self.map.get_cell(Coordinate(x, y))

    # Get count of all of my cells on the map.
    # Return: (number)
    #   the number of cells on the map that I control.
    def get_my_cell_count(self):
        return len(self.get_my_cells())

    # Get count of all of enemy cells on the map.
    # Return: (number)
    #   the number of cells on the map that are enemy controlled.
    def get_enemy_cell_count(self):
        return len(self.get_enemy_cells())

    # Get count of all cells controlled by player with playerId on the map.
    # Return: (number)
    #   the number of cells on the map that are controlled by player with playerId
    def get_player_cell_count(self, playerId):
        return len(self.get_player_cells(playerId))

    # Get a list of all my cells on the map.
    # Return: (list of Cell)
    #   list of all my cells
    def get_my_cells(self):
        return self.get_occupied_cells(self.myId)

    # Get a list of all enemy cells on the map.
    # Return: (list of Cell)
    #   list of all enemy cells
    def get_enemy_cells(self):
        enemy_cells = []
        for eId in self.eIds:
            single_enemy_cells = self.get_occupied_cells(eId)
            for single_enemy_cell in single_enemy_cells:
                enemy_cells.append(single_enemy_cell)
        return enemy_cells

    # Get a list of all cells controlled by player with playerId on the map.
    # Return: (list of Cell)
    #   list of all cells controlled by player with playerId
    def get_player_cells(self, playerId):
        return self.get_occupied_cells(playerId)

    # Get a list of all cells in which I have a hive.
    # Return: (list of Cell)
    #   list of all my hive-occupied cells
    def get_my_hive_sites(self):
        cells = []
        for col in self.map.cells:
            for cell in col:
                if cell.hive and cell.hive.ownerId == self.myId:
                    cells.append(cell)

        return cells

    # Get a list of all cells in which enemy has a hive.
    # Return: (list of Cell)
    #   list of all enemy hive-occupied cells
    def get_enemy_hive_sites(self):
        cells = []
        for col in self.map.cells:
            for cell in col:
                if cell.hive and cell.hive.ownerId != self.myId:
                    cells.append(cell)

        return cells

    # Get a list of all cells in which player specified by <playerId>
    # has at least one unit - this is equivalent to control of this cell.
    # Return: (list of Cell)
    #   list of all cells occupied by player with <playerId>
    def get_occupied_cells(self, playerId):
        cells = []
        for col in self.map.cells:
            for cell in col:
                if cell.units[playerId] > 0:
                    cells.append(cell)

        return cells

    # --------------------------------------------------------------------------
    # HIVE DATA GETTERS

    # Get a count of all hives on the map that I control.
    # Return: (number)
    #   the number of hives on the map that I control
    def get_my_hive_count(self):
        return len(self.get_my_hives())

    # Get a count of all hives on the map that are enemy controlled.
    # Return: (number)
    #   the number of hives on the map that are enemy controlled
    def get_enemy_hive_count(self):
        return len(self.get_enemy_hives())

    # Get a count of all hives on the map controlled by player with playerId
    # Return: (number)
    # the number of hives on the map controlled by player with playerId
    def get_player_hive_count(self, playerId):
        return len(self.get_player_hives(playerId))

    # Get a list of all my hives on the map.
    # Return: (list of Hive)
    #   list of hives on the map that I control
    def get_my_hives(self):
        return self.get_player_hives(self.myId)

    # Get a list of all enemy hives on the map.
    # Return: (list of Hive)
    #   list of hives on the map that the enemy players control
    def get_enemy_hives(self):
        blds = []
        for col in self.map.cells:
            for cell in col:
                if cell.hive and cell.hive.ownerId != self.myId:
                    blds.append(cell.hive)
        return blds

    # Get a list of all hives controlled by a certain player
    # Return: (list of hive)
    #   list of hive instances controlled by <playerId>
    def get_player_hives(self, playerId):
        hives = []
        for col in self.map.cells:
            for cell in col:
                if cell.hive and (cell.hive.ownerId == playerId):
                    hives.append(cell.hive)
        return hives

    # Get a list of all hives on the map
    # Return: (list of hives)
    #   flat list of all hives on the map, regardless of player
    def get_all_hives(self):
        all_hives = []
        for player_id in range(self.map.num_players):
            for hive in self.get_player_hives(player_id):
                all_hives.append(hive)
        return all_hives

    # Get a list of all my hives' positions on the map.
    # Return: (list of positions)
    #   list of positions of hives on the map that I control
    def get_my_hive_positions(self):
        return self.get_player_hive_positions(self.myId)

    # Get a list of all enemy hives on the map.
    # Return: (list of Hive)
    #   list of hives on the map that the enemy players control
    def get_enemy_hive_positions(self):
        positions = []
        for col in self.map.cells:
            for cell in col:
                if cell.hive and cell.hive.ownerId != self.myId:
                    positions.append(cell.positions)
        return positions

    # Get a list of all hives controlled by a certain player
    # Return: (list of Coordinate)
    #   list of coordinates of hives owned by player with id <playerId>
    def get_player_hive_positions(self, playerId):
        positions = []
        for col in self.map.cells:
            for cell in col:
                if cell.hive and cell.hive.ownerId == playerId:
                    positions.append(cell.position)
        return positions

    # Get a list of all hives on the map
    # Return: (list of Coordinate)
    #   flat list of coordinates of cells on map that contain a hive
    def get_all_hive_positions(self):
        all_hive_positions = []

        num_players = self.map.num_players
        for i in range(num_players):
            for hive in self.get_player_hive_positions(i):
                all_hive_positions.append(hive)

        return all_hive_positions

    # Get the total number of hives that I can currently construct.
    # Return: (number)
    #   the number of hives I can construct, assuming full resource use
    def get_hive_potential(self):
        return int(self.get_my_resource_count() / HIVE_COST)

    # --------------------------------------------------------------------------
    # UNIT DATA GETTERS

    # Get a count of the total number of units I control.
    # Return: (number)
    #   a count of the total number of units that I control
    def get_my_total_unit_count(self):
        return self.get_player_unit_count(self.myId)

    # Get a count of the total number of units that ALL enemies control together
    # Return: (number)
    # a count of the total number of units that ALL enemies control together
    def get_enemy_total_unit_count(self):
        count = 0
        for eId in self.eIds:
            count += self.get_player_unit_count(eId)

        return count

    # Get a count of the total number of units that player with playerId controls
    # Return: (number)
    # a count of the total number of units that player with playerId controls

    def get_player_unit_count(self, playerId):
        count = 0
        for cell in self.get_occupied_cells(playerId):
            count += cell.units[playerId]
        return count

    # Get the number of units in <cell> controlled by <playerId>.
    # Return: (number)
    #   the number of units in <cell> controlled by player <playerId>

    # warning: this can't be called between conclusion of movement that puts units from different players onto same cell
    # but before combat resolution so that only one player gains control of the cell
    def get_unit_count_by_cell(self, cell):
        for u in cell.units:
            if u != 0:
                return u
        return 0

    # Get the number of units in cell at position specified (<x>, <y>) controlled by <playerId>.
    # Return: (number)
    #   the number of units at the specified position controlled by player <playerId>
    def get_unit_count_by_position(self, x, y=None):
        # only one player may have control over a cell at any one time,
        # so this should not be an issue!
        if type(x) == Coordinate:
            return self.get_unit_count_by_cell(self.get_cell(x))

        return self.get_unit_count_by_cell(self.get_cell(x, y))

    def my_units_at_pos(self, pos): # returns True if there are more units at pos1 than there are units located at pos2
        return self.get_cell(pos[0], pos[1]).units[self.myId]

    # ALLEGIANCE GETTER
    # --------------------------------------------------------------------------

    def get_pos_owner(self, pos):
        cell = self.get_cell(pos)
        if all(i == 0 for i in cell.units):
            return None
        else:
            j = 0
            while cell.units[j] == 0:
                j += 1
            return j

    # --------------------------------------------------------------------------
    # RESOURCE DATA GETTERS

    # Get the current value of the resources I possess.
    # Return: (number)
    #   the value of the resources that I currently possess
    def get_my_resource_count(self):
        if "resources" in self.me:
            return self.me["resources"]
        return 0

    # returns True if there are more units at pos1 than there are units located at pos2
    def compare_unit_count_between_positions(self, pos1, pos2):
        if (self.get_unit_count_by_position(pos1[0], pos1[1]) > self.get_unit_count_by_position(pos2[0], pos2[1])):
            return True
        return False

    # returns True if player with playerId1 has higher hive count than player with playerId2
    def compare_hive_count(self, playerId1=None, playerId2=None):
        if (playerId1 == None | playerId2 == None):
            playerId1 = 0
            playerId2 = 1
        if (self.get_player_hive_count(playerId1
                ) > self.get_player_hive_count(playerId2)):
            return True
        return False

    # returns True if player with playerId1 has more units than player with playerId2
    def compare_total_unit_count(self, playerId1=None, playerId2=None):
        if playerId1 == None | playerId2 == None:
            playerId1 = 0
            playerId2 = 1
        if (self.get_player_unit_count(playerId1) > self.get_player_unit_count(playerId2)):
            return True
        else:
            return False

    # --------------------------------------------------------------------------
    # PATHFINDING

    # INPUTS: "start" (a tuple), "goal" (a tuple), "flags" (indicating what to avoid in the calculated path)
        # types of flags: "None" (only avoid obstacles), "Enemy units" (avoid squares with enemy units),
        # "Enemy units and adjacents" (avoid squares with enemy units and those adjacent to it),
        # "Enemy buildings" (avoid squares with enemy buildings)
    # RETURN: a list of tuples indicating a possible path between "start" and "goal" positions
    def path(self, start, goal, flags="None"):
        if (self.get_cell(start)).obstructed or (self.get_cell(goal)).obstructed:
            empty = []
            return empty

        p = ObstacleMapProblem(self.map, start, goal, flags, self.myId)
        result = astar_search(p, p.manhattan_heuristic)
        return result.path

    def smarter_move_towards(self, position_from, position_to, flags="None", num_units=None):
        if flags == "None":
            if (position_from, position_to) in self.move_dict:
                return self.move_dict[(position_from, position_to)]

        if not (type(position_from) is Coordinate):
            position_from = Coordinate(position_from)

        if not (type(position_to) is Coordinate):
            position_to = Coordinate(position_to)

        path = self.path(position_from, position_to, flags)
        if position_from == position_to:
            return None

        if len(path) > 1:
            d_tuple = (path[1].x - path[0].x, path[1].y - path[0].y)

            vers = position_from.y & 1

            if vers == 0:
                if d_tuple == (0, -1):
                    d = Direction.NORTHWEST
                elif d_tuple == (1, -1):
                    d = Direction.NORTHEAST
                elif d_tuple == (1, 0):
                    d = Direction.EAST
                elif d_tuple == (1, 1):
                    d = Direction.SOUTHEAST
                elif d_tuple == (0, 1):
                    d = Direction.SOUTHWEST
                elif d_tuple == (-1, 0):
                    d = Direction.WEST
                elif d_tuple == (0, 0):
                    d = Direction.NONE
                else:
                    return None
            else:
                if d_tuple == (-1, -1):
                    d = Direction.NORTHWEST
                elif d_tuple == (0, -1):
                    d = Direction.NORTHEAST
                elif d_tuple == (1, 0):
                    d = Direction.EAST
                elif d_tuple == (0, 1):
                    d = Direction.SOUTHEAST
                elif d_tuple == (-1, 1):
                    d = Direction.SOUTHWEST
                elif d_tuple == (-1, 0):
                    d = Direction.WEST
                elif d_tuple == (0, 0):
                    d = Direction.NONE
                else:
                    return None

            num_units = num_units if num_units else self.get_unit_count_by_position(position_from.x, position_from.y)

            if flags == "None":
                self.move_dict[(position_from, position_to)] = self.move(position_from, num_units, d)
            return self.move(position_from, num_units, d)
        else:
            return None

    # Return the distance between two positions 'start' and 'goal'
    def distance(self, start, goal, flags="None"):
        if (self.get_cell(start)).obstructed or (self.get_cell(goal)).obstructed:
            return None

        p = ObstacleMapProblem(self.map, start, goal, flags, self.myId)

        result = astar_search(p, p.manhattan_heuristic)

        return len(result.path)

    # Return the position of the closest hive to 'start'
    def closest_hive_pos(self, start, flags="None"):
        closest_distance = float("inf")
        closest_pos = None
        all_bld_positions = self.get_all_hive_positions()

        for pos in all_bld_positions:
            if self.distance(start, pos, flags) is None:
                continue
            if self.distance(start, pos, flags) == 0:
                continue
            if self.distance(start, pos, flags) < closest_distance:
                closest_distance = self.distance(start, pos, flags)
                closest_pos = pos

        return closest_pos

    # Return the position of the closest hive to 'start'
    def closest_enemy_hive_pos(self, start, flags="None"):
        closest_distance = float("inf")
        closest_pos = None
        enemy_bld_positions = self.get_enemy_hive_positions()

        for pos in enemy_bld_positions:
            if self.distance(start, pos, flags) is None:
                continue
            if self.distance(start, pos, flags) == 0:
                continue
            if self.distance(start, pos, flags) < closest_distance:
                closest_distance = self.distance(start, pos, flags)
                closest_pos = pos

        return closest_pos

    # Return the position of the closest hive to 'start' controlled by player with ID 'id'
    def closest_hive_pos_by_id(self, start, playerID, flags="None"):
        closest_distance = float("inf")
        closest_pos = None
        all_bld_positions = self.get_all_hive_positions()

        for pos in all_bld_positions:
            if pos == start:
                return pos
            if self.map.get_cell(pos).hive.ownerId != playerID:
                continue
            if self.distance(start, pos, flags) is None:
                continue
            if self.distance(start, pos, flags) == 0:
                continue
            if self.distance(start, pos, flags) < closest_distance:
                closest_distance = self.distance(start, pos, flags)
                closest_pos = pos

        return closest_pos

    # Return the number of units of a certain ID in the rectangular region with bottom left corner at 'bottom_left'
    # and top right corner at 'top_right' (both coordinates)
    # Inputs are Coordinates
    def get_unit_count_in_region_by_id(self, bottom_left, top_right, id):
        units = 0
        for x in range(bottom_left.x, top_right.x + 1):
            for y in range(bottom_left.y, top_right.y + 1):
                if self.get_pos_owner(Coordinate(x, y)) == id:
                    units += self.get_unit_count_by_position(x, y)
        return units

    def get_enemy_unit_count_in_region(self, bottom_left, top_right):
        units = 0
        for x in range(bottom_left.x, top_right.x + 1):
            for y in range(bottom_left.y, top_right.y + 1):
                if self.get_pos_owner(Coordinate(x, y)) != self.myId:
                    units += self.get_unit_count_by_position(x, y)
        return units

    def get_pos_with_most_units_in_region_by_id(self, bottom_left, top_right, id):
        units = -1 * float("inf")
        pos = None

        for x in range(bottom_left.x, top_right.x + 1):
            for y in range(bottom_left.y, top_right.y + 1):
                if self.get_pos_owner(Coordinate(x, y)) == id:
                    if self.get_unit_count_by_position(x, y) > units:
                        units = self.get_unit_count_by_position(x, y)
                        pos = Coordinate(x, y)
        return pos

    # --------------------------------------------------------------------------
    # OTHER METHODS

    # Returns a list of moves/commands that will try to gather the units belonging to player with id 'id' into
    # the cell with the greatest number of units

    # returns empty list if no further consolidation is possible
    def consolidate(self, bottom_left, top_right, id, flags="None"):
        commands = []

        pos_with_most_units = self.get_pos_with_most_units_in_region_by_id(bottom_left, top_right, id)

        if pos_with_most_units is None:
            return commands

        occupied_cells = self.get_occupied_cells(id)
        occupied_positions_within_region = []

        for cell in occupied_cells:
            if (cell.position.x >= bottom_left.x) & (cell.position.x <= top_right.x) & (cell.position.y >= bottom_left.y) & (cell.position.y <= top_right.y):
                occupied_positions_within_region.append(cell.position)

        for occupied_position in occupied_positions_within_region:
            move = self.smarter_move_towards(occupied_position, pos_with_most_units, flags)
            if not (move is None):
                commands.append(move)

        return commands

    def coordinate(self, x, y):
        return Coordinate(x, y)

    # --------------------------------------------------------------------------
    # LOGGING

    def log(self, out):
        self.logfile.write(str(out) + "\n")
        self.logfile.flush()

    # --------------------------------------------------------------------------
    # GAME PROTOCOL
    # USER MODIFICATION WILL LIKELY BREAK GAME - DO NOT TOUCH

    # Register the user-implemented turn handler.
    @classmethod
    def register_turn_handler(cls, handler, default_params={}):
        newGame = cls()
        newGame.turn_handler = handler
        newGame.set_default_params(default_params)
        newGame.run_game()
        return newGame

    # Internal GameHelper match loop.
    def run_game(self):
        while True:
            self.command_queue = []        # reset the command queue
            self.load_state()              # load updated state
            self.turn_handler(self)        # handle the turn
            self.send_commands()           # and send generated commands

    # Read in the game state and load it.
    def load_state(self):
        state = read(sys.stdin.buffer)
        if self.map:
            # update map from the passed log-formatted state
            self.map.update_from_log(state["m"])
        else:
            # or create map if needed
            self.map = Map.create_from_log(state["m"], len(state["r"]))

        # parse my resources out
        self.me["resources"] = state["r"][self.myId]

    # Send commands from the command queue
    def send_commands(self):
        write(sys.stdout.buffer, [c.to_dict() for c in self.command_queue])
