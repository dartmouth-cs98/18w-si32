# Coordinate.py
# Class definition for 'Coordinate'

# Coordinate serves as useful helper class to aid in navigating board space.
#
# Constructor Arguments
# (tuples) - the tuple that is, essentially, cast to a Coordinate type.

# TODO: why is y first and x second in the coordinate??
from game.params import Direction

direction_deltas = [
    { # for even rows, at index 0 since this handles row % 2 == 0
        Direction.NORTHWEST : (0, -1),
        Direction.NORTHEAST : (1, -1),
        Direction.EAST      : (1, 0),
        Direction.SOUTHEAST : (1, 1),
        Direction.SOUTHWEST : (0, 1),
        Direction.WEST      : (-1, 0),
        Direction.NONE      : (0, 0)
    },
    { # for even rows, at index 1 since this handles row % 2 == 1
        Direction.NORTHWEST : (-1, -1),
        Direction.NORTHEAST : (0, -1),
        Direction.EAST      : (1, 0),
        Direction.SOUTHEAST : (0, 1),
        Direction.SOUTHWEST : (-1, 1),
        Direction.WEST      : (-1, 0),
        Direction.NONE      : (0, 0)
    }
]

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

    def __str__(self):
        return "(%d, %d)" % (self.x, self.y)

    # returns the coordinates that you arrive at by moving 1 step in direction from current cell
    def adjacent_in_direction(self, direction):
        if direction is None: return self
    
        assert(type(direction) is Direction)

        delta = direction_deltas[self.y & 1][direction]

        return Coordinate(self.x + delta[0], self.y + delta[1])

    def __eq__(self, other):
        assert(type(other) is Coordinate)

        return self.x == other.x and self.y == other.y

