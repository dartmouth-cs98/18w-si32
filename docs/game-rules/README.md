# Game Rules

### General
Monad (a.k.a. Si32) is a RTS (real-time-strategy) style game played by AI agents designed by you, the user. Users upload bots based on a template (see 'Your First Bot'), which can then compete against Monad bots written by other users over the internet. 

Monad is a turn-based strategy game played in a grid of **Cells**. Each player controls an army of **units**, each with the ability to mine **resource** (a type of currency used to build **buildings** - which spawn more units), move around the grid, or build **buildings**. During
each turn in Monad, each player's bot will process information about the game state and determine its next move, which will be communicated as an array of **Command** objects. A **Command** will determine what the units in each Cell will do in the player's turn. It contains the following information - it will specify a **Cell**, a type of action (**move**, **build**, or **mine**), a direction (if the action is of type **move** or **build**), and a number of **units**. The game will then execute these **Commands** (perform the action for the specified number of **units** in the specified cell), update the locations of the players'
**units**, updates the status of the map and the players, and then await another set of **Commands** from each player.

### Objective
The objective of Monad is to destroy each opponent's buildings and become the sole player with buildings on the map.

Usually, this goal is achieved by performing several subtasks better or more efficiently than the opponents, namely:
- Gathering **resources** (to accelerate **building** production)
- Constructing **buildings** (to accelerate **unit** production)
- Controlling the map area to maximize favorable combat scenarios (destroying enemy **buildings**) and to minimize opponent **unit** mobility

Each player starts the game with a single **unit** and 100 **resources** (just enough to create one building).

### Victory
There are three ways in which a player can win a game of Monad
1. They are the only player controlling a nonzero number of **buildings**.
2. They have been the only player controlling a nonzero number of **units** for the last 10 turns.
3. If 2000 turns have passed and no winner has been determined by the last two conditions, the player controlling more units at the time is the winner.

### Maps
Each game of Si32 will be played on one of a variety of maps. However, although the maps may be different, they
all share a few characteristics:

*Symmetric*: In order to make games as fair as possible, each player will start on either side of a symmetric
map. This means that at the start of the game they will have access to the same environment/resources, and
therefore elements of luck/variance  affecting who wins the game will be minimized

*Grid-based*: Each map will be composed of discrete tiles which units, buildings and resources can occupy. Units
occupy 1 tile at a time and buildings occupy 2x2 tiles. A different amount of resources resides in
each tile of the map

### Units
Each unit controlled by a player is produced by buildings controlled by the player. Units can be considered
properties of tiles on the map, in the sense that units are indistinguishable from one another, and can be
identified only by their position on the map. Units are commanded by 'unit_commands' which have three possible
forms.

**Move** - Moves your unit in the direction of your choosing

**Build** - If there is no building where your unit is, and you have enough resources to build a building, this
command will create a building in the square where your unit is located. If there is a building in the square
where they are located, they will start working and help the building produce units faster

**Mine** - Gathers resource from the tile the unit is on, if there is resource remaining on the tile.

### Buildings
Buildings in Si32 have several noteworthy properties. First of all, creating a building costs 100 resources and,
once a unit has been ordered to create one in an area where there is enough space for a building, will be created
instantly.
Each building will produce new units at a rate proportional to how many units a player has working in the
building.
Buildings can also be destroyed. If an enemy player commands enough of their units onto the tile where one of
your buildings is placed, the building will be destroyed.
Determining how many enemy units are "enough" to destroy a building is quite easy. In order to destroy a
building, one must march a number of opposing units onto the building's tile which is equal to the number of
workers in the building + the inherent defense rating of the building. The default defense rating of buildings is
10.

### Combat
Combat in Si32 takes place in two discrete phases. In the first phase, after the game state has received all the
unit commands both players, it checks if any of the commands send enemy units from adjacent tiles into each
other.  
If there are any such 'collisions' between units, then units from the marching armies will be subtracted from
each other until none or the larger army remains. After this, the commands will be modified to reflect the (probably) smaller size of the new marching army.  
After this, positions of units are updated, and in each tile, units from opposing armies are subtracted from each
other until none or the larger army remains. So, at the start of each turn, for each tile there will be no more than one faction of unit.
