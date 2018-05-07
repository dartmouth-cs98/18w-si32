# Cell.py
# Class implementation for 'Cell'

import itertools
from random import randint

from game.Building import Building
from game.Coordinate import Coordinate

from game.params import (
    UNIT_COST,
    DEFENSE_RATING,
    MAX_RESOURCES,
    UNIFORM_RESOURCES,
)


# A Cell represents a single, atomic cell of the game map.
#
# Constructor Arguments
# position (tuple)     - tuple representing the map position of this cell instance
# num_players (number) - the number of players involved in this game instance
# occupiable (boolean) - True if this cell is standard, False if it is a wall
# uniform (boolean)    - True if distribution of map resources should be uniform, False otherwise

class Cell:
    def __init__(self, position, num_players, occupiable=True, uniform=False):
        self.position = Coordinate(position)

        # amount of resource in the cell (will be randomized for now)
        self.resource = randint(0, MAX_RESOURCES) if (not uniform) else UNIFORM_RESOURCES
        self.units = self.initialize_units_list(num_players)

        self.num_players = num_players

        self.building = None

        self.occupiable = occupiable #whether the cell is blocked or free (True = free, False = blocked)

    def update_from_log(self, log_cell):
        if 'r' in log_cell: # update resource totals
            self.resource = log_cell['r']
        if 'b' in log_cell: # create/update building if needed
            if self.building == None or self.building.ownerId != log_cell['b']:
                self.building = Building(log_cell['b'])
        else: # destroy building if needed
            if self.building != None:
                self.building = None
        if 'u' in log_cell: # update unit numbers
            for i in range(self.num_players):
                if i == log_cell['p']:
                    self.units[i] = log_cell['u']
                else:
                    self.units[i] = 0


    # --------------------------------------------------------------------------
    # RESOURCE METHODS

    # reduces the resource in the cell
    # (i.e. when a unit mines the resource)
    def decrement_resource(self, number=1):
        self.resource = self.resource - number

    # sets the resources of the cell to be completely depleted
    def set_resources_depleted(self):
        self.resource = 0

    # --------------------------------------------------------------------------
    # PLAYER UNIT METHODS

    # useful for when buildings create units
    def increment_units(self, player, number=1):
        self.units[player] += number

    def decrement_units(self, player, number=1):
        if (self.units[player] >= number):
            self.units[player] -= number

    def set_units(self, player, num_units):
        self.units[player] = num_units

    # --------------------------------------------------------------------------
    # BUILDING METHODS

    # add building reference
    def create_building(self, playerID):
        self.building = Building(playerID)

    # remove building reference
    def destroy_building(self):
        self.building = None

    # --------------------------------------------------------------------------
    # UPDATE FUNCTIONS

    def update_cell(self, players):
        self.update_units_and_building(players)

    def update_units_and_building(self, players):
        has_building = not (self.building is None) #whether the Cell has a building
        building_owner = None # player ID of player who owns the building on this cell

        if has_building:
            building_owner = self.building.ownerId
            buffed_units = self.units[building_owner] + DEFENSE_RATING  # buff the number of units of the building owner
            self.units[building_owner] = buffed_units

        contenders = []  # player IDs of all players with nonzero units on the cell


        for i in range(self.num_players):
            if self.units[i] > 0:
                contenders.append(i)

        while len(contenders) > 1:
            # units = min(contenders)#, self.units[2])
            units = float("inf")
            for index in contenders:
                if (self.units[index] < units):
                    units = self.units[index]

            to_remove = []  # IDs of players who have lost all units
            for index in contenders:
                self.units[index] -= units
                if (self.units[index] <= 0):
                    to_remove.append(index)
            # for i in range(number_of_players):
            #     units.append(0)

            # remove players with all units destroyed
            for index in to_remove:
                contenders.remove(index)
                # self.units[0] -= units
                # self.units[1] -= units
                # self.units[2] -= units

        if has_building:
            difference = buffed_units - self.units[building_owner]
            # check if building is destroyed and debuff the number of units if necessary

            # destroy building if building has lost all defense points
            if self.units[building_owner] == 0:
                self.destroy_building()
            # building absorbs all damage
            elif (difference < DEFENSE_RATING) and (difference >= 0):
                self.units[building_owner] = self.units[building_owner] + difference # get back the "killed units" since damage was absorbed
                self.units[building_owner] = self.units[building_owner] - 10 # remove building contribution from unit count
            # building does not absorb all damage
            else:
                self.units[building_owner] = self.units[building_owner] + DEFENSE_RATING - 1 # absorb as much damage as possible without being destroyed
                self.units[building_owner] = self.units[building_owner] - 10 # remove building contribution from unit count

            # check if new units should be produced
            if self.building:
                while self.building.production_status >= UNIT_COST:
                    self.increment_units(building_owner, 1)
                    self.building.production_status -= UNIT_COST
                    players[self.building.ownerId].increment_units_produced()

                self.building.production_tick()

    # --------------------------------------------------------------------------
    # INITIALIZING FUNCTION

    # we want to store the number of units a player has in each square, initialized to 0 for each player
    def initialize_units_list(self, number_of_players):
        units = []
        for i in range(number_of_players):
            units.append(0)
        return units

    def __str__(self):
        string = ""
        string += "Cell at position: " + str(self.position) + '\n'
        string += "Units:" + str(self.units)
        return string
