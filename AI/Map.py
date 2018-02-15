from Tile import Tile

width = 40 #width of map
height = 40 #height of map

class Map:
    def __init__(self):
        numSquares = width * height

        self.tiles = []

        for j in range(0, height):
            for i in range(0, width):
                self.tiles.append(Tile((i, j)))

    def is_in_range(self, pos):
        if (pos[0] < 0) | (pos[0] >= width) | (pos[1] < 0) | (pos[1] >= height):
            return False
        else:
            return True
