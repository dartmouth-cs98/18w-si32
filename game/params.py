# params.py
from enum import IntEnum

# Game parameters that remain consistent across all game variations / iterations.


# ------------------------------------------------------------------------------
# Movement Directions 

# currently contains directions for old and new (hex) grids
class Direction(IntEnum):
    EAST        = 1
    WEST        = 2
    NORTHEAST   = 3
    NORTHWEST   = 4
    SOUTHEAST   = 5
    SOUTHWEST   = 6
    NONE        = 7

    def opposite(self):
        if self == Direction.EAST:
            return Direction.WEST

        if self == Direction.WEST:
            return Direction.EAST

        if self == Direction.NORTHEAST:
            return Direction.SOUTHWEST

        if self == Direction.SOUTHWEST:
            return Direction.NORTHEAST

        if self == Direction.NORTHWEST:
            return Direction.SOUTHEAST

        if self == Direction.SOUTHEAST:
            return Direction.NORTHWEST

        return self.NONE


# ------------------------------------------------------------------------------
# Command

MOVE_COMMAND = 'MOVE_COMMAND'
MINE_COMMAND = 'MINE_COMMAND'
BUILD_COMMAND = 'BUILD_COMMAND'

# ------------------------------------------------------------------------------
# Game

MAX_ITERS = 2000         # The maximum number of turn iterations in a single game.

# ------------------------------------------------------------------------------
# GameState

DEBUG_LOG_FN = "./gameserver.log"

# ------------------------------------------------------------------------------
# Building

PRODUCTION_RATE = 1      # The value of resources produced by a single building in a single turn.
DEFENSE_RATING = 10      # The default defense value of a single building.

# ------------------------------------------------------------------------------
# Map

DEFAULT_MAP_WIDTH = 20           # The width of the game map.
DEFAULT_MAP_HEIGHT = 20          # The height of the game map.

# ------------------------------------------------------------------------------
# Player

INITIAL_RESOURCES = 100  # The value of resources that an individual player begins the game with.

# ------------------------------------------------------------------------------
# Rules

BUILDING_COST = 100      # The resource cost to construct an individual building.

# ------------------------------------------------------------------------------
# Cell

UNIT_COST = 5           # The resource cost of producing a single additional unit.
MAX_RESOURCES = 50      # The maximum resource value for an individual cell.

# ------------------------------------------------------------------------------
# Starting player positions
# Intended to be roughly equidistant for each number of players
one_player = [(10,10)]
two_players = [(0,0), (18,18)]
three_players = [(5,5), (10,14), (15,5)]
four_players = [(5,5), (5,15), (15,5), (15,15)]

STARTING_POSITIONS = [one_player, two_players, three_players, four_players]
