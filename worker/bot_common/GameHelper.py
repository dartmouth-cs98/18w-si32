# GameHelper.py
# Class implementation for 'GameHelper'

import sys
import json
import pickle

from game.Command import Command

# movement direction translation
DIRECTIONS = {
    'left'  : [-1, 0],
    'right' : [1,  0],
    'up'    : [0, -1],
    'down'  : [0,  1],
    'none'  : [0,  0],
}

# ------------------------------------------------------------------------------
# GameHelper

# A GameHelper instance wraps all of the game logic functionality into
# a convenient package to aid users in bot development.

class GameHelper:
    def __init__(self):
        # first thing the game server sends us through STDIN is our player id
        self.myId = pickle.load(sys.stdin.buffer)
        self.eId = 1 - self.myId

        self.me = { "resources": 0 }

        self.turn_handler = None
        self.logfile = open("./game" + str(self.eId) + ".log", "w")

    def __del__(self):
        self.logfile.close()

    # --------------------------------------------------------------------------
    # COMMAND CREATION

    def move(self, position_from, num_units, direction):
        return Command(self.myId, position_from, 'move', num_units, DIRECTIONS[direction])

    # makes a single move from position_from that tries to get closer to position_to
    # while avoiding either enemy units, enemy buildings, or stronger enemy buildings
    def move_towards(self, position_from, position_to, n_units=None):
        if pos_equal(position_from, position_to):
            return None

        if position_from[0] < position_to[0]:
            d = 'right'
        elif position_from[0] > position_to[0]:
            d = 'left'
        elif position_from[1] < position_to[1]:
            d = 'down'
        elif position_from[1] > position_to[1]:
            d = 'up'

        n_units = n_units if n_units else self.my_units_at_pos(position_from)
        return self.move(position_from, n_units, d)

    # TODO: remove playerId
    def build(self, position_build, num_units):
        return Command(self.myId, position_build, 'build', num_units, DIRECTIONS["none"])

    def mine(self, position_mine, num_units):
        return Command(self.myId, position_mine, 'mine', num_units, DIRECTIONS["none"])

    # --------------------------------------------------------------------------
    # CELL GETTERS

    # Get map cell at specified (x, y) coordinate.
    # Return: (Cell)
    #   Cell at <position> if <position> is valid, else None
    def get_cell(self, x, y):
        # map handles validity check
        return self.map.get_cell((x, y))

    # Get a list of all my cells on the map.
    # Return: (list of Cell)
    #   list of all my cells
    def get_my_cells(self):
        return self.get_occupied_cells(self.myId)

    # Get a list of all enemy cells on the map.
    # Return: (list of Cell)
    #   list of all enemy cells
    def get_enemy_cells(self):
        return self.get_occupied_cells(self.eId)

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

    # Get a list of all my buildings on the map.
    # Return: (list of Building)
    #   list of buildings on the map that I control
    def get_my_buildings(self):
        blds = []
        for col in self.map.cells:
            for cell in col:
                if cell.building and cell.building.ownerId == self.myId:
                    blds.append(cell.building)
        return blds

    # Get a list of all my buildings on the map.
    # Return: (list of Building)
    #   list of buildings on the map that I control
    def get_enemy_buildings(self):
        blds = []
        for col in self.map.cells:
            for cell in col:
                if cell.building and cell.building.ownerId != self.myId:
                    blds.append(building)
        return blds

    # TODO: rename this, its confusing
    def position_towards(self, position_from, position_to):
        if pos_equal(position_from, position_to):
            return position_from

        if position_from[0] < position_to[0]:
            return position_from + (1, 0)
        elif position_from[0] > position_to[0]:
            return position_from + (-1, 0)
        elif position_from[1] < position_to[1]:
            return position_from + (0, 1)
        elif position_from[1] > position_to[1]:
            return position_from + (0, -1)

    # get the number of units at specified square of specified player
    def get_units(self, x, y, playerId):
        return self.map.get_cell((x, y)).units[playerId]

    def my_resource_count(self):
        if "resources" in self.me:
            return self.me["resources"]
        return 0

    def building_potential(self):
        return int(self.my_resource_count() / 100)

    def my_units_at_pos(self, pos):
        return self.map.get_cell(pos).units[self.myId]


    # returns True if player with playerId1 has higher unit count at pos1 than player with playerId2 has at pos2
    def compare_unit_count(self, pos1, pos2):
        if (self.get_cell(pos1[0], pos1[1]).units[self.myId] > self.get_cell(pos2[0], pos2[1]).units[self.eId]):
            return True
        return False

    # returns True if player with playerId1 has more resource than player with playerId2
    def compare_resource(self):
        if (self.players[self.myId].resource > self.players[self.eId].resource):
            return True
        return False

    # returns True if player with playerId1 has higher building count than player with playerId2
    def compare_building_count(self):
        if (self.get_number_of_buildings_belonging_to_player(
                self.myId) > self.get_number_of_buildings_belonging_to_player(self.eId)):
            return True
        return False

    # gets the total number of units controlled by player with playerId
    def get_total_units(self, playerId=None):
        if playerId is None:
            playerId = self.myId
        count = 0
        for cell in self.get_occupied_cells(playerId):
            count += cell.units[playerId]
        return count

    # returns True if player with playerId1 has more units than player with playerId2
    def compare_total_units(self):
        if (self.get_total_units(self.myId) > self.get_total_units(self.eId)):
            return True
        else:
            return False


            # functions to return commands of various types



    # returns a sequence of commands at a cell so that - if the cell has resource less than number of units, send the unneeded units to the adjacent free cell with greatest resource; then, build on the cell if it's empty
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

        return Command(self.myId, position_from, 'move', number_of_units, direction)

    # get the number of buildings belonging to player with playerId
    def get_number_of_buildings_belonging_to_player(self, playerId):
        number_buildings = 0

        j = 0
        while (j < self.map.height):

            i = 0
            while (i < self.map.width):

                if (self.get_cell(i, j).building is not None):
                    if (self.get_cell(i, j).building.ownerId == playerId):
                        number_buildings += 1

                i += 1
            j += 1

        return number_buildings

    # get the position of the nearest building from (x, y) that belongs to a player with playerId
    def get_nearest_building_position_and_distance_belonging_to_player(self, x, y, playerId):
        if (self.get_number_of_buildings_belonging_to_player(playerId) > 0):
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

# ------------------------------------------------------------------------------
# HELPER FUNCTIONS

def pos_equal(a, b):
    return a[0] == b[0] and a[1] == b[1]
