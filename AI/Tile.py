from random import randint


class Tile:
    def __init__(self, position):
        self.position = position

        self.resource = randint(0, 10) #amount of resource in the tile (will be randomized for now)
        #TODO: implement symmetrical distribution of resource across map

        self.units_A = []
        self.units_B = []

        self.building = None


    def decrement_resource(self): #reduces the resource in the tile (i.e. when a unit mines the resource)
        self.resource -= 1

    def __str__(self):
        return "Units A at " + str(self.position) + ":" + str(self.units_A) + "\n" + "Units B at " + str(self.position) + ":" + str(self.units_B)
