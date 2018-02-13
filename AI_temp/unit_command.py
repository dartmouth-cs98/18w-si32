import json


class Unit_command:

    def __init__(self, tile, command, number_of_units, direction):
        self.tile = tile
        self.command = command
        self.number_of_units = number_of_units
        self.direction = direction

    def to_json(self):  # turns command into json object for stdstreams
        return json.dumps(self, default=lambda o: o.__dict__)



test = Unit_command([0,0], 'move', 5, 90)

print(test.to_json())
