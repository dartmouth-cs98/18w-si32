class ObstacleMapProblem:

    def __init__(self, map, start, goal):
        self.map = map

        self.start_state = start

        self.goal_state = goal

    def __str__(self):
        string =  "Obstacle map problem: "
        return string


    def transition_cost_fn(self, first_state, second_state):
        for i in range(2):
            if (first_state[i] != second_state[i]):  #if any position coordinate changed, movement happened
                return 1
        else:
            return 0


    def manhattan_heuristic(self, state):
        heuristic = 0

        for i in range(2):
            heuristic += abs(state[i] - self.goal_state[i])

        return heuristic


    def get_successors(self, state):
        successor_list = []

        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

        for direction in directions:
            new_state = state + direction
            if (self.map.get_cell(new_state).occupiable):
                successor_list.append(new_state)

        return successor_list

    def goal_test(self, state):
        if (state == self.goal_state):
            return True
        else:
            return False