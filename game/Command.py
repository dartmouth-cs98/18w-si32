# Command.py
# Class definition for 'Command'

from game.Tile import Tile
from game.Coordinate import Coordinate

# Constructor Arguments:
# playerID          -  the ID of the player issuing this command.
# position (tuple)  -  the board position in which this command originates.
# command           -  the type of command issued.
# number_of_units   -  the number of units involved in this command.
# direction (tuple) -  the direction associated with this command.

class Command:
    def __init__(self, playerId, position, command, number_of_units, direction):
        self.playerId = playerId

        self.command = command

        self.direction = direction
        self.position = Coordinate(position)
        self.number_of_units = number_of_units

    @classmethod
    def from_dict(cls, playerId, d):
        return cls(playerId, d["location"], d["command"], d["number_of_units"], d["direction"])
