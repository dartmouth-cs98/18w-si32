# Your First Bot

A Monad bot is simply a python program that plays the game by generating commands.
On a high level, a central server will handle the game logic and state, and when it is time
for the bots to make their moves, it will ask them. You write the code that then kicks in and
decides what moves are sent back. Will you attack, build, or mine for resources? What will your opponent do?
The AI with the best strategy will be the last one standing! If you have not read the [game overview](#) yet,
please do so now to give you some context for the overview of commands that follows.

## Requirements

Our only assumption is that you have Python3 on your computer.

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

## All Commands

**create_move_command(location, direction, n_units)**
Takes as input a tuple **location**, another tuple **direction**, and an integer **n_units**, returns a Command object with the inputted parameters as its characteristics. **direction** will be a vector, e.g. (1, 0) will correspond to a northern movement.

**position_towards(position_from, position_to)**
Takes as input two tuples **position_from** and **position_to**, returns a new position that is one cell away from **position_from** in a direction that is closer to **position_to** than **position_from**; the horizontal direction will take priority over the vertical.

**move_towards(position_from, position_to, n_units)**
Takes as input two tuples **position_from** and **position_to** and an integer **n_units**, returns a Command with type move that will get closer to **position_to** from **position_from**, with number of units **n_units**.

**get_occupied_tiles(playerId)**
Takes as input an integer **playerId**, returns a list of Tile objects corresponding to all Tiles in which the player with Id **playerId** controls at least one unit.

**my_occupied_tiles()**
Returns a list of Tile objects controlled by the bot calling the function.

**enemy_occupied_tiles()**
Returns a list of Tile objects controlled by the bot's enemy.

**get_tile(x, y)**
Takes as input two integers **x** and **y** and returns the Tile object with that position.

**my_buildings()**
Returns a list of tiles in which the bot controls a building

**enemy_buildings()**
Returns a list of buildings in which the bot's enemy controls a building

**my_resource_count()**
Returns the number of resource controlled by the bot

**compare_building_count()**
Returns True if the bot controls more buildings than the bot's enemy, otherwise returns False

**compare_unit_count()**
Returns True if the bot controls more units than the bot's enemy, otherwise returns False

**compare_resource()**
Returns True if the bot has more resource than the bot's enemy, otherwise returns False

**my_units_at_pos(pos)**
Takes as input a tuple **pos** and returns the number of units at the Tile with position **pos**

**move(position_from, number_of_units, direction)**
Takes as input a tuple **position_from**, an integer **number_of_units**, and another tuple **direction**, returns a Command with type **move** with position **position_from**, number of units **number_of_units**, and direction **direction**

**build(position_build, number_of_units)**
Takes as input a tuple **position_build** and an integer **number_of_units**, returns a Command with type **build** with position **position_build** and number of units **number_of_units**


**mine(position_mine, number_of_units)**
Takes as input a tuple **position_mine** and an integer **number_of_units**, returns a Command with type **mine** with position **position_mine** and number of units **number_of_units**

**get_number_of_buildings_belonging_to_player(playerId)**
Returns the number of buildings controlled by the player with Id **playerId**

**get_nearest_building_position_and_distance_belonging_to_player(x, y, playerId)**
Takes as input two integers **x** and **y** and an integer **playerId**, returns the Building closest to **(x, y)** (Manhattan distance) controlled by the player with Id **playerId**

**get_nearest_enemy_building_position()**
Returns the position of the enemy Building that is the closest to any building controlled by the bot

**get_free_position_with_greatest_resource_of_range(x, y, r)**
Takes as input three integers **x**, **y**, and **r**, returns the position with the greatest resource that is:
1. free of any building (can be mined)
2. within a Manhattan distance of **r** of **(x, y)**

**get_adjacent_free_position_with_greatest_resource(self, x, y)**
Takes as input two integers **x**, **y**, returns the building-free position with the greatest resource that is adjacent to **(x, y)**

**get_nearest_player_unit_pos_to_tile(x, y, playerId)**
Takes as input three integers **x**, **y**, and **playerId**, returns a tuple (**nearest_pos**, **distance**) where:
**nearest_pos** is the position occupied by units of player with Id **playerId** that is closest to **(x, y)** (right now, it's Manhattan distance; later on, will be the closest distance with regard to buildings and obstacles)
**distance**is that distance
