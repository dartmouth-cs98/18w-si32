import endpoints
import time

# called whenever there would be a game that this worker needs to run
def pollUntilGameReady():

    r = endpoints.is_game_ready()

    while not new_game_available(r):
        time.sleep(2)
        r = endpoints.is_game_ready()

    print(r)

    return r['bots'], r['gameType'], r['id']

def new_game_available(response_json):
    if ('newGame' in response_json) and (response_json['newGame']):
        return True

    return False
