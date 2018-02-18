from Tile import Tile
import json


class ActionCommand:

    def __init__(self, tile, type, number_of_units, direction):
        self.tile = tile
        self.type = type
        self.number_of_units = number_of_units
        self.direction = direction

    def __str__(self):
        string = ""
        string += "Command -- Tile: " + str(self.tile.position) + ", Type: " + str(self.type) + ", Number of units involved: " + str(self.number_of_units) + ", Direction: " + str(self.direction)
        return string

    def to_json(self):  # turns command into json object for stdstreams
        return json.dumps(self, default=lambda o: o.__dict__)


#test = ActionCommand(Tile((0, 0), 2), 'move', 5, (0, 1))
#print(test)
#print(test.to_json())
