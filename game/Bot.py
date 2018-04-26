import os
import sys
from subprocess import Popen, PIPE, call


# Bot is our internal wrapper around an end-user implementation of a bot
# this class should handle prepping and running a bot in a separate
# process (dependent on driver) and provide a standard interface to
# send/receive info from that bot process

class Bot(object):
    def __init__(self):
        print("Bot should not be directly called")

    # just read and return the next line from the bot's stdout
    def read(self):
        return self.proc.stdout.readline()

    # pass line through to the bot's stdin
    def write(self, line):
        self.proc.stdin.write(line.encode())
        self.proc.stdin.flush()
        return

    # pass binary data through to the bot's stdin
    def write_binary(self, data):
        self.proc.stdin.write(data)
        self.proc.stdin.flush()
        return

# The Bot wrapper for local bot development.
#
# Constructor Arguments
# fp (string)      - file path to the botfile.
# playerNum (int)  - player number assigned to this player in match (ID).
class LocalBot(Bot):
    def __init__(self, fp, playerNum):
        self.name = fp
        self.playerNum = playerNum

    def prep(self):
        return

    def run(self):
        command = ["python", "./%s" % self.name]
        self.proc = Popen(command, stdout=PIPE, stdin=PIPE)

    def cleanup(self):
        try:
            self.proc.kill()
        except Exception as e: # proc already exited
            print(e)
            pass