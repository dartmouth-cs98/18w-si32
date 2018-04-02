# params.py
# Game parameters that remain consistent across all game variations / iterations.

# ------------------------------------------------------------------------------
# Game

MAX_ITERS = 2000         # The maximum number of turn iterations in a single game.

# ------------------------------------------------------------------------------
# Building

PRODUCTION_RATE = 1      # The value of resources produced by a single building in a single turn.
DEFENSE_RATING = 10      # The default defense value of a single building.

# ------------------------------------------------------------------------------
# Map

MAP_WIDTH = 20           # The width of the game map.
MAP_HEIGHT = 20          # The height of the game map.

# ------------------------------------------------------------------------------
# Player

INITIAL_RESOURCES = 100  # The value of resources that an individual player begins the game with.

# ------------------------------------------------------------------------------
# Rules

BUILDING_COST = 100      # The resource cost to construct an individual building.

# ------------------------------------------------------------------------------
# Tile

UNIT_COST = 5           # The resource cost of producing a single additional unit. 
MAX_RESOURCES = 50      # The maximum resource value for an individual tile.
