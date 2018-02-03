import sys
import time
from SimpleGameHelper import SimpleGameHelper

print("I'm bot2.py asjs")
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
    commands.append(game.create_move_command('up'))
    game.send_commands(commands)

    i += 1
    # sys.stdout.flush()
