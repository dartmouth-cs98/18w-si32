class Coordinate(tuple):
    @property
    def x(self):
        return self[1]

    @property
    def y(self):
        return self[0]

    def __add__(self, other):
        """ Returns the vector addition of self and other """
        return Coordinate((self.y + other.y, self.x + other.x))

    def __sub__(self, other):
        """ Returns the vector difference of self and other """
        return Coordinate((self.y - other.y, self.x - other.x))
