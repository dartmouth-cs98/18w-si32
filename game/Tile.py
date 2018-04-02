from random import randint
from game.Building import Building
from game.Coordinate import Coordinate
import itertools
import random


class Tile:

    def __init__(self, position, number_of_players):
        self.position = Coordinate(position)
        self.resource = randint(0, 50)  # amount of resource in the tile (will be randomized for now)
        self.units = self.initialize_units_list(number_of_players)
        self.building = None  # Tiles initialized to not have a building

    # ---------------- RESOURCE METHODS ------------------------

    def decrement_resource(self, number=1):  # reduces the resource in the tile (i.e. when a unit mines the resource)
        self.resource = self.resource - number

    # ---------------- PLAYER UNIT METHODS  -------------------------

    def increment_units(self, player, number=1):  # Useful for when buildings create units
        self.units[player] += number

    def decrement_units(self, player, number=1):
        if (self.units[player] >= number):
            self.units[player] -= number

    def set_units(self, player, number_of_units):
        self.units[player] = number_of_units

    # ---------------- BUILDING METHODS  ----------------------------

    def create_building(self, playerID):  #add building reference
        b = Building(playerID)
        self.building = b

    def destroy_building(self):  #remove building reference
        self.building = None

    # --------------- UPDATE FUNCTIONS ----------------------------

    def update_tile(self, players):
        self.update_building_status(players)
        self.update_units_number()

    def update_units_number(self):
        while (self.units[0] > 0) and (self.units[1] > 0):
            units = min(self.units[0], self.units[1])
            self.units[0] -= units
            self.units[1] -= units

    def update_units_number_multi(self): #resolves combat when there are more than one player with units on a tile (occurs post-movement)
        i = 0
        ids_players_with_units = [] #list which will contain the ids of all players with units on the tile

        total_number_units = 0 #total number of units on the tile

        for player_unit_count in self.units: #for the unit count of each player
            if player_unit_count > 0: #if it's nonzero
                total_number_units += player_unit_count #sum into total number of units on the tile
                ids_players_with_units.append(i) #append the id ('i') into the list containing ids of all players with units on the tile

            i += 1

        num_players_with_units = len(ids_players_with_units) #number of players with units on the tile

        dict = {} #maps pairs of IDs (expressed as tuples) to the number of units to send to each other

        for id_player in ids_players_with_units: #for the id 'id_player' of each player with units on the tile
            number_player_units = self.units[id_player] #the number of units on the tile controlled by player with id 'id_player'
            total_number_enemy_units = total_number_units - number_player_units #the total number of units controlled by all other players on the tile;

            #list of enemy IDs is just the list of player IDs minus 'id_player'
            ids_enemies_with_units = list(ids_players_with_units)
            ids_enemies_with_units.remove(id_player)

            #tallies total number delegated towards enemy combat
            total_number_units_sent = 0

            #distribute units to combat each enemy proportional to their unit strength
            for id_enemy in ids_enemies_with_units: #for the id 'id_enemy' of each other player with units on the tile
                number_enemy_units = self.units[id_enemy]
                number_units_sent_to_enemy = int((number_enemy_units/total_number_enemy_units) * number_player_units)

                dict[(id_player, id_enemy)] = number_units_sent_to_enemy
                total_number_units_sent += number_units_sent_to_enemy

            units_remaining = number_player_units - total_number_units_sent

            #distribute remaining units randomly
            k = 0
            while (k < units_remaining):
                random_enemy_id = random.choice(ids_enemies_with_units)
                dict[(id_player, random_enemy_id)] += 1
                k += 1

            #fix up the dictionary so that we can combine pairs of tuples that are reverses of each other into one


    #calculates combat between two players with the units they send toward each other
    def in_square_two_player_combat(self, playerId1, playerId2, units1, units2):
        smaller = min(units1, units2)
        self.units[playerId1] -= smaller
        self.units[playerId2] -= smaller

    #TODO: generalize to multiplayer
    def update_building_status(self, players):
        if self.building is not None:
            building_owner = self.building.ownerId
            attacker = 1 - building_owner

            #  Check if building will be destroyed by enemy units
            if self.units[attacker] > 0:
                if self.units[attacker] > 10 + self.units[building_owner]:
                    self.destroy_building()
                    self.units[attacker] -= 10 + self.units[building_owner] 
                    self.units[building_owner] = 0
                    return # done

                else:
                    self.units[attacker] = 0
                    self.units[building_owner] -= 10 - self.units[attacker] 

            # Check if new units should be produced
            while self.building.production_progress >= 5:
                self.increment_units(building_owner, 1)
                self.building.production_progress -= 5
                players[self.building.ownerId].increment_units_produced()

            self.building.update_production_status()

    # --------------- INITIALIZING FUNCTION ----------------------

    def initialize_units_list(self, number_of_players):  #we want to store the number of units a player has in each square, initialized to 0 for each player
        units = []


        for i in range(number_of_players):
            units.append(0)

        return units

    def __str__(self):
        string = ""
        string += "Tile at position: " + str(self.position) + '\n'
        string += "Units:" + str(self.units)
        return string
