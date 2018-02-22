import sys
import time
from SimpleGameHelper import SimpleGameHelper

print("I'm bot34975237497.py")
sys.stdout.flush()

game = SimpleGameHelper()


while True:
    # l = sys.stdin.readline()
    # print(str(i) + ": bot 2 received: " + l,)

    commands = []

    # load state for next turn
    game.load_state()

    units = game.get_my_units()

    for s in units:
        commands.append(game.create_move_command(s['position'],'down', 1))

    # done for this turn, send all my commands
    game.send_commands(commands)
