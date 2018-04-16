# Cell.py
# Class implementation for 'Cell'

import itertools
import random
from random import randint

from game.Building import Building
from game.Coordinate import Coordinate

from game.params import MAX_RESOURCES, DEFENSE_RATING, UNIT_COST


# A Cell represents a single, atomic cell of the game map.
#
# Constructor Arguments
# position (tuple)     - tuple representing the map position of this cell instance.
# num_players (number) - the number of players involved in this game instance.

class Cell:
    def __init__(self, position, num_players, occupiable = True):
        self.position = Coordinate(position)

        # amount of resource in the cell (will be randomized for now)
        self.resource = randint(0, MAX_RESOURCES)
        self.units = self.initialize_units_list(num_players)

        self.num_players = num_players

        self.building = None

        self.occupiable = occupiable

    def occupiable(self):
        return self.occupiable
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
        building_owner = self.building.ownerId  # player ID of player who owns the building on this cell

        contenders = []  # player IDs of all players with nonzero units on the cell

        buffed_units = self.units[building_owner] + DEFENSE_RATING  # buff the number of units of the building owner
        self.units[building_owner] = buffed_units

        for i in range(self.num_players):
            if self.units[i] > 0:
                contenders.append(i)

        while (len(contenders) > 1):
            print(len(contenders))
            # units = min(contenders)#, self.units[2])
            units = float("inf")
            for index in contenders:
                if (self.units[index] < units):
                    units = self.units[index]
            print(units)

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

        # check if building is destroyed and debuff the number of units
        if (self.units[building_owner] == 0):
            self.destroy_building()
        elif (self.units[building_owner] <= DEFENSE_RATING and self.units[building_owner] > 0):
            self.units[building_owner] = 0
        else:
            self.units[building_owner] = self.units[building_owner] - 10

        # check if new units should be produced
        while self.building.resources >= UNIT_COST:
            self.increment_units(building_owner, 1)
            self.building.resources -= UNIT_COST
            players[self.building.ownerId].increment_units_produced()

            self.building.increment_resources()

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
