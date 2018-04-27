# Rules.py
# Class implementation for 'Rules'

from game.params import BUILDING_COST, MOVE_COMMAND, BUILD_COMMAND, MINE_COMMAND

# Rules defines bulk of the game logic: how the various components of the game
# interact and update the global state of the game.
#
# Constructor Arguments
# map (Map)      - the map associated with this game instance.
# players (list) - a list of the players involved in this game instance.

class Rules:
    def __init__(self, map, players):
        self.map = map
        self.players = players

    def verify_move(self, move):
        return self.within_bounds(move) and self.enough_units(move)

    def within_bounds(self, move):
        new_coords = move.position.adjacent_in_direction(move.direction)
        return self.map.position_in_range(new_coords)
        # return self.map.position_free(new_coords) # this also checks if in bounds

    def enough_units(self, move):
        cell = self.map.get_cell(move.position)
        return cell.units[move.playerId] >= move.num_units

    def update_by_move(self, move):
        if move.command == MOVE_COMMAND and move.num_units > 0:
            # only execute move command if it has a non-zero number of units
            self.update_move_command(move)
        elif move.command == MINE_COMMAND and move.num_units > 0:
            self.update_mine_command(move)
        elif move.command == BUILD_COMMAND:
            self.update_build_command(move)

    def update_move_command(self, move):
        old_cell = self.map.get_cell(move.position)

        destination_pos = move.position.adjacent_in_direction(move.direction) 
        new_cell = self.map.get_cell(destination_pos)

        if old_cell.units[move.playerId] < move.num_units:
            move.num_units = old_cell.units[move.playerId]

        old_cell.decrement_units(move.playerId, move.num_units)
        new_cell.increment_units(move.playerId, move.num_units)

    def update_mine_command(self, move):
        cell = self.map.get_cell(move.position)

        if cell.resource > 0:
            # each unit gathers one unit of resource from the cell when mining
            if cell.resource >= move.num_units:
                cell.decrement_resource(move.num_units)
                self.players[move.playerId].increment_resources(move.num_units)

            # if there are more miners than resources, take whatever remains
            else:
                self.players[move.playerId].increment_resources(cell.resource)
                cell.set_resources_depleted()

    def update_build_command(self, move):
        cell = self.map.get_cell(move.position)

        # if there is no building, create one
        if cell.building is None:
            if (self.player_has_enough_resources(move.playerId)) and (self.map.get_cell(cell.position).units[move.playerId] > 0):
                cell.create_building(move.playerId)
                self.players[move.playerId].decrement_resources(BUILDING_COST)


    def update_combat_phase(self, moves):
        sets = self.moves_to_dictionary(moves) #dictionaries

        num_players = len(sets)

        i = num_players - 1

        #instead of checking only the two players, in a 3+ player game, check every pair of players for collisions
        #we can still break down the collision checking into pairs of 2 since we can only have 2 players "colliding" anywhere
        #(since at the start of every turn/movement there is only units of one player/faction in any square

        #do the collision checking for each pair of players (order doesn't matter)
        while (i >= 0):

            j = i - 1

            while (j >= 0):
                moves[i], moves[j] = self.combat(moves[i], sets[j], i, j)
                sets = self.moves_to_dictionary(moves)
                j -= 1

            i -= 1

        return moves

    '''
    def update_combat_phase(self, moves):
        sets = self.moves_to_dictionary(moves)

        moves[0], moves[1] = self.combat(moves[0], sets[1])

        return moves
    '''

    # multi-player version of 'combat' method
    # (m and n are the playerIds of the two players to check for opposing collisions, since there will be more than two players in total)
    def combat(self, player_moves, enemy_set, m, n):
        index = 0

        while index < len(player_moves):
            current_move = player_moves[index]
            cell = self.map.get_cell(current_move.position)

            new_position = cell.position.adjacent_in_direction(current_move.direction) 

            if new_position in enemy_set:  # Check if opposing player has moves coming from new position
                i = 0

                while i < len(enemy_set[new_position]) and current_move:

                    enemy_move = enemy_set[new_position][i]

                    if current_move.direction.opposite() == enemy_move.direction:

                        current_cell = self.map.get_cell(cell.position)
                        enemy_cell = self.map.get_cell(enemy_move.position)

                        if current_move.num_units > enemy_move.num_units:
                            current_move.decrement_units(enemy_move.num_units)
                            current_cell.decrement_units(m, enemy_move.num_units)
                            enemy_cell.decrement_units(n, enemy_move.num_units)

                            enemy_set[new_position].pop(i)
                            i -= 1

                        elif current_move.num_units < enemy_move.num_units:
                            enemy_move.decrement_units(current_move.num_units)
                            current_cell.decrement_units(m, current_move.num_units)
                            enemy_cell.decrement_units(n, current_move.num_units)

                            current_move = False

                            player_moves.pop(index)
                            index -= 1

                        else:
                            player_moves.pop(index)
                            enemy_set[new_position].pop(i)

                            current_cell.decrement_units(m, current_move.num_units)
                            enemy_cell.decrement_units(n, current_move.num_units)

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

    '''
    def combat(self, player_moves, enemy_set):
        index = 0

        while index < len(player_moves):
            current_move = player_moves[index]
            cell = self.map.get_cell(current_move.position)

            new_position = cell.position.adjacent_in_direction(current_move.direction)

            if new_position in enemy_set:  # Check if opposing player has moves coming from new position
                i = 0

                while i < len(enemy_set[new_position]) and current_move:

                    enemy_move = enemy_set[new_position][i]

                    if current_move.direction.opposite() == enemy_move.direction:

                        current_cell = self.map.get_cell(cell.position)
                        enemy_cell = self.map.get_cell(enemy_move.position)

                        if current_move.num_units > enemy_move.num_units:
                            current_move.decrement_units(enemy_move.num_units)
                            current_cell.decrement_units(0, enemy_move.num_units)
                            enemy_cell.decrement_units(1, enemy_move.num_units)

                            enemy_set[new_position].pop(i)
                            i -= 1

                        elif current_move.num_units < enemy_move.num_units:
                            enemy_move.decrement_units(current_move.num_units)
                            current_cell.decrement_units(0, current_move.num_units)
                            enemy_cell.decrement_units(1, current_move.num_units)

                            current_move = False

                            player_moves.pop(index)
                            index -= 1

                        else:
                            player_moves.pop(index)
                            enemy_set[new_position].pop(i)

                            current_cell.decrement_units(0, current_move.num_units)
                            enemy_cell.decrement_units(1, current_move.num_units)

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
    '''

    #multi-player version of moves_to_dictionary, takes a variable 'moves', which is a list of lists of Commands (one Command list for each player, a.k.a. a 'move')
    def moves_to_dictionary(self, moves):

        num_players = len(moves) #the number of players, corresponds to the number of 'moves'
        sets = [] #a list of dictionaries (mapping positions to Commands of a player from that position)

        for move in moves: #initialize empty dictionaries
            sets.append({})

        player = 0

        while player < num_players:

            for move in moves[player]: #for each COMMAND of a player, check if the command's position is in the player's dictionary's keys; if not, add it with value as a singleton list with that Command. if it is, append to the value (list of Commands)
                if move.position not in sets[player]:
                    sets[player][move.position] = [move]
                else:
                    sets[player][move.position].append(move)

            player += 1

        return sets

    '''
    def moves_to_dictionary(self, moves):
        sets = [{}, {}]

        for move in moves[0]:
            if move.position not in sets[0]:
                sets[0][move.position] = [move]
            else:
                sets[0][move.position].append(move)

        for move in moves[1]:
            if move.position not in sets[1]:
                sets[1][move.position] = [move]
            else:
                sets[1][move.position].append(move)

        return sets
    '''

    def player_has_enough_resources(self, playerId):
        return self.players[playerId].resources >= BUILDING_COST
