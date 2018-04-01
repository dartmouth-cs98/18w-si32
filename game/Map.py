from .Tile import Tile

from game.params import MAP_WIDTH, MAP_HEIGHT

class Map:
    def __init__(self, number_of_players):
        self.number_of_players = number_of_players
        self.tiles = self.initialize_map(MAP_WIDTH, MAP_HEIGHT)
        self.width = MAP_WIDTH
        self.height = MAP_HEIGHT

    # --------------------------------------------------------------------------
    # Initializing Function

    def initialize_map(self, width, height):
        tiles = []
        for i in range(width):
            col = []
            for j in range(height):
                new_tile = Tile([i, j], self.number_of_players)
                col.append(new_tile)

            tiles.append(col)

        return tiles

    # --------------------------------------------------------------------------
    # Helper functions

    # helper function for getting tiles
    def get_tile(self, position):
        return self.tiles[position[0]][position[1]]

     # returns list of adjacent tiles
    def get_adjacent_squares(self, position, direction=None):
        # If we don't need a specific direction, return all adjacent squares
        if direction is None:
            result = []
            squares = []

            squares.append([position[0]+1, position[1]])  # Square to the right
            squares.append([position[0]-1, position[1]])  # Square to the left
            squares.append([position[0], position[1]+1])  # Square below
            squares.append([position[0], position[1]-1])  # Square down

            for square in squares:  # return legal tiles
                if self.tile_in_range(square):
                    result.append(self.get_tile(square))

            return result

        # check if adjacent tile in desired direction exists
        else:
            new_pos = (position[0] + direction[0], position[1] + direction[1])
            if self.position_in_range(new_pos):
                return self.get_tile(new_pos)

    # check if coordinates are contained by map
    def position_in_range(self, position):
        return not ((position[0] < 0) or (position[0] >= (self.width-1)) or (position[1] < 0) or (position[1] >= (self.height-1)))

    def tile_in_range(self, tile):  # check if tile is within map
        return self.position_in_range(tile.position)

    # returns only the state we care about for the game log
    def get_state(self):
        return self.tiles

    def __str__(self):
        return str(self.tiles)
