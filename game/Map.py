# Map.py
# Class implementation for 'Map'

from random import randint

from game.Cell import Cell
from game.Coordinate import Coordinate

from game.params import (
    DEFAULT_MAP_WIDTH,
    DEFAULT_MAP_HEIGHT,
    STARTING_POSITIONS,
    ONE_PLAYER_START_POS,
    TWO_PLAYER_START_POS,
    THREE_PLAYER_START_POS,
    FOUR_PLAYER_START_POS,
)

from game.ObstacleMapProblem import ObstacleMapProblem
from game.astar_search import astar_search

# Constructor Arguments
# num_players (number) - the number of players involved in the game with which
#                        this map is associated.
# uniform (boolean)    - True if distribution of map resources should be uniform, False otherwise
# width (number)       - the width of the map (in cells)
# height (number)      - the height of the map (in cells)


class Map:
    def __init__(self, num_players, uniform, width=DEFAULT_MAP_WIDTH, height=DEFAULT_MAP_HEIGHT):
        self.width = width
        self.height = height
        self.num_players = num_players

        self.cells = self.initialize_map(width, height, uniform)

        # keep initializing map until we get a map where each player can reach every other player
        while (not self.players_reachable()):
            self.cells = self.initialize_map(width, height, uniform)

    def initialize_map(self, width, height, uniform):
        cells = []
        for r in range(height):
            row = []
            for c in range(width):

                # (maybe adjust later) distribution of roughly 1 in 5 cells blocked
                p = randint(1, 6)
                if p == 1:
                    occupiable = False
                else:
                    occupiable = True

                # if a cell is a starter position, make it free
                if self.num_players == 1:
                    if (c, r) in ONE_PLAYER_START_POS:
                        occupiable = True
                elif self.num_players == 2:
                    if (c, r) in TWO_PLAYER_START_POS:
                        occupiable = True
                elif self.num_players == 3:
                    if (c, r) in THREE_PLAYER_START_POS:
                        occupiable = True
                elif self.num_players == 4:
                    if (c, r) in FOUR_PLAYER_START_POS:
                        occupiable = True

                # new_cell = Cell(Coordinate(x=c, y=r), self.num_players, True, uniform) # ALL cells are free
                new_cell = Cell(Coordinate(x=c, y=r), self.num_players, occupiable, uniform)

                row.append(new_cell)
            cells.append(row)

        return cells

    # determine if paths exists between all players given the current map configuration
    def players_reachable(self):
        if self.num_players == 1:
            return True

        if self.num_players == 2:
            return len(self.path(Coordinate(TWO_PLAYER_START_POS[0]), Coordinate(TWO_PLAYER_START_POS[1]))) > 0

        if self.num_players == 3:
            return (len(self.path(Coordinate(THREE_PLAYER_START_POS[0]), Coordinate(THREE_PLAYER_START_POS[1]))) > 0) and (
                    len(self.path(Coordinate(THREE_PLAYER_START_POS[0]), Coordinate(THREE_PLAYER_START_POS[2]))) > 0) and (
                    len(self.path(Coordinate(THREE_PLAYER_START_POS[1]), Coordinate(THREE_PLAYER_START_POS[2]))) > 0)

        if self.num_players == 4:
            return (len(self.path(Coordinate(FOUR_PLAYER_START_POS[0]), Coordinate(FOUR_PLAYER_START_POS[1]))) > 0) and (
                    len(self.path(Coordinate(FOUR_PLAYER_START_POS[0]), Coordinate(FOUR_PLAYER_START_POS[2]))) > 0) and (
                    len(self.path(Coordinate(FOUR_PLAYER_START_POS[0]), Coordinate(FOUR_PLAYER_START_POS[3]))) > 0) and (
                    len(self.path(Coordinate(FOUR_PLAYER_START_POS[1]), Coordinate(FOUR_PLAYER_START_POS[2]))) > 0) and (
                    len(self.path(Coordinate(FOUR_PLAYER_START_POS[1]), Coordinate(FOUR_PLAYER_START_POS[3]))) > 0) and (
                    len(self.path(Coordinate(FOUR_PLAYER_START_POS[2]), Coordinate(FOUR_PLAYER_START_POS[3]))) > 0)

    # INPUTS: "start" (a tuple), "goal" (a tuple)
    # RETURN: a list of tuples indicating a possible path between "start" and "goal" positions
    def path(self, start, goal):
        if (not (self.get_cell(start)).occupiable) or (not (self.get_cell(goal)).occupiable):
            empty = []
            return empty

        p = ObstacleMapProblem(self, start, goal, "None", None)

        result = astar_search(p, p.manhattan_heuristic)

        return result.path

    # return cell at specified position
    def get_cell(self, position):
        if not self.position_in_range(position):
            return None

        return self.cells[position.y][position.x]

    # check if coordinates are contained by map
    def position_in_range(self, position):
        assert(type(position) is Coordinate)

        return (position.x >= 0) and (position.x < self.width) and (position.y >= 0) and (position.y < self.height)

    # check if cell is within map
    def cell_in_range(self, cell):
        return self.position_in_range(cell.position)

    # check if position is free
    def position_free(self, position):
        c = self.get_cell(position)
        #return c is not None and c.occupiable
        return c is not None

    # check if cell is free
    def cell_free(self, cell):
        return self.cell_in_range(cell) #and cell.occupiable

    # returns only the state we care about for the game log
    def get_state(self):
        return self.cells

    # methods to create/update a Map object based on the representation
    # used in the game log
    @classmethod
    def create_from_log(cls, log_map, n_players):
        m = cls(n_players, len(log_map[0]), len(log_map))

        m.update_from_log(log_map)

        return m

    def update_from_log(self, log_map):
        for (r, row) in enumerate(log_map):
            for (c, log_cell) in enumerate(row):
                cell = self.cells[r][c]
                cell.update_from_log(log_cell)

    def __str__(self):
        b = "Blocked cells:\n"
        f = "\nFree cells:\n"
        for r in self.cells:
            for cell in r:
                if (not cell.occupiable):
                    b += str(cell.position)
                    b += " "
                else:
                    f += str(cell.position)
        return b + f
