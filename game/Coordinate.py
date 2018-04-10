# Coordinate.py
# Class definition for 'Coordinate'

# Coordinate serves as useful helper class to aid in navigating board space.
#
# Constructor Arguments
# (tuples) - the tuple that is, essentially, cast to a Coordinate type.

# TODO: why is y first and x second in the coordinate??

class Coordinate():
    # using named args to avoid any confusion about ordering
    def __init__(self, x=None, y=None):
        if isinstance(x, Coordinate):
            self.x = x.x
            self.y = x.y
        elif isinstance(x, tuple) or isinstance(x, list):
            self.x = x[0]
            self.y = x[1]
        else:
            self.x = x
            self.y = y

    def __iter__(self):
        return iter(tuple((self.x, self.y)))

    def __hash__(self):
        return hash((self.x, self.y))

    # returns the coordinates that you arrive at by moving 1 step in direction from current cell
    def adjacent_in_direction(self, direction):
        if direction is None: return self

        return self

        return Coordinate(
                x = self.x + direction[0],
                y = self.y + direction[1],
            )

    # Returns the vector addition of self and other.
    def __add__(self, other):
        other = Coordinate(other)
        return Coordinate((self.y + other.y, self.x + other.x))

    # Returns the vector difference of self and other.
    def __sub__(self, other):
        other = Coordinate(other)
        return Coordinate((self.y - other.y, self.x - other.x))

    # Returns the vector difference of self and other.
    def sub(self, other):
        other = Coordinate(other)
        return Coordinate((self.y - other.y, self.x - other.x))

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y

