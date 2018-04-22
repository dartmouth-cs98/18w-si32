# Map.py
# Class implementation for 'Map'

from .Cell import Cell
from .Coordinate import Coordinate
from random import randint

from game.params import DEFAULT_MAP_WIDTH, DEFAULT_MAP_HEIGHT, STARTING_POSITIONS, one_player, two_players, three_players, four_players

# Constructor Arguments
# num_players (number) - the number of players involved in the game with which
#                        this map is associated.
# uniform (boolean)    - True if distribution of map resources should be uniform, False otherwise
# width (number)       - the width of the map (in cells)
# height (number)      - the height of the map (in cells)

class Map:
    def __init__(self, num_players, uniform, width=DEFAULT_MAP_WIDTH, height=DEFAULT_MAP_HEIGHT):
        self.num_players = num_players

        self.cells = self.initialize_map(width, height, uniform)
        self.width = width
        self.height = height

    # --------------------------------------------------------------------------
    # Initializing Function

    def initialize_map(self, width, height, uniform):
        cells = []
        for r in range(height):
            row = []
            for c in range(width):

                # (maybe adjust later) distribution of roughly 1 in 5 cells blocked
                p = randint(1, 5)
                if p == 1:
                    occupiable = False
                else:
                    occupiable = True

                # if a cell is a starter position, make it free
                if (self.num_players == 1):
                    if ((c, r) in one_player):
                        occupiable = True
                elif (self.num_players == 2):
                    if ((c, r) in two_players):
                        occupiable = True
                elif (self.num_players == 3):
                    if ((c, r) in three_players):
                        occupiable = True
                elif (self.num_players == 4):
                    if ((c, r) in four_players):
                        occupiable = True

                new_cell = Cell(Coordinate(x=c, y=r), self.num_players, True, uniform)

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

    #check if position is free
    def position_free(self, position):
        return self.position_in_range(position) and self.get_cell(position).occupiable

    # check if cell is free
    def cell_free(self, cell):
        return self.cell_in_range(cell) and cell.occupiable

    # returns only the state we care about for the game log
    def get_state(self):
        return self.cells

    def __str__(self):
        s = "Blocked cells:\n"
        for r in self.cells:
            for cell in r:
                if (not cell.occupiable):
                    s += str(cell.position)
                    s += " "
        return s
