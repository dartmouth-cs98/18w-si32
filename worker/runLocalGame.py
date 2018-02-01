import game
import sys
from Bot import LocalBot

# called whenever there would be a game that this worker needs to run
def execGame():
    # setupBots()
    bots = []

    for i, arg in enumerate(sys.argv[1:]):
        bots.append(LocalBot(arg, i))

    game.start(bots)

    # get results from game and post to server

execGame()
# execGame("asdf")
