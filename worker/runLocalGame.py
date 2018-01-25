import game
import sys
from Bot import LocalBot

# called whenever there would be a game that this worker needs to run
def execGame():
    # setupBots()
    bots = []

    for i, arg in enumerate(sys.argv[1:]):
        bots.append(LocalBot(arg, i))

    try:
        game.start(bots)
    except Exception as err:
        print "GAME ERR"
        print err

    # get results from game and post to server

execGame()
# execGame("asdf")
