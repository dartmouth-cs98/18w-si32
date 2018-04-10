# Command.py
# Class definition for 'Command'

from game.Cell import Cell
from game.Coordinate import Coordinate

from game.params import MOVE_COMMAND, BUILD_COMMAND, MINE_COMMAND

# A Command is a useful wrapper around the command data generated by user bot code.
#
# Constructor Arguments
# playerID          -  the ID of the player issuing this command.
# position (tuple)  -  the board position in which this command originates.
# command           -  the type of command issued.
# num_units         -  the number of units involved in this command.
# direction (tuple) -  the direction associated with this command.

class Command:
    def __init__(self, playerId, position, command, num_units, direction):
        self.playerId = playerId

        self.command = command

        self.direction = direction

        if isinstance(position, Coordinate):
            self.position = position
        else:
            self.position = Coordinate(x = position[0], y = position[1])

        # catch people trying to send negative number of units
        if num_units >= 1:
            self.num_units = num_units
        else:
            self.num_units = 0

    def decrement_units(self, number=1):
        if self.num_units >= number:
            self.num_units -= number
        else:
            self.num_units = 0

    @classmethod
    def from_dict(cls, playerId, d):
        return cls(playerId, d["location"], d["command"], d["num_units"], d["direction"])
