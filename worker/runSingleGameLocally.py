import sys
from Bot import LocalBot
from game.Si32_Game import Game_state
from waitForGame import pollUntilGameReady


gameClasses = {
    'SimpleGame': Game_state
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

    print("Cleaning up...")
    for bot in bots:
        bot.cleanup()
        
    # game.write_log("gameLog")
    # print(game.get_log())

execGame()
