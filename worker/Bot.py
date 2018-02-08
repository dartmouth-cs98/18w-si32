from subprocess import Popen, PIPE, call
import os
import sys
import docker
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
    def __init__(self, name, playerNum):
        self.playerNum = playerNum
        self.name = name

    # eventually will download/unzip etc. bot from server
    # for now, mock "prep" stage by copying from local dir into docker vol
    def prep(self):
        sys.stdout.flush()
        call("cp -r %s/* /bot%d" % (self.name, self.playerNum), shell=True)

    def run(self):
        command = ["docker", "run", "-i",
                      "-v", "bot%d:/bot" % self.playerNum,
                      "--name", "%s" % self.name,
                      "si32-child-bot"]
        # run docker and start the bot in its own isolated environment
        self.proc = Popen(command, stdout=PIPE, stdin=PIPE)

    # remove docker container
    def cleanup(self):
        try:
            self.proc.kill()
        except Exception: # proc already exited
            pass

        # Do we prefer direct calls or using the docker lib?
        # call("docker stop %s > /dev/null" % self.name, shell=True)
        client.containers.get(self.name).stop()
        call("docker rm %s > /dev/null" % self.name, shell=True)

        # remove bot code from long-running volume
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
