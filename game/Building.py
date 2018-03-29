from game.params import PRODUCTION_RATE, DEFENSE_RATING

nextId = 0

class Building:
    def __init__(self, ownerID):
        global nextId
        self.ownerId = ownerID         # ID of the player who controls this building

        self.production_progress = 0
        self.defense = DEFENSE_RATING
        self.buildingID = nextId
        nextId += 1

    def update_production_status(self):
        self.production_progress += PRODUCTION_RATE

    def increment_production_progress(self, number):  #increase production count by how many workers are on the same tile
        self.production_progress += number

    def decrement_production(self, number=10):
        self.production_progress -= number

    def __str__(self):
        return ("Building " + str(self.buildingID) +", owned by player " + str(self.ownerId))
