resource_cost = 1
nextId = 0

class Building:
    def __init__(self, ownerID):
        global nextId
        self.ownerId = ownerID #the ID of the player who controls the building
        self.production_progress = 0
        self.defense = 10  # defense rating; default is 10
        self.buildingID = nextId
        nextId += 1

    def increment_production_progress(self, number):  #increase production count by how many workers are on the same tile
        self.production_progress += number

    def decrement_production(self, number=10):
        self.production_progress -= number

    def __str__(self):
        return ("Building " + str(self.buildingID) +", owned by player " + str(self.ownerId))
