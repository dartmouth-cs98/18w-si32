from json_helpers import json_to_object_list
from random import randint

from Building import Building
from Building import resource_cost
from ActionCommand import ActionCommand
from Player import Player
from Map import Map

from collections import deque
from time import sleep


class GameState:

    def __init__(self, map, rules, number_of_players, user_codes):

        # Game state is determined by map, players, and rules. Higher-level
        # game state takes these objects and runs games, allowing for a
        # game-agnostic framework

        self.map = map
        self.number_of_players = number_of_players
        self.players = self.initialize_players(number_of_players, map, user_codes)
        #self.rules = rules(self.map, self.players)
        self.game_over = False

        self.turn = 0

        self.runningBuildingID = 0
        self.initialize_units()

    def play_game(self):

        while not self.game_over:  # Main loop. Simulates both players taking a turn until someone wins
            self.play_a_turn()

    def play_a_turn(self):  # gets moves from both players and executes them
        '''
        moves = []
        i = 0

        for player in self.players:
            moves.append(player.get_move())

        while i < self.number_of_players:
            self.execute_move(moves[i], i)
            i += 1
        '''

        print("Turn " + str(self.turn))
        print("-------------------------------------------------------------------------")
        print("\n")
        moves = []

        for player in self.players:
            moves.append(player.get_move())


        k = 0
        for move in moves:
            print("Player " + str(k) + " commands")
            print("---------------------------------------")
            for command in move:
                print(command)
            print("---------------------------------------")

            k += 1

        print("\n")



        i = 0
        j = 1

        player0 = self.players[i]
        player1 = self.players[j]

        player0move = moves[i]
        player1move = moves[j]

        resultant_moves = []
        player0resultantmove = set()
        player1resultantmove = set()

        while player0move:
            command = player0move.pop()

            if (command.type == 'move'):
                command_originating_position = command.tile.position

                command_direction = command.direction

                colliding_command = None

                adjacent_position = self.map.get_adjacent_position(command_originating_position, command_direction)

                if (adjacent_position is not None) & (adjacent_position in player1.action_commands_from_position_dictionary):

                    potential_colliding_commands = player1.action_commands_from_position_dictionary[adjacent_position]

                    for potential_colliding_command in potential_colliding_commands:
                        if (potential_colliding_command.direction is not None):
                            if (potential_colliding_command.direction[0] * command_direction[0] == -1) | (potential_colliding_command.direction[1] * command_direction[1] == -1):
                                colliding_command = potential_colliding_command
                                break

                if (colliding_command is None):
                    player0resultantmove.add(command)

                #fix the commands and things
                else:
                    player1move.remove(colliding_command)
                    print("Player 0's " + str(command.number_of_units) + " units" + " and Player 1's " + str(colliding_command.number_of_units) + " units" + " collide at the boundary of " + str(command_originating_position) + " and " + str(adjacent_position))
                    if (command.number_of_units > colliding_command.number_of_units):
                        resultant_command = ActionCommand(command_originating_position, 'move', (command.number_of_units - colliding_command.number_of_units), command_direction)
                        player0resultantmove.add(resultant_command)
                        self.map.get_tile(command_originating_position).decrement_units(0, colliding_command.number_of_units)
                        self.map.get_tile(adjacent_position).decrement_units(1, colliding_command.number_of_units)
                        print("Player 0 wins and keeps " + str(command.number_of_units - colliding_command.number_of_units) + " units")
                    elif (command.number_of_units < colliding_command.number_of_units):
                        resultant_command = ActionCommand(adjacent_position, 'move', (colliding_command.number_of_units - command.number_of_units), colliding_command.direction)
                        player1resultantmove.add(resultant_command)
                        self.map.get_tile(command_originating_position).decrement_units(0, command.number_of_units)
                        self.map.get_tile(adjacent_position).decrement_units(1, command.number_of_units)
                        print("Player 1 wins and keeps " + str(
                            colliding_command.number_of_units - command.number_of_units) + " units")
                    else:
                        self.map.get_tile(command_originating_position).decrement_units(0, command.number_of_units)
                        self.map.get_tile(adjacent_position).decrement_units(1, command.number_of_units)
                        print("Both players lose all " + str(command.number_of_units) + " units")

            else:
                player0resultantmove.add(command)

        player1resultantmove = player1move

        resultant_moves.append(player0resultantmove)
        resultant_moves.append(player1resultantmove)

        #clear dictionaries
        for player in self.players:
            player.action_commands_from_position_dictionary = {}

        # execute the resultant moves
        for resultant_move in resultant_moves:
            for command in resultant_move:
                current_pos = (command.tile.position[0], command.tile.position[1])
                tile = self.map.get_tile(current_pos)

                if (command.type == 'move'):
                    number_of_units_to_move = command.number_of_units


                    new_pos = ((command.tile.position[0] + command.direction[0]),
                               (command.tile.position[1] + command.direction[1]))

                    if (self.map.tile_in_range(new_pos)):
                        tile = self.map.get_tile(current_pos)
                        end_tile = self.map.get_tile(new_pos)

                        tile.decrement_units(i, number_of_units_to_move)
                        end_tile.increment_units(i, number_of_units_to_move)

                        if (tile.units[i] == 0):
                            self.players[i].positions_with_units.remove(current_pos)

                        if (new_pos not in self.players[i].positions_with_units):
                            self.players[i].positions_with_units.append(new_pos)

                elif (command.type == 'build'):
                    if (self.players[i].resource >= resource_cost) & (tile.building == None):
                        b = Building(i, tile, self.runningBuildingID)
                        tile.add_building(b)
                        self.players[i].add_building(b)
                        self.players[i].resource -= resource_cost
                        self.runningBuildingID += 1

                elif (command.type == 'mine'):
                    if (tile.resource > 0):
                        self.players[i].resource += 1
                        tile.decrement_resource(1)

            i += 1

        #combat check
        for a in range(0, self.map.width):
            for b in range(0, self.map.height):
                tile = self.map.get_tile((a, b))
                if tile.building is None:
                    smaller_number_of_units = min(tile.units[0], tile.units[1])

                    i = 0
                    if (smaller_number_of_units > 0):

                        for player in self.players:
                            tile.decrement_units(i, smaller_number_of_units)


                            if (tile.units[i] == 0):
                                self.players[i].positions_with_units.remove((a, b))

                            i += 1

                            print("Both players lose " + str(smaller_number_of_units) + " units at " + str((a, b)))
                            print("\n")

                else:
                    defending_player = tile.building.ownerID
                    if ((tile.units[1] > 0) & (defending_player == 0)) | ((tile.units[0] > 0) & (defending_player == 1)):
                        print("\n")
                        if defending_player == 0:

                            if tile.units[1] <= tile.building.defense:
                                tile.set_units(1, 0)

                                self.players[1].positions_with_units.remove((a, b))
                                print("Player B tried to attack Player A's building at " + str((a, b)) + " - all of Player B's attacking units were wiped out.")
                            elif (tile.units[1] > tile.building.defense) & (tile.units[1] < tile.building.defense + tile.units[0]):
                                defenders_loss = tile.building.defense + tile.units[0] - tile.units[1]

                                tile.set_units(1, 0)
                                self.players[1].positions_with_units.remove((a, b))

                                if (defenders_loss > 0):
                                    tile.decrement_units(0, defenders_loss)

                                print("Player B's forces were wiped out in an attack attempt at " + str((a, b)) + ", but inflicted casualties to Player A.")
                            else:
                                attackers_loss = tile.building.defense + tile.units[0]

                                tile.set_units(0, 0)
                                self.players[0].positions_with_units.remove((a, b))

                                if (attackers_loss > 0):
                                    tile.decrement_units(0, attackers_loss)

                                print("Player B's forces overwhelmed Player A's building at " + str((a, b)))


                        else:
                            if tile.units[0] <= tile.building.defense:
                                tile.set_units(0, 0)
                                self.players[0].positions_with_units.remove((a, b))
                                print("Player A tried to attack Player B's building at " + str(
                                    (a, b)) + " - all of Player A's attacking units were wiped out.")
                            elif (tile.units[0] > tile.building.defense) & (tile.units[0] < tile.building.defense + tile.units[1]):
                                defenders_loss = tile.building.defense + tile.units[1] - tile.units[0]

                                tile.set_units(0, 0)
                                self.players[0].positions_with_units.remove((a, b))

                                if (defenders_loss > 0):
                                    tile.decrement_units(1, defenders_loss)

                                    print("Player A's forces were wiped out in an attack attempt at " + str(
                                        (a, b)) + ", but inflicted casualties to Player B.")
                            else:
                                attackers_loss = tile.building.defense + tile.units[1]

                                tile.set_units(1, 0)
                                self.players[1].positions_with_units.remove((a, b))

                                if (attackers_loss > 0):
                                    tile.decrement_units(1, attackers_loss)

                                    print("Player B's forces overwhelmed Player A's building at " + str((a, b)))

        # building spawns
        p = 0
        if (self.turn % 3 == 0):
            for player in self.players:
                for building in player.buildings:
                    tile = self.map.get_tile(building.position)
                    tile.increment_units(p, 1)

                p += 1

        self.turn += 1

    def initialize_players(self, number_of_players, map, user_codes):  # initializes players
        i = 0
        players = []

        while i < number_of_players:
            user_code = user_codes[i]
            temp_player = Player(i, self.map, user_code)

            i += 1
            players.append(temp_player)

        return players

    #def execute_move(self, move, player):
        #move_as_list_of_action_commands = json_to_object_list(move, 'action_command')


    def initialize_units(self):
        for i in range(self.number_of_players):
            random_position = (randint(0, self.map.width - 1), randint(0, self.map.height - 1))

            tile = self.map.get_tile(random_position)
            tile.increment_units(i, 1)
            self.players[i].positions_with_units.append(random_position)

    def __str__(self):
        string = ""

        for player in self.players:
            string += str(player) + "\n"
            string += "---------------------------------------" + "\n"

        return string

g = GameState(Map(2), None, 2, [0, 1])
print(g)

while (True):
    g.play_a_turn()
    print(g)

    sleep(4)
