# Game Rules

Here we provide a detailed breakdown of the rules of Monad.

### What is Monad?

Monad is a turn-based strategy game that brings together elements of Starcraft and chess.
Instead of playing the game yourself, however, the game is played by autonomous artificial intelligence
programs ("agents") that you design and implement. Once you have implemented a bot, you then
upload your code to the Monad servers where your bot is then pitted against bots
submitted by other Monad players from all over the world.

### Language

* `Map` Monad games take place in a two-dimensional hexagonal grid environment that we
commonly refer to as the game _Map_
* `_Cell_s` The _Map_ is composed of individual hexagonal _Cell's_
* `Units` Each player in Monad controls an army of _Units_ which navigate the _Map_ by moving
between _Cell's_
* `Resources` Each _Unit_ has the ability to mine _Resources_ — effectively an in-game currency
* `Buildings` Players use _Resources_ to build _Buildings_, which in turn spawn more _Units_

### Objective

The objective of Monad is to destroy all of the _Buildings_ controlled by an enemy player, and
therefore become the sole remaining player with _Buildings_ on the _Map_.

There are many strategies that may lead a bot to be successful in achieving this objective,
but there are several sub-objectives that play at least some role in most winning strategies, namely

- Gathering _Resources_ to accelerate _Building_ production
- Constructing _Buildings_ to accelerate _Unit_ production
- Controlling the _Map_ area to maximize favorable combat scenarios and to minimize the
mobility of opposing  _Units_

### Initial Conditions

Each player starts the game with a single _Unit_ and 100 _Resources_  — just enough to
create one building.

### Victory

There are three ways in which a player emerges victorious in a Monad game

1. They become the only player controlling a nonzero number of _Buildings_
2. They are the only player controlling a nonzero number of _Units_ for a period of ten (10) turns
3. They control the greatest number of _Units_ after 2000 turns have elapsed and neither of the
previous two conditions have been met.

### Maps

In order to test bot versatility and to decrease predictability of matches, the _Resource_
allocation and _Obstacle_ distribution on Monad _Maps_ are randomized.
However, all _Maps_ share a few basic characteristics:

**_Maps_ are grid-based**:

The _Map_ is composed of discrete _Cell's_, arranged in an according to a cartesian coordinate system.

The _Cell's_ in a _Map_ have properties:

Each free _Cell_ initially contains some randomized _Resource_ value.
Each _Cell_ may also contain a single _Building_.
A _Cell_ may contain an arbitrary number of _Units_.
Note that as the _Cell_s are hex based, each _Cell_ will have 6 adjacent _Cell_s.

_Units_ and _Buildings_ each only ever occupy a single _Cell_ at a time.

A _Cell_ containing a _Building_ cannot be mined for _Resources_.

A _Cell_ that contains an _Obstacle_ contains no _Resources_ and can contain no _Units_ or _buildings_.

**_Maps_ are symmetric**:

In order to make games as fair as possible, and to minimize the effects of luck and variance in
determining the outcome of an individual match, _Maps_ are symmetric in terms of _Resource_
allocation and _Obstacle_ distribution.
Each player starts a match in a symmetric part of the _Map_. For instance, in a 4-player game, each
player will begin with their starter unit at the center of a quadrant of the map, and each quadrant will
initially contain the same total amount of _Resources_ and _Obstacles_. This ensures that each player
will initially have access to the same environment/resources.

### Units

_Units_ are the dynamic element of any Monad match.
They are responsible for combat, _Resource_ gathering, and _Building_ construction.
Each _Unit_ occupies a single _Cell_ on the _Map_ at any one time. Each player controls a number of _Units_, which are produced by the _Buildings_ that they control.

Individual _Units_ have no identifying characteristics (e.g. health) besides their position on the map;
they are effectively indistinguishable from one another. Therefore, there is no concept of a separate
_Unit_ entity, and the map contains all the information about each player's _Units_ - each _Cell_ on
the _Map_ simply tracks the number of _Units_ that currently reside within it.

