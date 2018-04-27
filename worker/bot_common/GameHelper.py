# GameHelper.py
# Class implementation for 'GameHelper'

import sys
import json
import pickle
import msgpack

from game.params import MOVE_COMMAND, BUILD_COMMAND, MINE_COMMAND, BUILDING_COST, Direction
from game.Coordinate import Coordinate
from game.Command import Command
from game.Map import Map

from game.ObstacleMapProblem import ObstacleMapProblem

from game.astar_search import astar_search

# ------------------------------------------------------------------------------
# GameHelper

# A GameHelper instance wraps all of the game logic functionality into
# a convenient package to aid users in bot development.


def read():
    return json.loads(sys.stdin.readline())

class GameHelper:
    def __init__(self):
        # first thing the game server sends us through STDIN is our player id
        #self.myId = msgpack.unpack(sys.stdin.buffer)
        #self.log("got id")

        self.myId = int(read())
        self.numPlayers = 3


        self.map = None

        # second thing it sends through STDIN is the number of players?
        #self.numPlayers = pickle.load(sys.stdin.buffer)

        #self.eId = 1 - self.myId #case for two players

        #list of enemy IDs
        self.eIds = list(range(self.numPlayers))
        #self.eIds.remove(self.myId)

        self.me = { "resources": 0 }

        self.turn_handler = None
        self.logfile = open("./game" + str(self.myId) + ".log", "w")
        #self.log("id", self.myId)
        self.log("DONE")

    def __del__(self):
        self.logfile.close()

    # --------------------------------------------------------------------------
    # COMMAND CREATION

    # Create and return a move command.
    # Return: (Command)
    #   the move command to accomplish the specified movement.
    def move(self, position_from, num_units, direction):
        return Command(self.myId, Coordinate(position_from), MOVE_COMMAND, num_units, direction)

    # Create and return a move command, with an additional layer of abstraction.
    # Return: (Command)
    #   the move command to accomplish the specified movement, or None.
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

        # TODO: make this smarter by avoiding enemy units, enemy buildings, or stronger enemy buildings

        num_units = num_units if num_units else self.get_unit_count_by_position(position_from.x, position_from.y)
        return self.move(position_from, num_units, d)

    # Create and return a build command.
    # Return: (Command)
    #   the build command to accomplish the specified building procedure.
    def build(self, position):
        # TODO: track concurrent mine and build commands:
        #   right now, building simply requires a single unit in a cell
        #   do we care though that this unit will also be able to mine as well?
        #   the difference is small, but it will be more realistic in some sense
        #   if we have this logic.
        return Command(self.myId, Coordinate(position), BUILD_COMMAND, 1, Direction.NONE)

    # Create and return a mine command.
    # Return: (Command)
    #   the mine command to accomplish the specified mining procedure.
    def mine(self, position, num_units):
        return Command(self.myId, Coordinate(position), MINE_COMMAND, num_units, Direction.NONE)

    # --------------------------------------------------------------------------
    # CELL GETTERS

    # Get map cell at specified (x, y) coordinate.
    # Return: (Cell)
    #   Cell at <position> if <position> is valid, else None
    def get_cell(self, x, y = None):
        if (type(x) == Coordinate):
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

    # Get a list of all cells in which I have a building.
    # Return: (list of Cell)
    #   list of all my building-occupied cells
    def get_my_building_sites(self):
        cells = []
        for col in self.map.cells:
            for cell in col:
                if cell.building and cell.building.ownerId == self.myId:
                    cells.append(cell)

        return cells

    # Get a list of all cells in which enemy has a building.
    # Return: (list of Cell)
    #   list of all enemy building-occupied cells
    def get_enemy_building_sites(self):
        cells = []
        for col in self.map.cells:
            for cell in col:
                if cell.building and cell.building.ownerId != self.myId:
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
    # BUILDING GETTERS

    # Get a count of all buildings on the map that I control.
    # Return: (number)
    #   the number of buildings on the map that I control
    def get_my_building_count(self):
        return len(self.get_my_buildings())

    # Get a count of all buildings on the map that are enemy controlled.
    # Return: (number)
    #   the number of buildings on the map that are enemy controlled
    def get_enemy_building_count(self):
        return len(self.get_enemy_buildings())

    #Get a count of all buildings on the map controlled by player with playerId
    #Return: (number)
    #the number of buildings on the map controlled by player with playerId
    def get_player_building_count(self, playerId):
        return len(self.get_player_buildings(playerId))

    # Get a list of all my buildings on the map.
    # Return: (list of Building)
    #   list of buildings on the map that I control
    def get_my_buildings(self):
        return self.get_player_buildings(self.myId)

    # Get a list of all my buildings on the map.
    # Return: (list of Building)
    #   list of buildings on the map that I control
    def get_enemy_buildings(self):
        blds = []
        for col in self.map.cells:
            for cell in col:
                if cell.building and cell.building.ownerId != self.myId:
                    blds.append(cell.building)
        return blds

    #Get a list of all buildings controlled by a certain player
    #Return: (list of building)
    def get_player_buildings(self, playerId):
        blds = []
        for col in self.map.cells:
            for cell in col:
                if cell.building and cell.building.ownerId == playerId:
                    blds.append(cell.building)
        return blds

    # Get the total number of buildings that I can currently construct.
    # Return: (number)
    #   the number of buildings I can construct, assuming full resource use
    def get_building_potential(self):
        return int(self.get_my_resource_count() / BUILDING_COST)


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

    #warning: this can't be called between conclusion of movement that puts units from different players onto same cell but before combat resolution so that only one player gains control of the cell
    def get_unit_count_by_cell(self, cell):
        # only one player may have control over a cell at any one time,
        # so this should not be an issue!
        if all(i == 0 for i in cell.units):
            return 0
        else:
            j = 0
            while cell.units[j] == 0:
                j += 1
            return cell.units[j]

    # Get the number of units in cell at position specified (<x>, <y>) controlled by <playerId>.
    # Return: (number)
    #   the number of units at the specified position controlled by player <playerId>
    def get_unit_count_by_position(self, x, y=None):
        # only one player may have control over a cell at any one time,
        # so this should not be an issue!

        return self.get_unit_count_by_cell(self.get_cell(x, y))

    def my_units_at_pos(self, pos): # returns True if there are more units at pos1 than there are units located at pos2
        return self.get_cell(pos[0], pos[1]).units[self.myId]


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

    # returns True if player with playerId1 has higher building count than player with playerId2
    def compare_building_count(self, playerId1=None, playerId2=None):
        if (playerId1 == None | playerId2 == None):
            playerId1 = 0
            playerId2 = 1
        if (self.get_player_building_count(playerId1
                ) > self.get_player_building_count(playerId2)):
            return True
        return False

    # returns True if player with playerId1 has more units than player with playerId2
    def compare_total_unit_count(self, playerId1=None, playerId2=None):
        if (playerId1 == None | playerId2 == None):
            playerId1 = 0
            playerId2 = 1
        if (self.get_player_unit_count(playerId1) > self.get_player_unit_count(playerId2)):
            return True
        else:
            return False

    # --------------------------------------------------------------------------
    # PATHFINDING
    # INPUTS: "start" (a tuple), "goal" (a tuple)
    # RETURN: a list of tuples indicating a possible path between "start" and "goal" positions
    def path(self, start, goal):
        if (not (self.get_cell(start[0], start[1])).occupiable) | (not (self.get_cell(goal[0], goal[1])).occupiable):
            empty = []
            return empty

        p = ObstacleMapProblem(self.map, start, goal)

        result = astar_search(p, p.manhattan_heuristic)
        return result.path

    # --------------------------------------------------------------------------
    # LOGGING

    def log(self, out):
        self.logfile.write(str(out) + "\n")
        self.logfile.flush()

    # --------------------------------------------------------------------------
    # INTERNAL - USER SHOULD NOT MODIFY

    @classmethod
    def register_turn_handler(cls, handler):
        newGame = cls()
        newGame.turn_handler = handler
        newGame.run_game()
        return newGame

    def run_game(self):
        while True:
            self.load_state()
            commands = self.turn_handler(self)
            self.send_commands(commands)

    # reads in the game state and loads it
    def load_state(self):
        state = read()
        
        if self.map:
            self.map.update_from_log(state["m"])
        else: 
            self.map = Map.create_from_log(state["m"], len(state["r"]))
        self.me["resources"] = state["r"][self.myId] # parse my resources out

    def send_commands(self, commands):
        print(pickle.dumps(commands))
        sys.stdout.flush()

