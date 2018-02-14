from Tile import Tile

width = 50  # width of map
height = 50  # height of map


class Map:
    def __init__(self, number_of_players):

        self.number_of_players = number_of_players
        self.map = self.initialize_map(width, height)
        self.width = width
        self.height = height

    # --------- Helper functions -------------

    def get_tile(self, position):  # helper function for getting files
        return self.map[position[0]][position[1]]

    def get_adjacent_squares(self, position):  # returns list of adjacent tiles
        result = []
        squares = []

        squares.append([position[0]+1, position[1]])  # Square to the right
        squares.append([position[0]-1, position[1]])  # Square to the left
        squares.append([position[0], position[1]+1])  # Square below
        squares.append([position[0], position[1]-1])  # Square down

        for square in squares:  # return legal tiles
            if self.tile_in_range(square):
                result.append(self.map.get_tile(square))

        return result

    def tile_in_range(self, pos):  # check if coordinates are contained by map

        if (pos[0] < 0) | (pos[0] >= (self.width-1)) | (pos[1] < 0) | (pos[1] >= (self.height-1)):
            return False

        else:
            return True

    # ------ Initializing function ---------------

    def initialize_map(self, width, height):
        tiles = []

        w = 0

        while w < width:  # create cols
            col = []
            h = 0

            while h < height:  # create rows

                new_tile = Tile([w, h], self.number_of_players)

                col.append(new_tile)
                h += 1

            w += 1

        return tiles
