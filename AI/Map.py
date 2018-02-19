from Tile import Tile

width = 5 # width of map
height = 5  # height of map


class Map:
    def __init__(self, number_of_players):

        self.number_of_players = number_of_players
        self.tiles = self.initialize_tiles(width, height)
        self.width = width
        self.height = height
        self.number_of_tiles = width * height

    # --------- Helper functions -------------

    def get_tile(self, position):  # helper function for getting files
        return self.tiles[position[0]][position[1]]

    def get_adjacent_squares(self, position, direction=None):  # returns list of adjacent tiles

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

        else:
            new_pos = (position[0] + direction[0], position[1] + direction[1])
            if self.tile_in_range(new_pos):
                return self.get_tile(new_pos)


    def tile_in_range(self, pos):  # check if coordinates are contained by map

        if (pos[0] < 0) | (pos[0] > (self.width-1)) | (pos[1] < 0) | (pos[1] > (self.height-1)):
            return False

        else:
            return True

    # ------ Initializing function ---------------

    def initialize_tiles(self, width, height):
        tiles = []

        w = 0

        while w < width:  # create cols
            col = []
            h = 0

            while h < height:  # create rows

                new_tile = Tile((w, h), self.number_of_players)

                col.append(new_tile)
                h += 1

            tiles.append(col)
            w += 1

        return tiles