Units are controlled via _Commands_ which come in three (3) distinct varieties:

- **Move** - Move the _Unit_ from its current _Cell_ to an adjacent _Cell_.
- **Build** - If there is no _Building_ in the current _Cell_, and the player has sufficient
_Resources_, construct a _Building_ in the current _Cell_. Construction of a _Building_ happens
instantly.
If a _Building_ is already present in the current _Cell_, help the _Building_ produce new _Units_.
- **Mine** - Gather a single unit of _Resource_ from the current _Cell_, if there are any resources
remaining.

### Buildings

_Buildings_ are static _Map_ objects which spawn new _Units_.
A _Building_ can be created by any _Unit_ on a free _Cell_ (one that is not occupied by any player,
and is not obstructed by an _Obstacle_), and costs 100 _Resources_.
Each building occupies a single _Cell_ of the _Map_.
A building will continuously spawn new _Units_ in the _Cell_ in which it is located at a rate
proportional to the number of allied _Units_ stationed at the building's _Cell_.

Each building has a default **intrinsic defense rating** of ten (10).
The building essentially serves as an additional force of ten (10) _Units_ in combat when defending,
which regenerates every turn.

Buildings can be destroyed by _Units_ through combat.
If an enemy player sends a number of _Units_ equal to or greater than the number of allied units + the
**intrinsic defense rating** of the _Building_, the building and all its allied _Units_ are destroyed
(along with a number of enemy _Units_ equal to the number of allied _Units_ + the building's **intrinsic
defense rating**).

If the enemy player sends a number of _Units_ less than the **intrinsic defense rating** of the
_Building_, all
attacking enemy _Units_ are destroyed and the building and its allied _Units_ are unharmed. If the enemy
player sends a number of _Units_ larger than the building's **intrinsic defense rating** but smaller
than the sum of the **intrinsic defense rating** and its number of docked allied _Units_, all attacking
enemy _Units_ are destroyed but the _Building_ loses a number of allied _Units_ equal to the difference
of the number of attacking enemy _Units_ and the **intrinsic defense rating** plus one (1).

Some examples serve to illustrate this point:

- _Building_ has no allied _Units_ docked, enemy attacking force has 8 _Units_ --> enemy loses 8
attacking _Units_, _Building_ unaffected.
- _Building_ has no allied _Units_ docked, enemy attacking force has 10 _Units_ --> enemy loses 10
attacking _Units_, _Building_ is destroyed.
- _Building_ has 3 allied _Units_ docked, enemy attacking force has 8 _Units_ --> enemy loses 8
attacking _Units_, _Building_ and 3 allied _Units_ unaffected.
- _Building_ has 3 allied _Units_ docked, enemy attacking force has 15 _Units_ --> enemy loses 13
attacking _Units_, _Building_ and 3 allied _Units_ are destroyed.
- _Building_ has 3 allied _Units_ docked, enemy attacking force has 12 _Units_ --> enemy loses 12
attacking _Units_, _Building_ loses 3 allied _Units_.
_Building_ has 3 allied _Units_ docked, enemy attacking force has 13 _Units_ --> enemy loses 13
attacking _Units_, _Building_ and 3 allied _Units_ are destroyed.

### Combat

Combat in Monad takes place in two discrete phases.

#### First phase: Collision Phase:

 If enemy players would send units in opposite directions from adjacent _Cell_s_, the enemy groups of
 _Units_ would fight, with the weaker group eliminated and the stronger group losing a number of _Units_
 equal to the weaker group's number.

 After the game state receives all _Commands_ for the turn from all players, it checks if any of the
 _Commands_ would send enemy _Unit_ groups from adjacent _Cell's_ into each other. If there are any
 such 'collisions' between _Unit_ groups, _Units_ will be subtracted from each _Unit_ group until only
 the stronger group remains or both groups are eliminated.

