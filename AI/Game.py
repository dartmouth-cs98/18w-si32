from Map import width, height
from Building import Building, resource_cost
from Player import Player
from Map import Map
from random import randint
from Unit import Unit

class Game:
    def __init__(self):

        self.map = Map()

        unit_starting_position_A = (randint(0, width - 1), randint(0, height - 1))

        starting_unit_A = Unit(unit_starting_position_A, 0)
        self.playerA = Player(0, starting_unit_A)
        self.map.tiles[(unit_starting_position_A[0]) + width * (unit_starting_position_A[1])].units_A.append(starting_unit_A)

        unit_starting_position_B = (randint(0, width - 1), randint(0, height - 1))

        starting_unit_B = Unit(unit_starting_position_B, 1)
        self.playerB = Player(1, starting_unit_B)
        self.map.tiles[(unit_starting_position_B[0]) + width * (unit_starting_position_B[1])].units_B.append(starting_unit_B)

        self.players = [self.playerA, self.playerB]

        self.runningUnitId = 2
        self.runningBuildingId = 0
        self.turn = 0

    def execute_turn(self, playerId):

        if (playerId == 0):
            move = self.playerA.make_move()
        else:
            move = self.playerB.make_move()


        player = self.players[playerId]


        # loop through units and execute individual commands
        n = 0
        while n < len(move):
            unit_command = move[n]
            current_x = player.units[n].position[0]
            current_y = player.units[n].position[1]

            #print("CHECK")
            #print(self.map.tiles[(current_x) + width * (current_y)].units)

            unit = player.units[n]

            unitId = unit.unitId
            #print(self.map.tiles[(current_x) + width * (current_y)].units)

            #execute unit command

            command_as_string = ""

            if (unit_command == 1):
                command_as_string = " moves north"
            elif (unit_command == 2):
                command_as_string = " moves east"
            elif (unit_command == 3):
                command_as_string = " moves south"
            elif (unit_command == 4):
                command_as_string = " moves west"
            elif (unit_command == 5):
                command_as_string = " builds a building to the north of Unit " + str(unitId)
            elif (unit_command == 6):
                command_as_string = " builds a building to the east of Unit " + str(unitId)
            elif (unit_command == 7):
                command_as_string = " builds a building to the south of Unit " + str(unitId)
            elif (unit_command == 8):
                command_as_string = " builds a building to the west of Unit " + str(unitId)
            elif (unit_command == 9):
                command_as_string = " attempts to mine resource"
            else:
                command_as_string = " does nothing"

            if (playerId == 0):
                print("Player A commands that Unit " + str(unitId) + command_as_string)
            else:
                print("Player B commands that Unit " + str(unitId) + command_as_string)

            if (unit_command == 1):
                self.move_unit(current_x, current_y, current_x, current_y + 1, player, n)
            elif (unit_command == 2):
                self.move_unit(current_x, current_y, current_x + 1, current_y, player, n)
            elif (unit_command == 3):
                self.move_unit(current_x, current_y, current_x, current_y - 1, player, n)
            elif (unit_command == 4):
                self.move_unit(current_x, current_y, current_x - 1, current_y, player, n)
            elif (unit_command == 5):
                self.build(current_x, current_y + 1, player)
            elif (unit_command == 6):
                self.build(current_x + 1, current_y, player)

            elif (unit_command == 7):
                self.build(current_x, current_y - 1, player)
            elif (unit_command == 8):
                self.build(current_x - 1, current_y, player)
            elif (unit_command == 9):
                if (self.map.tiles[(current_x) + width * (current_y)].resource > 0):
                    self.map.tiles[(current_x) + width * (current_y)].decrement_resource()
                    player.resource += 1
                    print("Mining successful")
                else:
                    print("Mining failed - no resource on the tile")


            n = n + 1


        #combat check
        for tile in self.map.tiles:
            if tile.building is None:
                while (len(tile.units_A) > 0) & (len(tile.units_B) > 0):

                    killed_unit_A = tile.units_A.pop()
                    killed_unit_B = tile.units_B.pop()

                    self.playerA.units.remove(killed_unit_A)
                    self.playerB.units.remove(killed_unit_B)

                    print("Player A and Player B each lose a unit in combat.")
            else:
                defending_player = tile.building.owner
                if ((len(tile.units_A) > 0) & (defending_player.playerId == 1)) | ((len(tile.units_B) > 0) & (defending_player.playerId == 0)):

                    if defending_player.playerId == 0:

                        if len(tile.units_B) <= tile.building.defense:
                            while (len(tile.units_B) > 0):
                                killed_unit_B = tile.units_B.pop()

                                self.playerB.units.remove(killed_unit_B)
                            print("Player B tried to attack Player A's fortified building - all of Player B's attacking units were wiped out.")
                        elif (len(tile.units_B) > tile.building.defense) & (len(tile.units_B) < tile.building.defense + len(tile.units_A)):
                            defenders_loss = tile.building.defense + len(tile.units_A) - len(tile.units_B)

                            while (len(tile.units_B) > 0):
                                killed_unit_B = tile.units_B.pop()

                                self.playerB.units.remove(killed_unit_B)

                            if (defenders_loss > 0):
                                for i in range(0, defenders_loss):
                                    killed_unit_A = tile.units_A.pop()
                                    self.playerA.units.remove(killed_unit_A)

                            print("Player B's forces were wiped out in an attack attempt, but inflicted casualties to Player A.")
                        else:
                            attackers_loss = tile.building.defense + len(tile.units_A)

                            while (len(tile.units_A) > 0):
                                killed_unit_A = tile.units_A.pop()

                                self.playerA.units.remove(killed_unit_A)

                            for i in range(0, attackers_loss):
                                killed_unit_B = tile.units_B.pop()
                                self.playerB.units.remove(killed_unit_B)

                            print("Player B's forces overwhelmed Player A's fortification.")



                    else:
                        if len(tile.units_A) <= tile.building.defense:
                            while (len(tile.units_A) > 0):
                                killed_unit_A = tile.units_A.pop()

                                self.playerA.units.remove(killed_unit_A)
                            print("Player A tried to attack Player B's fortified building - all of Player A's attacking units were wiped out.")
                        elif (len(tile.units_A) > tile.building.defense) & (
                            len(tile.units_A) < tile.building.defense + len(tile.units_B)):
                            defenders_loss = tile.building.defense + len(tile.units_B) - len(tile.units_A)

                            while (len(tile.units_A) > 0):
                                killed_unit_A = tile.units_A.pop()

                                self.playerA.units.remove(killed_unit_A)

                            if (defenders_loss > 0):
                                for i in range(0, defenders_loss):
                                    killed_unit_B = tile.units_B.pop()
                                    self.playerB.units.remove(killed_unit_B)

                            print(
                                "Player A's forces were wiped out in an attack attempt, but inflicted casualties to Player B.")
                        else:
                            attackers_loss = tile.building.defense + len(tile.units_B)

                            while (len(tile.units_B) > 0):
                                killed_unit_B = tile.units_B.pop()

                                self.playerB.units.remove(killed_unit_B)

                            for i in range(0, attackers_loss):
                                killed_unit_A = tile.units_A.pop()
                                self.playerA.units.remove(killed_unit_A)

                            print("Player A's forces overwhelmed Player B's fortification at a heavy cost")






        #building spawns
        if (self.turn % 5 == 0):
            for player in self.players:
                for building in player.buildings:
                    if (len(player.units) < 32):
                        new_unit = Unit(building.position, self.runningUnitId)
                        self.runningUnitId += 1

                        player.units.append(new_unit)

                        if (player.playerId == 0):
                            self.map.tiles[(building.position[0]) + width * (building.position[1])].units_A.append(new_unit)

                        else:
                            self.map.tiles[(building.position[0]) + width * (building.position[1])].units_B.append(new_unit)

        self.turn += 1

    def move_unit(self, current_x, current_y, new_x, new_y, player, unitId):
        if self.map.is_in_range((new_x, new_y)):
            if (player.playerId == 0):
                self.map.tiles[(current_x) + width * (current_y)].units_A.remove(player.units[unitId])

                player.units[unitId].position = (new_x, new_y)

                self.map.tiles[(new_x) + width * (new_y)].units_A.append(player.units[unitId])
            else:
                self.map.tiles[(current_x) + width * (current_y)].units_B.remove(player.units[unitId])

                player.units[unitId].position = (new_x, new_y)

                self.map.tiles[(new_x) + width * (new_y)].units_B.append(player.units[unitId])
            print("Movement successful")
        else:
            print("Movement failed")

    def build(self, build_x, build_y, player):
        if (len(player.buildings) < 8):
            if (player.resource >= resource_cost):
                if self.map.is_in_range((build_x, build_y)):
                    if (len(self.map.tiles[(build_x) + width * (build_y)].units_A) == 0) & (len(self.map.tiles[(build_x) + width * (build_y)].units_B) == 0):
                        if self.map.tiles[(build_x) + width * (build_y)].building is None:
                            new_building = Building((build_x, build_y), self.runningBuildingId, player)
                            self.runningBuildingId += 1
                            player.add_building(new_building)
                            self.map.tiles[(build_x) + width * (build_y)].building = new_building
                            player.resource -= resource_cost
                            print("Building successful")
                        else:
                            print("Building failed")
                    else:
                        print("Building failed")
                else:
                    print("Building failed")
            else:
                print("Building failed")
        else:
            print("Building failed")
    def __str__(self):
        return str(self.playerA) + "\n" + str(self.playerB) + "\n"