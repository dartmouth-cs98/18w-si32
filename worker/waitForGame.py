import endpoints
import time

# called whenever there would be a game that this worker needs to run
def pollUntilGameReady():

    r = endpoints.is_game_ready()
    response_json = r.json()

    while not new_game_available(response_json):
        time.sleep(5)
        r = endpoints.is_game_ready()
        response_json = r.json()

    print(response_json)

    return response_json['bots'], response_json['gameType'], response_json['id']

def new_game_available(response_json):
    if ('newGame' in response_json) and (response_json['newGame']):
        return True

    return False
