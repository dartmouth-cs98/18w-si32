# Bot.py
# Class definition for 'Bot'

import msgpack
import struct

# ------------------------------------------------------------------------------
# Class Definition

# Bot is our internal wrapper around an end-user implementation of a bot
# this class should handle prepping and running a bot in a separate
# process (dependent on driver) and provide a standard interface to
# send/receive info from that bot process

class Bot(object):
    def __init__(self):
        print("Bot should not be directly called")

    # just read and return the next line from the bot's stdout
    def read(self):
        return read(self.proc.stdout)

    # pass line through to the bot's stdin
    def write(self, data):
        write(self.proc.stdin, data)

# ------------------------------------------------------------------------------
# Helper Functions

# read from the calling file/pipe
def read(buf):
    # read how many bytes we're expecting
    (nBytes,) = struct.unpack("i", buf.read(4))

    # read and unpack that many bytes as the actual message
    return msgpack.unpackb(buf.read(nBytes), raw=False)

# write to the file/pipe
def write(buf, message):
    packed = msgpack.packb(message, use_bin_type=True)

    # tell the consumer how many bytes to expect
    buf.write(struct.pack("i", len(packed)))
    buf.flush()

    # then send the actual data
    buf.write(packed)
    buf.flush()
