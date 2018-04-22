# runMatch.py
# Runs a single match on your local machine, outputs results to "game.json"

import sys
from game.Bot import LocalBot
from game.GameState import GameState

REPLAY_FN = "game.json"

def start():
    bots = []

    for i, arg in enumerate(sys.argv[1:]):
        bots.append(LocalBot(arg, i))

    # initialize the match
    game = GameState(bots)

    # run the match
    game.start()

    # clean up after ourselves
    for bot in bots:
        bot.cleanup()

    # write the replay file
    with open(REPLAY_FN, "w") as f:
        f.write(game.get_raw_log())
        f.close()

if __name__ == "__main__":
    start()
