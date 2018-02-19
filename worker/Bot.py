from subprocess import Popen, PIPE, call
import os
import sys
import docker
docker_client = docker.from_env()
from endpoints import get_bot_file
client = docker.from_env()


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


# class for being run in containerized "live" environment
class DockerBot(Bot):
    def __init__(self, name, playerNum, codeUrl):
        self.playerNum = playerNum
        self.name = name
        self.codeUrl = codeUrl

    # eventually will download/unzip etc. bot from server
    # for now, mock "prep" stage by copying from local dir into docker vol
    def prep(self):
        sys.stdout.flush()

        # download the user-provided bot code
        get_bot_file(self.codeUrl, self.playerNum)

        # copy everything from bot_common (provided helpers, etc.) into bot dir
        call("cp bot_common/* /bot%d" % self.playerNum, shell=True)

    def run(self):
        command = ["docker", "run", "-i",
                      "-v", "bot%d:/bot" % self.playerNum,
                      "--name", "%s" % self.name,
                      "si32-child-bot"]

        # run docker and start the bot in its own isolated environment
        self.proc = Popen(command, stdout=PIPE, stdin=PIPE)

    # remove docker container
    def cleanup(self):
        container = client.containers.get(self.name)
        container.remove(force=True)
        print("Killed and removed bot %d." % self.playerNum)

        # remove bot code from volume that is persistent
        call("rm -r /bot%d/*" % self.playerNum, shell=True)


# for local running of players' own bots in testing
class LocalBot(Bot):
    def __init__(self, name, playerNum):
        self.name = name
        self.playerNum = playerNum

    def prep(self):
        return

    def run(self):
        command = ["python", "./%s/bot.py" % self.name]
        self.proc = Popen(command, stdout=PIPE, stdin=PIPE)

    def cleanup(self):
        try:
            self.proc.kill()
        except Exception as e: # proc already exited
            print(e)
            pass
