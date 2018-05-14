from game.Coordinate import Coordinate, direction_deltas


class ObstacleMapProblem:
    def __init__(self, map, start, goal, flags, playerId):
        self.map = map

        self.start_state = start

        self.goal_state = goal

        self.flags = flags

        self.playerId = playerId

    def __str__(self):
        string = "Obstacle map problem: "
        return string

    def transition_cost_fn(self, first_state, second_state):
        if first_state.x != second_state.x:  # if any position coordinate changed, movement happened
            return 1
        if first_state.y != second_state.y:  # if any position coordinate changed, movement happened
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

        # directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        directions = direction_deltas[state.y & 1]

        cells_with_enemy_units_and_adjacent_cells = set()

        for direction in directions:
            new_state = state.adjacent_in_direction(direction)
            # new_state = Coordinate(state.x + direction[0], state.y + direction[1])
            cell = self.map.get_cell(Coordinate(new_state.x, new_state.y))

            if not (cell is None):
                if self.flags == "None":
                    if (not cell.obstructed):
                        successor_list.append(new_state)
                elif self.flags == "Enemy units":
                    if self.cell_has_no_enemy_units(cell):
                        successor_list.append(new_state)

                elif self.flags == "Enemy units plus adjacents":
                    if len(cells_with_enemy_units_and_adjacent_cells) == 0:
                        enemy_cells = []
                        for col in self.map.cells:
                            for cell in col:
                                if (not (self.get_pos_owner(cell.position) is None)) and (self.get_pos_owner(cell.position) != self.playerId):
                                    enemy_cells.append(cell)
                                    cells_with_enemy_units_and_adjacent_cells.add(cell)

                        for enemy_cell in enemy_cells:
                            adjacents = self.get_adjacents_of_cell(enemy_cell)
                            cells_with_enemy_units_and_adjacent_cells = cells_with_enemy_units_and_adjacent_cells.union(adjacents)

                    if (not cell.obstructed) and (not (cell.position in cells_with_enemy_units_and_adjacent_cells)):
                        successor_list.append(new_state)
                elif self.flags == "Enemy buildings":
                    if self.cell_has_no_enemy_buildings(cell):
                        successor_list.append(new_state)
                elif self.flags == "Enemy units and buildings":
                    if self.cell_has_no_enemy_buildings(cell) and self.cell_has_no_enemy_units(cell):
                        successor_list.append(new_state)
                elif self.flags == "Enemy units plus adjacents and buildings":
                    if not self.cell_has_no_enemy_buildings(cell):
                        break
                    if len(cells_with_enemy_units_and_adjacent_cells) == 0:
                        enemy_cells = []
                        for col in self.map.cells:
                            for cell in col:
                                if (not (self.get_pos_owner(cell.position) is None)) and (self.get_pos_owner(cell.position) != self.playerId):
                                    enemy_cells.append(cell)
                                    cells_with_enemy_units_and_adjacent_cells.add(cell)

                        for enemy_cell in enemy_cells:
                            adjacents = self.get_adjacents_of_cell(enemy_cell)
                            cells_with_enemy_units_and_adjacent_cells = cells_with_enemy_units_and_adjacent_cells.union(adjacents)

                    if (not cell.obstructed) and (not (cell.position in cells_with_enemy_units_and_adjacent_cells)):
                        successor_list.append(new_state)


        return successor_list

    def cell_has_no_enemy_units(self, cell):
        return (not cell.obstructed) and ((self.get_pos_owner(cell.position) == self.playerId) or (self.get_pos_owner(cell.position) is None))

    def cell_has_no_enemy_buildings(self, cell):
        return (not cell.obstructed) and ((cell.hive is None) or (cell.hive.ownerId == self.playerId))

    def goal_test(self, state):
        if state == self.goal_state:
            return True
        else:
            return False

    def get_adjacents_of_cell(self, cell):
        adjacents = set()
        directions = direction_deltas[cell.position.y & 1]
        for direction in directions:
            adjacent = cell.position.adjacent_in_direction(direction)
            if self.map.position_within_bounds(adjacent):
                adjacents.add(adjacent)

        return adjacents

    def get_pos_owner(self, pos):
        cell = self.map.get_cell(pos)
        if all(i == 0 for i in cell.units):
            return None
        else:
            j = 0
            while cell.units[j] == 0:
                j += 1
            return j
