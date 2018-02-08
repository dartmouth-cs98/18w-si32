import sys
from Bot import LocalBot
from SimpleGame import SimpleGame
from waitForGame import pollUntilGameReady
from endpoints import post_game_result
from time import sleep


gameClasses = {
    'SimpleGame': SimpleGame
}

# called whenever there would be a game that this worker needs to run
def run_worker():
    bots = []
    try:
        while True:
            (botNumToPlayerIds, gameType) = pollUntilGameReady()

            # setupBots()
            bots = [
                LocalBot(name="bot1", playerNum=0),
                LocalBot(name="bot2", playerNum=1)
            ]

            game = gameClasses[gameType](bots)

            result = game.start()

            for bot in bots:
                bot.cleanup()

            post_game_result(botNumToPlayerIds, result)


            sleep(10)
    except KeyboardInterrupt: # we want to make it so pressing ctrl-c will cleanup the bots
        for bot in bots:
            bot.cleanup()


    # get results from game and post to server

run_worker()
