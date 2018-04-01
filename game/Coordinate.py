# Coordinate.py
# Class definition for 'Coordinate'

# Constructor Arguments
# (tuples) - the tuple that is, essentially, cast to a Coordinate type.

# TODO: why is y first and x second in the coordinate?? 

class Coordinate(tuple):
    @property
    def x(self):
        return self[1]

    @property
    def y(self):
        return self[0]

    """ Returns the vector addition of self and other """
    def __add__(self, other):
        other = Coordinate(other)
        return Coordinate((self.y + other.y, self.x + other.x))

    """ Returns the vector difference of self and other """
    def __sub__(self, other):
        other = Coordinate(other)
        return Coordinate((self.y - other.y, self.x - other.x))
