import sys
from Bot import LocalBot
from SimpleGame import SimpleGame
from waitForGame import pollUntilGameReady


gameClasses = {
    'SimpleGame': SimpleGame
}

# called whenever there would be a game that this worker needs to run
def execGame():

    gameType = sys.argv[1]
    if gameType not in gameClasses:
        print(gameType + " is not a known game.")
        return

    # setupBots()
    bots = []

    for i, arg in enumerate(sys.argv[2:]):
        bots.append(LocalBot(arg, i))

    game = gameClasses[gameType](bots)

    game.start()

    for bot in bots:
        bot.cleanup()


    # get results from game and post to server

execGame()
