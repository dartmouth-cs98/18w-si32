from random import randint


class Tile:

    def __init__(self, position, number_of_players):

        self.position = position
        self.resource = randint(0, 100)  # amount of resource in the tile (will be randomized for now)
        self.units = self.initialize_units_list(number_of_players)
        self.building = None  # Tiles initialized to not have a building
        self.units_mining = 0
        self.units_building = 0

    # ---------------- RESOURCE METHODS ------------------------

    def decrement_resource(self, number=1):  # reduces the resource in the tile (i.e. when a unit mines the resource)
        self.resource = self.resource - number

    # ---------------- PLAYER UNIT METHODS  -------------------------

    def increment_units(self, player, number=1):  # Useful for when buildings create unit
        self.units[player] += number

    def decrement_units(self, player, number=1):
        self.units[player] -= number

    def set_units(self, player, number_of_units):
        self.units[player] = number_of_units

    # ---------------- BUILDING METHODS  ----------------------------

    def add_building(self, building):  # store buildng ID if there's a building
        self.building = building

    def destroy_building(self):  # remove building reference
        self.building = None

    # --------------- INITIALIZING FUNCTION ----------------------

    def initialize_units_list(self, number_of_players):  # We want to store the number of units a player has in each square, initialized to 0 for each player
        units = []

        for i in range(number_of_plaByers):
            units.append(0)

        return units

    def __str__(self):
        return "Units A at " + str(self.position) + ":" + str(self.units_A) + "\n" + "Units B at " + str(self.position) + ":" + str(self.units_B)
