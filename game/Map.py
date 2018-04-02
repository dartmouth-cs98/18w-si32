# Map.py
# Class implementation for 'Map'

from .Cell import Cell

from game.params import MAP_WIDTH, MAP_HEIGHT

# Constructor Arguments
# num_players (number) - the number of players involved in the game with which
#                        this map is associated.

class Map:
    def __init__(self, num_players):
        self.num_players = num_players

        self.cells = self.initialize_map(MAP_WIDTH, MAP_HEIGHT)
        self.width = MAP_WIDTH
        self.height = MAP_HEIGHT

    # --------------------------------------------------------------------------
    # Initializing Function

    def initialize_map(self, width, height):
        cells = []
        for i in range(width):
            col = []
            for j in range(height):
                new_cell = Cell([i, j], self.num_players)
                col.append(new_cell)
            cells.append(col)

        return cells

    # --------------------------------------------------------------------------
    # Helper functions

    # return cell at specified position
    def get_cell(self, position):
        if self.position_in_range(position):
            return self.cells[position[0]][position[1]]
        else:
            return None

     # returns list of adjacent cells
    def get_adjacent_squares(self, position, direction=None):
        # If we don't need a specific direction, return all adjacent squares
        if direction is None:
            result = []
            squares = []

            squares.append([position[0]+1, position[1]])  # Square to the right
            squares.append([position[0]-1, position[1]])  # Square to the left
            squares.append([position[0], position[1]+1])  # Square below
            squares.append([position[0], position[1]-1])  # Square down

             # return legal cells
            for square in squares:
                if self.cell_in_range(square):
                    result.append(self.get_cell(square))

            return result

        # check if adjacent cell in desired direction exists
        else:
            new_pos = (position[0] + direction[0], position[1] + direction[1])
            if self.position_in_range(new_pos):
                return self.get_cell(new_pos)

    # check if coordinates are contained by map
    def position_in_range(self, position):
        return not ((position[0] < 0) or (position[0] >= (self.width - 1)) or (position[1] < 0) or (position[1] >= (self.height - 1)))

    # check if cell is within map
    def cell_in_range(self, cell):
        return self.position_in_range(cell.position)

    # returns only the state we care about for the game log
    def get_state(self):
        return self.cells

    def __str__(self):
        return str(self.cells)