#### Second phase: _Cell_-Update Phase:

A _Cell_ is defined to not contain _Units_ controlled by more than one player at the start of every
turn. If a _Cell_ ends up having nonzero numbers of _Units_ of more than one player (as a result of
_Unit_ movement), the game state will process some combat operation which will result in only one or
less players with remaining units in the _Cell_.

For example, Player A sends 8 _Units_ North from **(2, 4)** and Player B sends 5 _Units_ South from
**(2, 5)**; these two _Commands_ will be replaced by an effectively equal single _Command_ of "Player A
sends 3 _Units_ North from **(2, 4)**.

In the case of two players, the player with the greater number of _Units_ in the _Cell_ will lose a
number of _Units_ equal to the
other player's number of _Units_, and the other player's number of _Units_ will be set to zero.

In the case of three or more players:

- **1**. Each player with nonzero _Units_ in the _Cell_ will assign some number of _Units_ towards
each other player with nonzero _Units_ in the _Cell_ proportional to the enemy player's number of
_Units_, rounded down. Any leftover units will be randomly assigned towards an enemy player.
For example, if Player A has 8 units, Player B has 12 units, and Player C has 7 units.
  - Player A will send (12/19) of his 8 _Units_, rounded down --> 5 _Units_ to Player B and (7/19)
  of his 8 _Units_, rounded down --> 2 _Units_ to Player C. The remaining _Unit_ (8 - 5 - 2 = 1)
  will be randomly assigned to Player B or Player C.
  - Player B will send (8/15) of his 12 _Units_, rounded down --> 6 _Units_ to Player A and (7/15)
  of his 8 _Units_, rounded down --> 5 _Units_ to Player C. The remaining _Unit_ (12 - 6 - 5 = 1)
  will be randomly assigned to Player A or Player C.
  - Player C will send (8/20) of his 7 _Units_, rounded down --> 2 _Units_ to Player A and (12/20)
  of his 7 _Units_, rounded down --> 4 _Units_ to Player B. The remaining _Units_ (8 - 2 - 4 = 2)
  will be randomly assigned to Player A or Player B.


- **2**. After assignments are complete, the assigned _Units_ between each pair of players will fight,
with the weaker group eliminated and the strong group losing a number of _Units_ equal to the number
of the weaker group. Let's assume that all randomly assigned _Units_ are just sent to the first enemy
player, alphabetically. If we use tuples to represent the players and the _Units_ they send towards
each other:

   (A, B): (5 + 1, 6 + 1) = (6, 7) (Player A sends 6 _Units_ to Player B and Player B sends 7 _Units_
     to Player A)
  Player A sends 6 _Units_ to Player B, Player B sends 7 _Units_ to Player A; Player A loses all sent
  _Units_, Player B keeps 1 _Unit_

   (A, C): (2, 2 + 1) = (2, 3)
   Player A sends 2 _Units_ to Player C, Player C sends 3 _Units_ to Player A; Player A loses all sent
   _Units_, Player C keeps 1 _Unit_

   (B, C): (5, 4)
   Player B sends 5 _Units_ to Player C, Player C sends 4 _Units_ to Player B; Player B keeps
   _Unit_, Player C loses all sent _Units_

   ![Alt Text](https://i.imgur.com/MnDKg7u.png)

- **3**. After combat, the number of _Units_ in each _Cell_ will be updated accordingly.

   So Player B keeps 2 _Units_ in total and Player C keeps 1 _Unit_ in total.

   ![Alt Text](https://i.imgur.com/QvneJOx.png)

- **4**. Keep repeating the above process until there are no more than one players with nonzero
_Units_ in the _Cell_.

   So Player B would fight Player C, and Player B would keep 1 _Unit_, and Player C would lose all
   _Units_.

- **5**. Player B keeps 1 _Unit_, Players A and C lose all _Units_.

   ![Alt Text](https://i.imgur.com/NKPlpRR.png)
