from random import randint
from game.Building import Building
from game.Coordinate import Coordinate


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
