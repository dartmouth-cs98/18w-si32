
BUILDING_COST = 100

class Rules:

    def __init__(self, map, players):
        self.map = map
        self.players = players

    def verify_move(self, move):
        return self.within_bounds(move) and self.enough_units(move)

    def within_bounds(self, move):
        return self.map.position_in_range(move.position)

    def enough_units(self, move):
        tile = self.map.get_tile(move.position)
        return tile.units[move.playerId] >= move.number_of_units

    def update_by_move(self, move):
        if move.command == 'move':
            self.update_move_command(move)

        if move.command == 'build':
            self.update_build_command(move)

        if move.command == 'mine':
            self.update_mine_command(move)

    def update_move_command(self, move):
        old_tile = self.map.get_tile(move.position)
        new_tile = self.map.get_tile([old_tile.position[0] + move.direction[0], old_tile.position[1] + move.direction[1]])

        old_tile.decrement_units(move.playerId, move.number_of_units)
        new_tile.increment_units(move.playerId, move.number_of_units)

    def update_mine_command(self, move):
        tile = self.map.get_tile(move.position)

        if tile.resource > 0:

            # Each unit gathers one unit of resource from the tile when mining
            if tile.resource >= move.number_of_units:
                tile.decrement_resource(move.number_of_units)
                self.players[move.playerId].increment_resources(move.number_of_units)

            # If there are more miners than resources, take whatever remains
            else:
                self.players[move.playerId].increment_resources(tile.resource)
                tile.resource = 0

    def update_build_command(self, move):
        tile = self.map.get_tile(move.position)

        # Two cases for building: either they're making a new building or they're
        # increasing the production count of an existing one

        # If there is no building, create one
        if tile.building is None:
            if (self.player_has_enough_resources(move.playerId)) and (self.map.get_tile(tile.position).units[move.playerId] > 0):
                tile.create_building(move.playerId)
                self.players[move.playerId].decrement_resources(BUILDING_COST)


    def update_combat_phase(self, moves):
        sets = self.moves_to_dictionary(moves)

        moves[0], moves[1] = self.combat(moves[0], sets[1])

        return moves

    def combat(self, player_moves, enemy_set):
        index = 0

        while index < len(player_moves):
            current_move = player_moves[index]
            tile = self.map.get_tile(current_move.position)

            new_position = (tile.position[0] + current_move.direction[0],
            tile.position[1] + current_move.direction[1])

            if new_position in enemy_set:  # Check if opposing player has moves coming from new position
                i = 0

                while i < len(enemy_set[new_position]) and current_move:

                    enemy_move = enemy_set[new_position][i]

                    if self.opposite_direction(current_move.direction, enemy_move.direction):

                        current_tile = self.map.get_tile(tile.position)
                        enemy_tile = self.map.get_tile(enemy_move.position)

                        if current_move.number_of_units > enemy_move.number_of_units:
                            current_move.decrement_units(enemy_move.number_of_units)
                            current_tile.decrement_units(0, enemy_move.number_of_units)
                            enemy_tile.decrement_units(1, enemy_move.number_of_units)

                            enemy_set[new_position].pop(i)
                            i -= 1

                        elif current_move.number_of_units < enemy_move.number_of_units:
                            enemy_move.decrement_units(current_move.number_of_units)
                            current_tile.decrement_units(0, current_move.number_of_units)
                            enemy_tile.decrement_units(1, current_move.number_of_units)

                            current_move = False

                            player_moves.pop(index)
                            index -= 1

                        else:
                            player_moves.pop(index)
                            enemy_set[new_position].pop(i)

                            current_tile.decrement_units(0, current_move.number_of_units)
                            enemy_tile.decrement_units(1, current_move.number_of_units)

                            current_move = False

                            i -= 1
                            index -= 1

                    i += 1

            index += 1

        enemy_moves = []

        for moves in enemy_set.values():
            for move in moves:
                enemy_moves.append(move)

        return player_moves, enemy_moves


    def moves_to_dictionary(self, moves):
        sets = [{}, {}]

        for move in moves[0]:
            if tuple(move.position) not in sets[0]:
                sets[0][tuple(move.position)] = [move]
            else:
                sets[0][tuple(move.position)].append(move)

        for move in moves[1]:
            if tuple(move.position) not in sets[1]:
                sets[1][tuple(move.position)] = [move]
            else:
                sets[1][tuple(move.position)].append(move)

        return sets

    def opposite_direction(self, direction1, direction2):
        temp = (direction1[0]*-1, direction1[1]*-1)

        return (temp[0] == direction2[0]) and (temp[1] == direction2[1])

    def player_has_enough_resources(self, playerId):
        return self.players[playerId].resources >= BUILDING_COST
