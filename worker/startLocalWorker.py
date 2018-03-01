import sys
from Bot import LocalBot
from SimpleGame import SimpleGame
from waitForGame import pollUntilGameReady
from endpoints import post_match_success
from time import sleep

from game.Si32_Game import Game_state


gameClasses = {
    'SimpleGame': Game_state
}

# called whenever there would be a game that this worker needs to run
def run_worker():
    bots = []
    try:
        while True:
            (botNumToPlayerIds, gameType, matchId) = pollUntilGameReady()

            # setupBots()
            bots = [
                LocalBot(name="bot1", playerNum=0),
                LocalBot(name="bot2", playerNum=1)
            ]

            game = gameClasses[gameType](bots)

            game.start()

            log = game.get_log()


            post_match_success(matchId, log)

            for bot in bots:
                bot.cleanup()

            sleep(10)
    except KeyboardInterrupt: # we want to make it so pressing ctrl-c will cleanup the bots
        for bot in bots:
            bot.cleanup()


    # get results from game and post to server

run_worker()
