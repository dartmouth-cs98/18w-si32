# Game Rules

Here we provide a detailed breakdown of the rules of Monad.

### What is Monad?

Monad is a turn-based strategy game that brings together elements of Starcraft and Chess.
Instead of playing the game yourself, however, the game is played by autonomous artificial intelligence
programs ("agents") that you design and implement. Once you have completed your agent
(hereafter referred to as a "bot"), you then upload the code that implements it to the Monad servers where your it is then pitted against bots submitted by other Monad players from all over the world.

### Language

**Game Space**

* `Map` Monad games take place in a two-dimensional hexagonal grid environment that we
commonly refer to as the game _Map_
* `Cells` The _Map_ is composed of individual hexagonal _Cells_
* `Units` Each player in Monad controls an army of _Units_ which navigate the _Map_ by moving
between _Cells_
* `Resources` Each _Unit_ has the ability to mine _Resources_ — effectively an in-game currency
* `Hives` Players use _Resources_ to build _Hives_, which in turn spawn more _Units_
* `Obstacles` Some _Cells_ contain _Obstacles_ which prevent _Units_ from both navigating
through them and constructing _Hives_ within them

**Other**

* `Turns` A turn refers to a move by each bot in a match. If there are four bots participating
in a match, for instance, a turn would consist of the moves made by each of the four bots.
Once these four moves are issued and used to update the game state, the next turn commences.

### Objective

The objective of Monad is to destroy all of the _Hives_ controlled by an enemy player, and
therefore become the sole remaining player with _Hives_ on the _Map_.

There are many strategies that may lead a bot to be successful in achieving this objective,
but there are several sub-objectives that play at least some role in most winning strategies, namely

- Gathering _Resources_ to accelerate _Hive_ production
- Constructing _Hives_ to accelerate _Unit_ production
- Controlling the _Map_ area to maximize favorable combat scenarios and to minimize the
mobility of opposing  _Units_

### Initial Conditions

Each player starts the game with a single _Unit_ and 100 _Resources_  — just enough to
create one hive.

### Victory

As the objective section above suggests, a bot emerges victorious in a Monad match
in the event that it becomes the only bot in the match controlling a nonzero number
of _Hives_.

In the case of matches with more than two players,
a bot that has its last _Hive_ destroyed but still has active _Units_ on the map
is not immediately removed from the match. Instead, the bot is still permitted
to issue commands to these remaining units in the normal manner.

**Breaking Ties**

In an effort to prevent matches from running for long periods of time (possibly indefinitely)
and consuming large amounts of computing power, Monad enforces a hard turn limit of 2000
turns per match. That is, once 2000 turns have elapsed, the game is over.

In the event that this turn limit is reached and no bot has emerged as the unambiguous
victor, the bot with the greatest number of active _Units_ is declared the victor.

### Maps

In order to test bot versatility and to decrease predictability of matches, the _Resource_
allocation on maps is randomized. Furthermore, the _Obstacle_ distribution varies
from match to match — sometimes the distribution may be random, within certain density
parameters, while other times the _Obstacle_ distribution may have a more well-defined
structure.

Despite these differences, however, all _Maps_ share a few basic characteristics.

**_Maps_ are grid-based**

The _Map_ is composed of discrete _Cell's_, arranged in an according to a cartesian coordinate system.

The _Cell's_ in a _Map_ have properties:

Each free _Cell_ initially contains some randomized _Resource_ value.
Each _Cell_ may also contain a single _Hive_.
A _Cell_ may contain an arbitrary number of _Units_.
Note that as the _Cell's are hex based, each _Cell_ will have 6 adjacent _Cell's.

_Units_ and _Hives_ each only ever occupy a single _Cell_ at a time.

A _Cell_ containing a _Hive_ cannot be mined for _Resources_.

A _Cell_ that contains an _Obstacle_ contains no _Resources_ and can contain no _Units_ or _hives_.

**_Maps_ are symmetric**

In order to make games as fair as possible, and to minimize the effects of luck and variance in
determining the outcome of an individual match, _Maps_ are symmetric in terms of _Resource_
allocation and _Obstacle_ distribution.

Each player starts a match in a symmetric part of the _Map_. For instance, in a 4-player game, each
player will begin with their starter unit at the center of a quadrant of the map, and each quadrant will
initially contain the same total amount of _Resources_ and _Obstacles_. This ensures that each player
will initially have access to the same environment/resources.

### Units

