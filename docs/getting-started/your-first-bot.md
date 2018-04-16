# Your First Bot

A Monad bot is simply a python program that plays the game by generating commands.
On a high level, a central server will handle the game logic and state, and when it is time
for the bots to make their moves, it will ask them. You write the code that then kicks in and
decides what moves are sent back. Will you attack, build, or mine for resources? What will your opponent do?
The AI with the best strategy will be the last one standing! If you have not read the [game overview](#) yet,
please do so now to give you some context for the overview of commands that follows.

## Requirements

The only requirement for implementing your first Monad bot is that you have Python (version 3+) installed on your machine. 

If you do not have Python installed, we recommend using [Homebrew](#) to remedy this. Once you have Homebrew up and running, install Python 3 with the command: 

```
brew install python
```

Verify that the installation was successful by running `python --version` in your terminal. You should see version information printed to the console. If not, troubleshoot! 

## Set up your bot.py file

Lets begin by creating a new file called `bot.py`. You can create this anywhere on your local system
you see fit.

`touch bot.py`

The communication between the game server and the bots is handled for you by a library we provide,
called GameHelper. [Download this file here](https://google.com) and place the contents
in the same directory as your new file `bot.py`.

Now we are ready to write our bot!

Every bot will have the same structure. Copy and paste this code into your `bot.py` file:

```
from GameHelper import GameHelper

def do_turn(game):
  commands = []

  # Implement your AI! Add commands to the commands list based on the state in game


  # done for this turn, return commands that should be sent to server
  return commands

# tell GameHelper to use our method `do_turn` to handle every turn
GameHelper.register_turn_handler(do_turn)

```

Explanation:

We begin by importing GameHelper at the top of the file. `GameHelper.register_turn_handler(do_turn)`
is the only thing we have to do in order
to register our bot with the game server and listen for when the game server requests
moves for a new turn. We pass a method to this; every time the game server
requests our moves for the next turn, GameHelper will call this method. It accepts the most recent
game state, and must return a list of commands. These commands will be sent to the game server and executed.

And thats all there is to get set up! This bot.py program could now be uploaded and play a game. It would return
an empty commands list every turn and would never do anything, but it would be a valid bot nonetheless!

## Implementing a Strategy

Now its time to think about what we want our bot to do. The GameHelper library comes with
helper commands for getting information about the state and creating a command. Our job is
to use these to create a program that plays well. Lets look at a simple strategy as a way to
get thinking about the game, and to introduce some of the methods available to us.


### Streamer

This bot will simply send its units towards an enemy building every turn, no matter where they are.
It loops over all the cells where it has units, and issues commands to move all of them one square
closer to the first enemy building returned by GameHelper.

```
def do_turn(game):
    commands = []

    occupiedCells = game.get_my_cells()

    enemyBuildings = game.get_enemy_building_sites()

    for cell in occupiedCells:
        m = game.move_towards(cell.position, enemyBuildings[0].position)
        if m:
            commands.append(m)


    # done for this turn, send all my commands
    return commands
```

Let's walk through the new things we have seen here. The object that our do_turn method is passed,
called `game`, is an instance of GameHelper and we can call methods on it.

We first get some information about the state of the game. The first we see
is `game.get_my_cells()`. This method returns an array of the cells where we have one or more units located.
We then call `game.get_enemy_building_sites()` to get an array of the enemy buildings on the map.
There are many more things we can know about the state (see [All Methods](#) below),
but for this simple strategy this is all we will ask about the game each turn.

We now issue commands based on the start of the game. We loop over all the cells where we have units,
and use the helper method `move_towards(from_position, to_position)` to create a command
that moves all of our units at `cell.position` (our `from_position`) towards `enemyBuildings[0].position`
(our `to_position`). We can only move one cell at a time, so this method creates a move
one step in the right direction, and returns it. The method only returns a command if the move is possible,
so it is a good idea to check if a command was returned before appending it to our commands array.

And that's it. We return our commands for that turn, and the game server handles them along with the moves of the other
player(s) to update state. Then it sends the bots the new state and our bots do it all over again (though a real
bot would likely do different things based on what the new state looks like).

## Conclusion

We have now seen how bots are structured to be able to plug into the game flow. This is
boilerplate you can always just copy when starting a new bot. We have also seen
how one might begin to implement a strategy in the `do_turn` method, taking in a state and returning
commands based on it.
