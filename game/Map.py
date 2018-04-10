# Map.py
# Class implementation for 'Map'

from .Cell import Cell
from .Coordinate import Coordinate

from game.params import DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT

# Constructor Arguments
# num_players (number) - the number of players involved in the game with which
#                        this map is associated.

class Map:
    def __init__(self, num_players, width=DEFAULT_MAP_WIDTH, height=DEFAULT_MAP_HEIGHT):
        self.num_players = num_players

        self.cells = self.initialize_map(width, height)
        self.width = width
        self.height = height

    # --------------------------------------------------------------------------
    # Initializing Function

    def initialize_map(self, width, height):
        cells = []
        for r in range(height):
            row = []
            for c in range(width):
                new_cell = Cell(Coordinate(x=c, y=r), self.num_players)
                row.append(new_cell)
            cells.append(row)

        return cells

    # --------------------------------------------------------------------------
    # Helper functions

    # return cell at specified position
    def get_cell(self, position):
        assert(type(position) is Coordinate)

        if self.position_in_range(position):
            return self.cells[position.y][position.x]
        else:
            return None

    # check if coordinates are contained by map
    def position_in_range(self, position):
        assert(type(position) is Coordinate)

        return ((position.x >= 0) and (position.x < (self.width - 1)) and (position.y >= 0) and (position.y < (self.height - 1)))

    # check if cell is within map
    def cell_in_range(self, cell):
        return self.position_in_range(cell.position)

    # returns only the state we care about for the game log
    def get_state(self):
        return self.cells

    def __str__(self):
        return str(self.cells)