_Units_ are the dynamic element of any Monad match.
They are responsible for combat, _Resource_ gathering, and _Hive_ construction.
Each _Unit_ occupies a single _Cell_ on the _Map_ at any one time. Each player controls a number of _Units_, which are produced by the _Hives_ that they control.

Individual _Units_ have no identifying characteristics (e.g. health) besides their position on the map;
they are effectively indistinguishable from one another. Therefore, there is no concept of a separate
_Unit_ entity, and the map contains all the information about each player's _Units_ - each _Cell_ on
the _Map_ simply tracks the number of _Units_ that currently reside within it.

Units are controlled via _Commands_ which come in three (3) distinct varieties:

- **Move** - Move the _Unit_ from its current _Cell_ to an adjacent _Cell_.
- **Build** - If there is no _Hive_ in the current _Cell_, and the player has sufficient
_Resources_, construct a _Hive_ in the current _Cell_. Construction of a _Hive_ happens
instantly.
If a _Hive_ is already present in the current _Cell_, help the _Hive_ produce new _Units_.
- **Mine** - Gather a single unit of _Resource_ from the current _Cell_, if there are any resources
remaining.

### Hives

_Hives_ are static _Map_ objects which spawn new _Units_.
A _Hive_ can be created by any _Unit_ on a free _Cell_ (one that is not occupied by any player,
and is not obstructed by an _Obstacle_), and costs 100 _Resources_.
Each hive occupies a single _Cell_ of the _Map_.
A hive will continuously spawn new _Units_ in the _Cell_ in which it is located at a rate
proportional to the number of allied _Units_ stationed at the hive's _Cell_.

Each hive has a default "intrinsic defense rating" of ten (10).
The hive essentially serves as an additional force of ten (10) _Units_ in combat when defending,
which regenerates every turn.

_Hives_ can be destroyed by _Units_ through combat.
If an enemy player sends a number of _Units_ equal to or greater than the number of allied units + the
intrinsic defense rating of the _Hive_, the hive and all its allied _Units_ are destroyed
(along with a number of enemy _Units_ equal to the number of allied _Units_ + the hive's intrinsic
defense rating).

If the enemy player sends a number of _Units_ less than the intrinsic defense rating of the
_Hive_, all
attacking enemy _Units_ are destroyed and the hive and its allied _Units_ are unharmed. If the enemy
player sends a number of _Units_ larger than the hive's intrinsic defense rating but smaller
than the sum of the intrinsic defense rating and its number of docked allied _Units_, all attacking
enemy _Units_ are destroyed but the _Hive_ loses a number of allied _Units_ equal to the difference
of the number of attacking enemy _Units_ and the intrinsic defense rating plus one (1).

Some examples serve to illustrate this point:

- _Hive_ has no allied _Units_ docked, enemy attacking force has 8 _Units_ --> enemy loses 8
attacking _Units_, _Hive_ unaffected.
- _Hive_ has no allied _Units_ docked, enemy attacking force has 10 _Units_ --> enemy loses 10
attacking _Units_, _Hive_ is destroyed.
- _Hive_ has 3 allied _Units_ docked, enemy attacking force has 8 _Units_ --> enemy loses 8
attacking _Units_, _Hive_ and 3 allied _Units_ unaffected.
- _Hive_ has 3 allied _Units_ docked, enemy attacking force has 15 _Units_ --> enemy loses 13
attacking _Units_, _Hive_ and 3 allied _Units_ are destroyed.
- _Hive_ has 3 allied _Units_ docked, enemy attacking force has 12 _Units_ --> enemy loses 12
attacking _Units_, _Hive_ loses 3 allied _Units_.
_Hive_ has 3 allied _Units_ docked, enemy attacking force has 13 _Units_ --> enemy loses 13
attacking _Units_, _Hive_ and 3 allied _Units_ are destroyed.

### Combat

Combat in Monad takes place in two discrete phases.

#### First phase: Collision Phase:

 If enemy players would send units in opposite directions from adjacent _Cell's_, the enemy groups of
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

After all players move their units into their new squares, units of rival factions will fight each other. The
faction with the greatest number of units will lose units equal to the number controlled by the faction with
the second greatest number of units, and all other factions will lose all their units.

For example, Player A has 12 units , Player B has 8 units, and Player C has 10 units in **(2, 5)** after
movement has occurred. After combat, Player A will have 2 units remaining, and Players B and C will lose all
their units.

<div style="padding-bottom:50px"></div>
