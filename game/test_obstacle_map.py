from game.Map import Map
from game.ObstacleMapProblem import ObstacleMapProblem

from game.astar_search import astar_search

map = Map(2)
print(map)
test = ObstacleMapProblem(map, (1, 1), (18, 18))

result = astar_search(test, test.manhattan_heuristic)
print(result)