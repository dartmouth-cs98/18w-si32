import game
from Bot import DockerBot

# called whenever there would be a game that this worker needs to run
def execGame():
    # setupBots()
    bot1 = DockerBot("bot1", 1)
    bot2 = DockerBot("bot2", 2)

    try:
        game.start([bot1, bot2])
    except Exception as err:
        print "GAME ERR"
        print err

    bot1.cleanup()
    bot2.cleanup()

    # get results from game and post to server

execGame()
