from Game import Game
import sys
import json

# THIS IS THE GAME ENGINE THAT SITS ON OUR SERVERS AND IS NEVER EXPOSED TO USERS EXCEPT THROUGH STDIN/STDOUT
class SimpleGame(Game):
    def __init__(self, bots):
        self.bots = bots

        self.commandsMap = {
            'up': (0, 1),
            'down': (0, -1),
            'right': (1, 0),
            'left': (-1, 0)
        }

        self.players = {}
        for i, bot in enumerate(self.bots):
            self.players[i] = self.SimpleGamePlayer(i, bot, (0, 0))

        self.state_log = []
        super().__init__(bots)

    def start(self):
        i = 0
        while i < 100:
            self.game_loop()
            i += 1
        return self.state_log

    def game_loop(self):
        current_state = self.send_state()
        self.state_log.append(current_state)

        for b in self.bots:
            print("reading instruction")
            commandStr = b.read()
            commands = json.loads(commandStr)

            for command in commands:
                if ('player' in command) and ('direction' in command):
                    playerId = command['player']
                    direction = command['direction']
                    if (playerId in self.players) and (direction in self.commandsMap):
                        newX = self.players[playerId].position[0] + self.commandsMap[direction][0]
                        newY = self.players[playerId].position[1] + self.commandsMap[direction][1]
                        self.players[playerId].position = (newX, newY)


    def send_state(self):
        jsonString = None
        for bot in self.bots:
            jsonString = {}
            for playerId, player in self.players.items():
                jsonString[str(playerId)] = player.toJSON()
            print(json.dumps(jsonString))
            bot.write(json.dumps(jsonString) + "\n")
        return jsonString



    class SimpleGamePlayer():
        def __init__(self, id, bot, initial_position):
            self.id = id
            self.bot = bot
            self.position = initial_position
        def toJSON(self):
            jsonObj = {
                'position': self.position,
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
