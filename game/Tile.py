# Tile.py
# Class implementation for 'Tile'

import itertools
from random import randint

from game.Building import Building
from game.Coordinate import Coordinate

from game.params import MAX_RESOURCES, DEFENSE_RATING, UNIT_COST

# A Tile represents a single, atomic cell of the game map.
#
# Constructor Arguments
# position (tuple)     - tuple representing the map position of this tile instance.
# num_players (number) - the number of players involved in this game instance.

class Tile:
    def __init__(self, position, number_of_players):
        self.position = Coordinate(position)

        # amount of resource in the tile (will be randomized for now)
        self.resource = randint(0, MAX_RESOURCES)
        self.units = self.initialize_units_list(number_of_players)

        self.building = None

    # --------------------------------------------------------------------------
    # RESOURCE METHODS

    def decrement_resource(self, number=1):  # reduces the resource in the tile (i.e. when a unit mines the resource)
        self.resource = self.resource - number

    # --------------------------------------------------------------------------
    # PLAYER UNIT METHODS

    # useful for when buildings create units
    def increment_units(self, player, number=1):
        self.units[player] += number

    def decrement_units(self, player, number=1):
        self.units[player] -= number

    def set_units(self, player, number_of_units):
        self.units[player] = number_of_units

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

    def update_tile(self, players):
        self.update_building_status(players)
        self.update_units_number()

    def update_units_number(self):
        while (self.units[0] > 0) and (self.units[1] > 0):
            units = min(self.units[0], self.units[1])
            self.units[0] -= units
            self.units[1] -= units

    def update_units_number_multi(self):
        i = 0
        ids_players_with_units = []

        total_number_of_units = 0

        for player_unit_count in self.units:
            if player_unit_count > 0:
                total_number_of_units += player_unit_count
                ids_players_with_units.append(i)

            i += 1

        num_players_with_units = len(ids_players_with_units)

        pairs = itertools.combinations(ids_players_with_units, 2)

        pair_to_units_to_send_dict = {}

        #calculate for each player how many units they will send towards each other player
        for pair in pairs:
            id1 = pair[0]
            id2 = pair[1]

            id1_units = self.units[id1]
            other_units_for_id1 = total_number_of_units - id1_units

    # calculates combat between two players with the units they send toward each other
    def in_square_two_player_combat(self, playerId1, playerId2, units1, units2):
        smaller = min(units1, units2)
        self.units[playerId1] -= smaller
        self.units[playerId2] -= smaller

    def update_building_status(self, players):
        if self.building is not None:
            building_owner = self.building.ownerId
            attacker = 1 - building_owner

            #  check if building will be destroyed by enemy units
            if self.units[attacker] > 0:
                if self.units[attacker] > DEFENSE_RATING + self.units[building_owner]:
                    # building will be destroyed
                    self.destroy_building()
                    self.units[attacker] -= DEFENSE_RATING + self.units[building_owner]
                    self.units[building_owner] = 0
                    return
                else:
                    # building not destroyed
                    self.units[attacker] = 0
                    self.units[building_owner] -= DEFENSE_RATING - self.units[attacker]

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
        string += "Tile at position: " + str(self.position) + '\n'
        string += "Units:" + str(self.units)
        return string
