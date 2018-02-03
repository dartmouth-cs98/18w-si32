from Game import Game
import sys
import json

# THIS IS THE GAME ENGINE THAT SITS ON OUR SERVERS AND IS NEVER EXPOSED TO USERS EXCEPT THROUGH STDIN/STDOUT
class SimpleGame(Game):
    def __init__(self, bots):
        self.bots = bots

        self.players = {}
        for i, bot in enumerate(self.bots):
            self.players[i] = self.SimpleGamePlayer(i, bot, (0, 0))
        super().__init__(bots)

    def start(self):
        print("Started!?")

        while True:
            self.game_loop()

    def game_loop(self):
        self.send_state()
        print('sent state')
        for b in self.bots:
            print(b.read(),)

    def send_state(self):
        for bot in self.bots:
            jsonString = {}
            for playerId, player in self.players.items():
                jsonString[str(playerId)] = player.toJSON()
            print(json.dumps(jsonString))
            bot.write(json.dumps(jsonString) + "\n")


    class SimpleGamePlayer():
        def __init__(self, id, bot, initial_position):
            self.id = id
            self.bot = bot
            self.position = initial_position
        def toJSON(self):
            jsonObj = {
                'position': self.position,
                str(self.id): self.id
            }

            return json.dumps(jsonObj)

        def get_parsed_move(self):
            move_str = self.bot.readline()
            command = None
            try:
                command = json.loads(move_str)
            except Exception as err:
                print(err)
                # TODO: if invalid command sent, should probably just kick this noob out of the game

            return command
