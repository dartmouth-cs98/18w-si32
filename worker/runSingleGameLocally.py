import sys
from Bot import LocalBot
from game.GameState import GameState
from waitForGame import pollUntilGameReady


gameClasses = {
    'SimpleGame': GameState
}

# called whenever there would be a game that this worker needs to run
def execGame():

    gameType = "SimpleGame"
    # gameType = sys.argv[1]
    # if gameType not in gameClasses:
    #     print(gameType + " is not a known game.")
    #     return

    # setupBots()
    bots = []

    for i, arg in enumerate(sys.argv[1:]):
        bots.append(LocalBot(arg, i))

    game = gameClasses[gameType](bots)

    game.start()

    # print("Cleaning up...")
    for bot in bots:
        bot.cleanup()

    # game.write_log("gameLog")
    print(game.get_raw_log())

execGame()
