from random import randint


class Tile:

    def __init__(self, position, number_of_players):

        self.number_of_players = number_of_players
        self.position = position
        self.resource = randint(0, 10)  # amount of resource in the tile (will be randomized for now)
        self.units = self.initialize_units_list()
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

    def add_building(self, building):  #add building reference
        self.building = building

    def destroy_building(self):  #remove building reference
        self.building = None

    # --------------- UPDATE FUNCTIONS ----------------------------

    def update_units_number(self):
        while (self.units[0] > 0) and (self.units[1] > 0):
            self.units[0] -= 1
            self.units[1] -= 1

    def update_building_status(self):
        if self.building is not None:
            building_owner = self.building.ownerId
            enemy_player = 1 - building_owner

            #  Check if building will be destroyed by enemy units
            if self.units[enemy_player] > 0:

                if self.units[enemy_player] >= 10:
                    self.destroy_building()
                    self.units[enemy_player] -= 10

                else:
                    self.units[enemy_player] = 0

            # Check if new units should be produced
            while self.building.production_progress >= 5:
                self.increment_units(building_owner, 1)
                self.building.production_progress -= 5

    # --------------- INITIALIZING FUNCTION ----------------------

    def initialize_units_list(self):  #we want to store the number of units a player has in each square, initialized to 0 for each player
        units = []


        for i in range(self.number_of_players):
            units.append(0)

        return units

    def __str__(self):
        string = ""
        string += "Tile at position: " + str(self.position) + '\n'

        string += "Player 1 units: " +str(self.units[0]) + "\n"
        string+= "Player 2 units: " +str(self.units[1])
        return string
