from game.Tile import Tile
from game.Coordinate import Coordinate

class Command:

    # location is tuple of square, direction is tuple of which direction
    def __init__(self, playerId, position, command, number_of_units, direction):
        self.playerId = playerId
        self.position = Coordinate(position)
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
