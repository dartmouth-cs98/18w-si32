resource_cost = 1


class Building:
    def __init__(self, ownerID, tile, buildingID):
        self.tile = tile #the building's position on the battlefield (right now buildings take 1 tile of space, can probably change this later)
        self.position = self.tile.position
        self.ownerId = ownerId #the ID of the player who controls the building
        self.production_progress = 0
        self.defense = 10  # defense rating; default is 10
        self.buildingID = buildingID

    def increment_production_progress(self, number):  #increase production count by how many workers are on the same tile
        self.production_progress += number

    def decrement_production(self, number=10):
        self.production_progress -= number

    def destroy_self(self):
        self.tile.destroy_building()

    def __str__(self):
        return ("Building " + str(self.buildingID) +", owned by player " + str(self.ownerId))
