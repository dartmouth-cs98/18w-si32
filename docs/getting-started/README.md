# Your First Bot

A Monad bot is simply a python program that plays the game by generating commands.
On a high level, a central server handles the game logic and state, and when it is time
for the bots to make their moves, it asks for them.

Your job is to write code that implements your bot's logic and
decides what moves are sent back.
Will you attack, build, or mine for resources? What will your opponent do, and how will your
strategy take this into account?

This guide contains everything you need to know to develop your first
Monad bot. Let's get started.

## Requirements

The only requirement for implementing your first Monad bot is that you have Python (version 3+) installed on your machine.

If you do not have Python installed, we recommend using [Homebrew](https://brew.sh) to remedy this. Once you have Homebrew up and running, install Python 3 with the command:

```
brew install python
```

Verify that the installation was successful by running `python --version` in your terminal. You should see version information printed to the console. If not,  [troubleshoot!](http://lmgtfy.com/?q=homebrew+python+issue)

## Development Setup

We provide a local development kit that comes with everything you need to get
started developing bots for Monad. Download the development kit from the [downloads](../downloads/README.md) page.

Once you have the development kit downloaded, your directory structure will look like

```
devkit/
├── GameHelper.py
├── README.md
├── bot.py
├── game/
├── monad.sh
├── requirements.txt
└── scripts/
```

The only setup remaining is to setup a python virtual environment in your
development directory. This step is not required, but
we highly recommend utilizing the Monad development kit in conjunction
with Python virtual environments to simplify the installation and maintenance
of dependencies.
Instructions for completing this step are included in the
`README` provided with the development kit, but are reproduced here for convenience.

Ensure that you have `pip` installed; if you installed Python using Homebrew,
`pip` should have been installed as well. Verify this with

```
$ pip --version
```

You should be met with version information output in the console.

Once `pip` is installed, install the `virtualenv` package globally with

```
$ pip install virtualenv
```

As before, verify that your installation succeeded with

```
$ virtualenv --version
```

Now initialize a virtual environment in your development directory:

```
$ cd devkit/
$ virtualenv env
```

The above command creates a virtual environment called `env`. You can name your
environment whatever you wish, but the remainder of these instructions assume that
the environment is called `env`.

Now activate your virtual environment with

```
$ source env/bin/activate
```

Finally, install the packages required for local development with

```
$ pip install -r requirements.txt
```

And you're ready to roll.

### Botfile Tour

All of the code that you write to implement your Monad bot will be implemented in
the file `bot.py`. Here we take a closer look at the basic setup for a Monad bot,
starting from the scaffolding provided by the development kit.

When you download the development kit, the file `bot.py` will be pre-populated with the following code

```
from GameHelper import GameHelper

def do_turn(game):

    # YOUR BOT LOGIC HERE.

GameHelper.register_turn_handler(do_turn)
```

The communication between the game server and the bots is handled for you by a library we provide,
`GameHelper`. This library is automatically included for you in the development kit.
The first thing we do in our bot implementation is import this helper.


From there, `GameHelper.register_turn_handler(do_turn)`
is the only thing we have to do in order
to register our bot with the game server and listen for when the game server requests
moves for a new turn. We pass a method to this; every time the game server
requests our moves for the next turn, `GameHelper` will call this method. It accepts the most recent
game state, and must return a list of commands. These commands will be sent to the game server and
executed.

And thats all there is to it.
This `bot.py` program could now be uploaded and play a game.
On every turn, it would generate an empty queue of commands, and therefore would never do anything,
but it would be a valid bot nonetheless!

But you don't want to settle for that, do you?
Read on for tips on implementing your first strategy!

### Bot parameters

Monad allows you to replace constant values in your botfile with parameters that you can configure
via the Monad UI. Frequently, the only changes to your bot code between versions will be changes to
parameters like a threshold for a probability, or a value you check against to trigger an attack or
some other condition. By allowing you to modify these values from the Monad UI, you can quickly test
out new parameters without modifying and re-uploading your code. Here's how to use them:

1. Replace your value with a call to `game.param("PARAM_NAME")`
2. Upload your bot code with this call (for the last time!)
3. On upload, you'll be prompted to provide a value for that parameter

At any point, from the bot's page, you can update the parameters without re-uploading the code.

As a second argument to `register_turn_handler`, you can provide a dictionary of default
parameters for your bot to use. This is handy for running matches locally.

`GameHelper.register_turn_handler(do_turn, default_params={'MYPARAM': 1.42, ...})`

## Implementing a Strategy

Now its time to think about what we want our bot to do. The `GameHelper` library comes with
helper commands for getting information about the state and creating a command. Our job is
to use these to create a bot program that plays well. Lets look at a simple strategy as a way to
get thinking about the game, and to introduce some of the methods available to us.

### Streamer

This bot will simply send its units towards an enemy hive every turn, no matter where they are.
It loops over all the cells where it has units, and issues commands to move all of them one square
closer to the first enemy hive returned by GameHelper.

```
def do_turn(game):
    occupied_cells = game.get_my_cells()

    enemy_hives = game.get_enemy_hive_sites()

    for cell in occupied_cells:
        game.move_towards(cell.position, enemy_hives[0].position)
```

Let's walk through the new things we have seen here. The object that our `do_turn()` method is passed,
called `game`, is an instance of GameHelper and we can call methods on it.

We first get some information about the state of the game. The first we see
is `game.get_my_cells()`. This method returns an array of the cells where we have one or more units
located.
We then call `game.get_enemy_hive_sites()` to get an array of the enemy hives on the map.
There are many more things we can know about the state
(see the [API Reference](../api-reference/README.md)),
but for this simple strategy this is all we will ask about the game each turn.

We now issue commands based on the state of the game. We loop over all the cells where we have units,
and use the helper method `move_towards(from_position, to_position)` to create a command
that moves all of our units at `cell.position` (our `from_position`) towards `enemy_hives[0].position`
(our `to_position`). We can only move one cell at a time, so this method generates a move
one step in the right direction. Command generation methods, like `move_towards()`, are smart,
and will only generate valid commands, Thus, if you specify parameters that constitute an
invalid movement, the invocation will effectively be ignored.

And that's it. We issue our commands for this turn, and the game server handles them along with the
moves of the other player(s) to update the game state. Then it sends the bots the new state
and our bots do it all over again (though a real bot would likely do different things based on
what the new state looks like).

## Replays and Debugging

So you've written a bot, but how can you verify that it is performing as expected before
you upload it?

One of the most useful debugging features available is replay visualization.
Every game that's played on Monad produces a game log (a `.json` file), which tracks the state of the game
after every turn, as well as the moves that each player made.
This is true when you run a match locally (see the documentation in the development kit
for instructions on how to do this).

There are then multiple options available to visualize the game recorded in this log file.

* You may visit our [replay page](http://monad.surge.sh/replay) and upload the file there, and the game will
be visualized for you on in the browser.
* You may download our offline visualizer from the [downloads page](../downloads/README.md) to
visualize games from a desktop application that requires no internet connection.

These tools allow one to see the decisions that bots make throughout the course of a
game, identify potential weaknesses, and gain insight into potentially stronger strategies.

## Conclusion

We have now seen how Monad bots are structured and how they interact with both the
game engine and the `GameHelper` library. This is boilerplate one can always just copy when starting a new bot.

We have also seen how one might begin to implement a strategy in the `do_turn()` method,
taking in a state and generating commands based on it.

Finally, we have seen how to run local matches and improve our bots based on what visualization
of these match replays reveal.

<div style="padding-bottom:50px"></div>
