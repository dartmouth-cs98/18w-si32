from random import *
class Tile:
    def __init__(self, position):
        self.position = position
        self.resource = randint(0, 9) #indicates the amount of resource contained by the tile (will be random?)

    def decrement_resource(self): #reduces the resource (i.e. when a unit mines the resource)
        self.resource -= 1
