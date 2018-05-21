# based on Gabe's fortifier

from GameHelper import GameHelper

def do_turn(game):
    commands = []
    cells = game.get_my_cells()

    for cell in cells:
        pos = cell.position
        attacking = False

        '''
        if not (hive_pos is None):
            if game.get_unit_count_in_region_by_id(game.coordinate(pos.x - 2, pos.y - 2), game.coordinate(pos.x + 2, pos.y + 2)) > game.get_unit_count_in_region_by_id(game.coordinate(hive_pos.x - 2, hive_pos.y - 2), game.coordinate(hive_pos.x + 2, hive_pos.y + 2)):
                consolidation_moves = game.consolidate(game.coordinate(pos.x - 2, pos.y - 2), game.coordinate(pos.x + 2, pos.y + 2), game.myId)
                if len(consolidation_moves) > 0:
                    for consolidation_move in consolidation_moves:
                        commands.append(consolidation_move)
                    attacking = True
        '''

        hive_pos = game.closest_hive_pos(pos, "Enemy units plus adjacents and buildings")

        if not (hive_pos is None):
            distance = game.distance(pos, hive_pos, "Enemy units plus adjacents and buildings")
            if distance < 5:
                unit_count_at_cell = game.get_unit_count_by_position(pos)
                if unit_count_at_cell > game.get_enemy_unit_count_in_region(game.coordinate(hive_pos.x - 2, hive_pos.y - 2), game.coordinate(hive_pos.x + 2, hive_pos.y + 2)):
                    commands.append(game.smarter_move_towards(pos, hive_pos, "Enemy units plus adjacents and buildings", unit_count_at_cell))
                    attacking = True

        if not attacking:
            if cell.hive is None:
                GameHelper.build(cell.position)

    return commands

GameHelper.register_turn_handler(do_turn)