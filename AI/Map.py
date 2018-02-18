from Tile import Tile

width = 5  # width of map
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

    '''
    def get_adjacent_squares(self, position):  # returns list of adjacent tiles
        legal_adjacent_square_positions = []
        possible_adjacent_square_positions = []

        right_square_pos = [position[0]+1, position[1]]
        left_square_pos = [position[0]-1, position[1]]
        above_square_pos = [position[0], position[1]+1]
        below_square_pos = [position[0], position[1]-1]

        possible_adjacent_square_positions.append(right_square_pos)  # Square to the right
        possible_adjacent_square_positions.append(left_square_pos)  # Square to the left
        possible_adjacent_square_positions.append(above_square_pos)  # Square below
        possible_adjacent_square_positions.append(below_square_pos)  # Square down

        for square_position in possible_adjacent_square_positions:  # return legal tiles
            if self.tile_in_range(possible_adjacent_square_positions):
                legal_adjacent_square_positions.append(self.get_tile(square_position))

        return legal_adjacent_square_positions
    '''

    def get_adjacent_position(self, position, direction):
        adjacent_square_pos = ((position[0] + direction[0]), (position[1] + direction[1]))

        if self.tile_in_range(adjacent_square_pos):
            return adjacent_square_pos

        return None

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
