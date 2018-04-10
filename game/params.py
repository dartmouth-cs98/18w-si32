# params.py
# Game parameters that remain consistent across all game variations / iterations.

# ------------------------------------------------------------------------------
# Movement Directions 

DIRECTIONS = {
    'left'  : [-1, 0],
    'right' : [1,  0],
    'up'    : [0, -1],
    'down'  : [0,  1],
    'none'  : [0,  0],
}

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
two_players = [(2,2), (17,17)]
three_players = [(5,5), (10,14), (15,5)]
four_players = [(5,5), (5,15), (15,5), (15,15)]

STARTING_POSITIONS = [one_player, two_players, three_players, four_players]
