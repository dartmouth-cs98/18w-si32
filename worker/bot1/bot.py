import sys
import time
from SimpleGameHelper import SimpleGameHelper

print("I'm bot34975237497.py")
sys.stdout.flush()

i = 0

game = SimpleGameHelper()


while True:
    # l = sys.stdin.readline()
    # print(str(i) + ": bot 2 received: " + l,)


    state = game.get_state()

    # print(state)
    # sys.stdout.flush()


    commands = []
    commands.append(game.create_move_command([0,0],'down'))
    game.send_commands(commands)

    i += 1
    # sys.stdout.flush()
