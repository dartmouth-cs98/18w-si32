from .Tile import Tile

class Command:

    # location is tuple of square, direction is tuple of which direction
    def __init__(self, playerId, position, command, number_of_units, direction):
        self.playerId = playerId
        self.position = position
        self.command = command
        self.number_of_units = number_of_units
        self.direction = direction

    def decrement_units(self, number):
        if number <= self.number_of_units:
            self.number_of_units -= number

    def increment_units(self, number):
        self.number_of_units += number

    @classmethod
    def from_dict(cls, playerId, d):
        return cls(playerId, d["location"], d["command"], d["number_of_units"], d["direction"])

    def __str__(self):
        return "Player "+str(self.playerId) + " moving " + str(self.number_of_units) + " units from tile " + str(self.position) + " in direction " + str(self.direction)

test = Command(0, Tile([0, 0], 2), 'move', 5, 90)
