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
    def __init__(self, position, num_players):
        self.position = Coordinate(position)

        # amount of resource in the cell (will be randomized for now)
        self.resource = randint(0, MAX_RESOURCES)
        self.units = self.initialize_units_list(num_players)

        self.building = None

    # --------------------------------------------------------------------------
    # RESOURCE METHODS

    # reduces the resource in the cell
    # (i.e. when a unit mines the resource)
    def decrement_resource(self, number=1):
        self.resource = self.resource - number

    # --------------------------------------------------------------------------
    # PLAYER UNIT METHODS

    # useful for when buildings create units
    def increment_units(self, player, number=1):
        self.units[player] += number

    def decrement_units(self, player, number=1):
        if (self.units[player] >= number):
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

    def update_cell(self, players):
        self.update_building_status(players)
        self.update_units_number()

    def update_units_number(self):
        while (self.units[0] > 0) and (self.units[1] > 0):
            units = min(self.units[0], self.units[1])
            self.units[0] -= units
            self.units[1] -= units

    def update_units_number_multi(self):
        i = 0
        ids_players_with_units = []  # list which will contain the ids of all players with units on the tile

        total_number_units = 0  # total number of units on the tile

        for player_unit_count in self.units:  # for the unit count of each player
            if player_unit_count > 0:  # if it's nonzero
                total_number_units += player_unit_count  # sum into total number of units on the tile
                ids_players_with_units.append(
                    i)  # append the id ('i') into the list containing ids of all players with units on the tile

            i += 1

        num_players_with_units = len(ids_players_with_units)  # number of players with units on the tile

        dict = {}  # maps pairs of IDs (expressed as tuples) to the number of units to send to each other

        for id_player in ids_players_with_units:  # for the id 'id_player' of each player with units on the tile
            number_player_units = self.units[
                id_player]  # the number of units on the tile controlled by player with id 'id_player'
            total_number_enemy_units = total_number_units - number_player_units  # the total number of units controlled by all other players on the tile;

            # list of enemy IDs is just the list of player IDs minus 'id_player'
            ids_enemies_with_units = list(ids_players_with_units)
            ids_enemies_with_units.remove(id_player)

            # tallies total number delegated towards enemy combat
            total_number_units_sent = 0

            # distribute units to combat each enemy proportional to their unit strength
            for id_enemy in ids_enemies_with_units:  # for the id 'id_enemy' of each other player with units on the tile
                number_enemy_units = self.units[id_enemy]
                number_units_sent_to_enemy = int((number_enemy_units / total_number_enemy_units) * number_player_units)

                dict[(id_player, id_enemy)] = number_units_sent_to_enemy
                total_number_units_sent += number_units_sent_to_enemy

            units_remaining = number_player_units - total_number_units_sent

            # distribute remaining units randomly
            k = 0
            while (k < units_remaining):
                random_enemy_id = random.choice(ids_enemies_with_units)
                dict[(id_player, random_enemy_id)] += 1
                k += 1

    # calculates combat between two players with the units they send toward each other
    def in_square_two_player_combat(self, playerId1, playerId2, units1, units2):
        smaller = min(units1, units2)
        self.units[playerId1] -= smaller
        self.units[playerId2] -= smaller

    #TODO: generalize this
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
        string += "Cell at position: " + str(self.position) + '\n'
        string += "Units:" + str(self.units)
        return string
