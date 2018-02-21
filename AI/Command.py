import json
from Tile import Tile


class Command:

    def __init__(self, playerId, tile, command, number_of_units, direction):
        self.playerId = playerId
        self.tile = tile
        self.command = command
        self.number_of_units = number_of_units
        self.direction = direction

    def decrement_units(self, number):
        if number <= self.number_of_units:
            self.number_of_units -= number

    def increment_units(self, number):
        self.number_of_units += number

    def to_json(self):  # turns command into json object for stdstreams
        return json.dumps(self, default=lambda o: o.__dict__)

    def __str__(self):
        return "Player "+str(self.playerId) + " moving " + str(self.number_of_units) + " units from tile " + str(self.tile.position) + " in direction " + str(self.direction)

test = Command(0, Tile([0, 0], 2), 'move', 5, 90)
