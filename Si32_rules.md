
# Si32 Rules

### General
Si32 is a game played by AI agents designed by you, the user. Once you have uploaded your code for an AI agent, it will be pitted against other Si32 agents across the internet in order to determine your ranking. Si32 is a turn-based game played in grid-based environments. Each player controls multiple units, which means that during each turn in Si32 each player passes an array of commands to the game state, corresponding to one command per unit they control. The game state then executes these commands, updates the locations/statuses of the players' units, updates the status of the map, and then await another set of commands from each player. 

### Rules
Si32 is a turn based game where each player is trying to amass enough units to occupy the most area and buildings on the map. Usually this goal is achieved as a result of being able to perform two subroutines as efficiently as possible. These subroutines are 
1. Constructing a lot buildings in order to produce more units
2. Gathering a lot of resources in order to construct more buildings
Each player begins with one unit and enough resources to create one building, and from there on, whichever player that is able to most efficiently produce units and control buildings will eventually win the game. 

### Victory
There are three ways in which a player can win a game of si32
1. They are the only player controlling buildings
2. They have been the only player controlling units for more than 10 turns
3. If 300 turns have passed and there is no winner, the player who has produced the most units over the course of the game will win


### Maps
Each game of Si32 will be played on one of a variety of maps. However, although the maps may be different, they all share a few characteristics:

*Symmetric*: In order to make games as fair as possible, each player will start on either side of a symmetric map. This means that at the start of the game they will have access to the same environment/resources, and therefore elements of luck/variance  affecting who wins the game will be minimized

*Grid-based*: Each map will be composed of discrete tiles which units, buildings and resources can occupy. Units occupy 1 tile at a time, buildings occupy 2x2 tiles and resources, and a different amount of resources resides in each tile of the map 

### Units
Each unit controlled by a player is produced by buildings controlled by the player. Units can be considered properties of tiles on the map, in the sense that units are indistinguishable from one another, and can be identified only by their position on the map. Units are commanded by 'unit_commands' which have two possible forms.

**Move** - Moves your unit in the direction of your choosing

**Build** - If there is no building where your unit is, and you have enough resources to build a building, this command will create a building in the square where your unit is located. If there is a building in the square where they are located, they will start working and help the building produce units faster

### Buildings 
Buildings in Si32 have several noteworthy properties. First of all, creating a building costs 100 resources and, once a unit has been ordered to create one in an area where there is enough space for a building, will be created instantly.
Each building will produce new units at a rate proportional to how many units a player has working in the building. 
Buildings can also be destroyed. If an enemy player commands enough of their units onto the tile where one of your buildings is placed, the building will be destroyed. 
Determining how many enemy units are "enough" to destroy a building is quite easy. In order to destroy a building, one must march a number of opposing units onto the building's tile which is equal to the number of workers in the building + the inherent defense rating of the building. The default defense rating of buildings is 10. 
