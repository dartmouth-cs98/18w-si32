import sys
from Bot import LocalBot
from game.GameState import GameState
from waitForGame import pollUntilGameReady

# runs a single game with bots already existing on your computer and stores results in game.json

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

    with open("game.json", "w") as f:
        f.write(game.get_raw_log())
        f.close()

execGame()
