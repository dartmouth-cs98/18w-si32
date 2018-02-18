from random import randint


class Tile:

    def __init__(self, position, number_of_players):

        self.number_of_players = number_of_players
        self.position = position
        self.resource = randint(0, 10)  # amount of resource in the tile (will be randomized for now)
        self.units = self.initialize_units_list()
        self.building = None  # Tiles initialized to not have a building

        #self.units_mining = 0
        #self.units_building = 0

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

    def add_building(self, building):  #add building reference
        self.building = building

    def destroy_building(self):  #remove building reference
        self.building = None

    # --------------- INITIALIZING FUNCTION ----------------------

    def initialize_units_list(self):  #we want to store the number of units a player has in each square, initialized to 0 for each player
        units = []


        for i in range(self.number_of_players):
            units.append(0)

        return units

    def __str__(self):
        string = ""
        string += "Position: " + str(self.position)

        for i in range(self.number_of_players):
            string += "Units of Player " + str(i) + ":" + str(self.units[i]) + "\n"

        return string
