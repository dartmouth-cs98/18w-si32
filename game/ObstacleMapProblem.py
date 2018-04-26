from game.Coordinate import Coordinate

class ObstacleMapProblem:

    def __init__(self, map, start, goal):
        self.map = map

        self.start_state = start

        self.goal_state = goal

    def __str__(self):
        string = "Obstacle map problem: "
        return string

    def transition_cost_fn(self, first_state, second_state):

        if first_state.x != second_state.x:  #if any position coordinate changed, movement happened
            return 1
        if first_state.y != second_state.y:  #if any position coordinate changed, movement happened
            return 1
        else:
            return 0

    def manhattan_heuristic(self, state):
        heuristic = 0


        heuristic += abs(state.x - self.goal_state.x)
        heuristic += abs(state.y - self.goal_state.y)

        return heuristic

    def get_successors(self, state):
        successor_list = []

        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        for direction in directions:
            new_state = Coordinate(state.x + direction[0], state.y + direction[1])
            cell = self.map.get_cell(Coordinate(new_state.x, new_state.y))

            if not (cell is None):
                if cell.occupiable:
                    successor_list.append(new_state)

        return successor_list

    def goal_test(self, state):
        if (state == self.goal_state):
            return True
        else:
            return False