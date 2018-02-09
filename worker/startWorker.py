from SimpleGame import SimpleGame
from Bot import DockerBot
from waitForGame import pollUntilGameReady
from endpoints import post_game_result
from time import sleep

gameClasses = {
    'SimpleGame': SimpleGame
}

# called whenever there would be a game that this worker needs to run
def run_worker():

    while True:
        (botNumToPlayerIds, gameType) = pollUntilGameReady()

        # setupBots()
        bot1 = DockerBot("bot1", 1)
        bot2 = DockerBot("bot2", 2)

        result = None
        try:
            game = gameClasses[gameType]([bot1, bot2])
            result = game.start()
            bot1.cleanup()
            bot2.cleanup()
        except Exception as err:
            print("GAME ERR")
            print(err)
            bot1.cleanup()
            bot2.cleanup()

        post_game_result(botNumToPlayerIds, result)

        sleep(2)

    # get results from game and post to server

run_worker()
