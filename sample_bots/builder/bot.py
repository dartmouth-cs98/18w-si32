import sys
import time
from GameHelper import GameHelper

game = GameHelper()


targetPos = None
firstIter = True

# build....
def stage_1():
    global targetPos
    buildings = game.my_buildings()
    e_buildings = game.get_enemy_buildings()
    commands = []
    for u in units:
        game.log(targetPos)
        m = game.move_towards(u.position, targetPos, game.my_units_at_pos(u.position))
        if m:
            commands.append(m)
        else:
            commands.append(game.mine(u.position, game.my_units_at_pos(u.position)))

    if (game.building_potential() > 0):
        m = game.build(targetPos, game.my_units_at_pos(targetPos))
        if m:
            commands.append(m)
            targetPos = game.position_towards(targetPos, e_buildings[0].position)

    if game.get_tile(targetPos[0], targetPos[1]).resource == 0:
        targetPos = game.position_towards(targetPos, e_buildings[0].position)

        if game.get_tile(targetPos[0], targetPos[1]).building:
            targetPos = game.position_towards(targetPos, buildings[0].position)


    return commands

# ATTACK!!
def stage_2():
    global targetPos

    buildings = game.my_buildings()
    e_buildings = game.get_enemy_buildings()
    targetPos = buildings[0].position
    commands = []

    for u in units:
        if game.my_units_at_pos(u.position) > 200:
            m = game.move_towards(u.position, e_buildings[0].position, game.my_units_at_pos(u.position))
            if m:
                commands.append(m)
        else:
            m = game.move_towards(u.position, targetPos, game.my_units_at_pos(u.position))
            if m:
                commands.append(m)


    return commands

while True:
    commands = []

    # load state for next turn
    game.load_state()

    units = game.get_my_cells()
    nUnits = game.get_total_units()

    buildings = game.my_buildings()
    e_buildings = game.get_enemy_buildings()

    if firstIter:
        targetPos = game.position_towards(buildings[0].position, e_buildings[0].position)
        firstIter = False

        game.log(targetPos)

    if nUnits < 50:
        commands = stage_1()
    else:
        commands = stage_2()

    # done for this turn, send all my commands
    game.send_commands(commands)
