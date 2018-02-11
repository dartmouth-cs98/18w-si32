from SimpleGame import SimpleGame
from Bot import DockerBot
from waitForGame import pollUntilGameReady
from endpoints import post_game_result

gameClasses = {
    'SimpleGame': SimpleGame
}

def run_worker():
    while True:
        # get the next game
        (botSpecs, gameType, matchId) = pollUntilGameReady()

        bots = []

        # create a bot object for each bot that's in this match
        for b in botSpecs:
            bots.append(DockerBot(b['id'], b['index'], b['url']))

        try:
            game = gameClasses[gameType](bots)
            result = game.start()
            print("Got results.")
        except Exception as err:
            print("GAME ERR")
            print(err)

        for b in bots:
            b.cleanup()

        print("Done cleaning up.")

        # send the results back to the server
        post_game_result(botNumToPlayerIds, result)

run_worker()
