# GameHelper.py
# Class implementation for 'GameHelper'

import sys
import json
import pickle

from game.params import MOVE_COMMAND, BUILD_COMMAND, MINE_COMMAND, BUILDING_COST, Direction
from game.Coordinate import Coordinate
from game.Command import Command

# ------------------------------------------------------------------------------
# GameHelper

# A GameHelper instance wraps all of the game logic functionality into
# a convenient package to aid users in bot development.

class GameHelper:
    def __init__(self):
        # first thing the game server sends us through STDIN is our player id
        self.myId = pickle.load(sys.stdin.buffer)

        # second thing it sends through STDIN is the number of players?
        self.numPlayers = pickle.load(sys.stdin.buffer)

        #self.eId = 1 - self.myId #case for two players

        #list of enemy IDs
        self.eIds = list(range(self.numPlayers))
        self.eIds.remove(self.myId)

        self.me = { "resources": 0 }

        self.turn_handler = None
        self.logfile = open("./game" + str(self.myId) + ".log", "w")

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
    def get_cell(self, x, y):
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

    def my_units_at_pos(self, pos):
        return self.map.get_cell(pos).units[self.myId]

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

    #Warning: this can't be called between conclusion of movement that puts units from different players onto same cell but before combat resolution so that only one player gains control of the cell
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
    def get_unit_count_by_position(self, x, y):
        # only one player may have control over a cell at any one time,
        # so this should not be an issue!
        return self.get_cell(x, y)

    def my_units_at_pos(self, pos): # returns True if there are more units at pos1 than there are units located at pos2
        return self.map.get_cell(pos).units[self.myId]

    def get_unit_count_by_position_tuple(self, coordinate):
        return self.get_unit_count_by_cell(self.map.get_cell(coordinate))

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

    # returns True if player with playerId1 has more resource than player with playerId2
    # resource information shared between players?
    '''
    def compare_resource(self, eId):
        if (self.get_my_resource_count > self.players[eId].resource):
            return True
        return False
    '''

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

    # functions to return commands of various types

    # returns a sequence of commands at a cell so that - if the cell has resource less than number of units, send the unneeded units to the adjacent free cell with greatest resource; then, build on the cell if it's empty
    '''
    def efficient_mine_and_build(self, position):
        commands = []

        resource_at_cell = self.get_cell(position[0], position[1]).resource
        units_at_cell = self.get_cell(position[0], position[1]).units[self.myId]

        # if there's more than enough units, move them to adjacent free cells

        if (resource_at_cell < units_at_cell):

            if (resource_at_cell > 0):
                commands.append(self.mine(self.myId, position, resource_at_cell))
            greatest = self.get_free_position_with_greatest_resource_of_range(position[0], position[1], 1)

            # if there is a free adjacent cell, move to the one with the greatest resource
            if greatest is not None:
                if greatest[1] is not None:
                    direction = (greatest[1][0] - position[0], greatest[1][1] - position[1])
                    # build if there's room on the cell


                    if (self.get_cell(position[0], position[1]).building is not None) | (
                                self.players[self.myId].resource < resource_cost):

                        commands.append(self.move(self.myId, position, units_at_cell - resource_at_cell, direction))
                    else:

                        commands.append(self.move(self.myId, position, units_at_cell - resource_at_cell - 1, direction))
                        commands.append(self.build(self.myId, position, 1))

        # else, have them all (minus one) gather resource, then build (if there is no building), or all gather resource (if there is a building)
        else:

            if (self.get_cell(position[0], position[1]).building is not None) | (
                        self.players[self.myId].resource < resource_cost):
                commands.append(self.mine(position, units_at_cell))
            else:
                commands.append(self.mine(position, units_at_cell - 1))
                commands.append(self.build(self.myId, position, 1))

        for command in commands:
            if (command.number_of_units <= 0):
                commands.remove(command)

        return commands

    def bad_single_move_towards_cell_avoiding_things(self, position_from, position_to, number_of_units,
                                                     things_to_avoid):

        # returns True if cell at (x, y) contains an enemy building
        def cell_contains_enemy_building(x, y):
            return (self.get_cell(x, y).building is not None) & ((self.get_cell(x, y).building.ownerId == self.eId))

        # returns True if cell at (x, y) contains an enemy building whose defense value is higher than the number of our units to command
        def cell_contains_stronger_enemy_building(x, y):
            return cell_contains_enemy_building(x, y) & (
                self.get_cell(x, y).building.defense >= number_of_units)

        # returns True of cell at (x, y) contains enemy units
        def cell_contains_enemy_units(x, y):
            return self.get_cell(x, y).units[(self.eId)] > 0

        x0 = position_from[0]
        y0 = position_from[1]
        x1 = position_to[0]
        y1 = position_to[1]

        xy_difference = (x1 - x0, y1 - y0)

        if (things_to_avoid == 'buildings'):
            if (xy_difference[0] > 0) & (not cell_contains_enemy_building(x0 + 1, y0)):
                direction = (1, 0)
            elif (xy_difference[1] > 0) & (not cell_contains_enemy_building(x0, y0 + 1)):
                direction = (0, 1)
            elif (not cell_contains_enemy_building(x0 - 1, y0)):
                direction = (-1, 0)
            elif (not cell_contains_enemy_building(x0, y0 - 1)):
                direction = (0, -1)
            else:
                direction = (0, 0)

        elif (things_to_avoid == 'stronger buildings'):
            if (xy_difference[0] > 0) & (not cell_contains_stronger_enemy_building(x0 + 1, y0)):
                direction = (1, 0)
            elif (xy_difference[1] > 0) & (not cell_contains_stronger_enemy_building(x0, y0 + 1)):
                direction = (0, 1)
            elif (not cell_contains_enemy_building(x0 - 1, y0)):
                direction = (-1, 0)
            elif (not cell_contains_enemy_building(x0, y0 - 1)):
                direction = (0, -1)
            else:
                direction = (0, 0)

        elif (things_to_avoid == 'units'):
            if (xy_difference[0] > 0) & (not cell_contains_enemy_units(x0 + 1, y0)):
                direction = (1, 0)
            elif (xy_difference[1] > 0) & (not cell_contains_enemy_units(x0, y0 + 1)):
                direction = (0, 1)
            elif (not cell_contains_enemy_building(x0 - 1, y0)):
                direction = (-1, 0)
            elif (not cell_contains_enemy_building(x0, y0 - 1)):
                direction = (0, -1)
            else:
                direction = (0, 0)
        else:
            direction = (0, 0)

        return Command(self.myId, position_from, MOVE_COMMAND, number_of_units, direction)
    '''


    #TODO: smarter distances than Manhattan
    # get the position of the nearest building from (x, y) that belongs to a player with playerId
    def get_nearest_building_position_and_distance_belonging_to_player(self, x, y, playerId):
        if (self.get_player_building_count(playerId) > 0):
            current_search_distance = 1

            while (True):
                for m in range(-1 * current_search_distance, current_search_distance + 1):
                    n = current_search_distance - abs(m)

                    if (self.map.cell_in_range((x + m, y + n))):
                        if (self.get_cell(x + m, y + n).building is not None):
                            if (self.get_cell(x + m, y + n).building.ownerId == playerId):
                                return ((x + m, y + n), current_search_distance)
                    elif (self.map.cell_in_range((x + m, y - n))):
                        if (self.get_cell(x + m, y - n).building is not None):
                            if (self.get_cell(x + m, y + n).building.ownerId == playerId):
                                return ((x + m, y - n), current_search_distance)

                current_search_distance += 1
        else:
            return None

    def get_nearest_enemy_building_position(self):

        my_buildings = self.my_buildings()
        enemy_buildings = self.enemy_buildings()

        smallest_distance = 10000
        closest_building = None

        for building in my_buildings:
            for enemy_building in enemy_buildings:
                manhattan_distance = abs(building.position[0] - enemy_building.position[0]) + abs(
                    building.position[1] - enemy_building.position[1])
                if (manhattan_distance < smallest_distance):
                    smallest_distance = manhattan_distance
                    closest_building = enemy_building

        return closest_building.position

    # return the position of the cell with the greatest resource of a specified distance away from a specified cell
    def get_free_position_with_greatest_resource_of_range(self, x, y, r):
        greatest_resource = 0
        greatest_position = None

        for m in range((-1 * r), (r + 1)):
            n = r - abs(m)

            if (self.map.cell_in_range((x + m, y + n))):
                if (self.get_cell(x + m, y + n).building is None) & (
                            self.get_cell(x + m, y + n).resource > greatest_resource):
                    greatest_resource = self.get_cell(x + m, y + n).resource
                    greatest_position = self.get_cell(x + m, y + n).position

            if (self.map.cell_in_range((x + m, y - n))):
                if (self.get_cell(x + m, y - n).building is None) & (
                            self.get_cell(x + m, y - n).resource > greatest_resource):
                    greatest_resource = self.get_cell(x + m, y - n).resource
                    greatest_position = self.get_cell(x + m, y - n).position

        return (greatest_resource, greatest_position)

    def get_adjacent_free_position_with_greatest_resource(self, x, y):
        return self.get_free_position_with_greatest_resource_of_range(x, y, 1)

    # ignores buildings, needs to be rewritten with a proper search algorithm like A-star
    def get_nearest_player_unit_pos_to_cell(self, x, y, playerId):
        nearest_enemy = None
        distance = math.inf
        for cell in self.get_occupied_cells(playerId):
            separation = abs(cell.position[0] - x) + abs(cell.position[1] - y)
            if separation < distance:
                distance = separation
                nearest_enemy = cell.position

        return (nearest_enemy, distance)

    def get_nearest_enemy_unit_pos_to_cell(self, x, y):
        return self.get_nearest_player_unit_pos_to_cell(x, y, self.eId)

    def get_nearest_friendly_unit_pos_to_cell(self, x, y):
        return self.get_nearest_player_unit_pos_to_cell(x, y, self.eId)

    def are_my_units_closer_to_cell(self, x, y):
        return self.get_nearest_friendly_unit_pos_to_cell(x, y)[1] > self.get_nearest_enemy_unit_pos_to_cell(x, y)[1]

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
        state = pickle.load(sys.stdin.buffer)
        self.map = state["map"]
        self.me = state["player"]

    def send_commands(self, commands):
        print(pickle.dumps(commands))
        sys.stdout.flush()

