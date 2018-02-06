from SimpleGame import SimpleGame
from Bot import DockerBot
from waitForGame import pollUntilGameReady

gameClasses = {
    'SimpleGame': SimpleGame
}

# called whenever there would be a game that this worker needs to run
def execGame():

    (botNumToPlayerIds, gameType) = pollUntilGameReady()

    # setupBots()
    bot1 = DockerBot("bot1", 1)
    bot2 = DockerBot("bot2", 2)

    try:
        game = gameClasses[gameType]([bot1, bot2])
        game.start()
    except Exception as err:
        print("GAME ERR")
        print(err)

    bot1.cleanup()
    bot2.cleanup()

    # get results from game and post to server

execGame()
