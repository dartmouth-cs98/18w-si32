import traceback
# from SimpleGame import SimpleGame
from game.Si32_Game import Game_state

from Bot import DockerBot
from waitForGame import pollUntilGameReady
from endpoints import post_match_result

gameClasses = {
    'SimpleGame': SimpleGame
}

def run_worker():
    while True:
        log = False
        result = {}
        # get the next game
        (botSpecs, gameType, matchId) = pollUntilGameReady()

        bots = []

        # create a bot object for each bot that's in this match
        for b in botSpecs:
            bots.append(DockerBot(b['id'], b['index'], b['url']))

        try:
            game = gameClasses[gameType](bots)

            # we'll need more than just a log at some point
            # should probably return a tuple of log and results, which would contain
            # flags/info on game termination (timeout, completion, bot error, etc.)
            log = game.start()
            result = {
                'completed': True
            }

            print("Got results.")
        except Exception as err:
            print("GAME ERR")
            print(err)
            # TODO attribute fault to the bot that caused an error and set them as loser
            # or determine that the crash was our fault
            traceback.print_exc()
            result = {
                'completed': False
            }
            log = False

        try:
            for b in bots:
                b.cleanup()
        except Exception as err:
            print("Issue cleaning up.")
            print(err)

        print("Done cleaning up.")

        # send the results back to the server
        post_match_result(matchId, result, log)

run_worker()
