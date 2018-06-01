# Monad Game Engine

The game engine component of Monad.

### Development

Development of game components within the `game/` directory is straightforward.

* Make your changes.
* Run a local match to verify that your changes have not broken anything.
* Done.

### Anatomy

* `Bot` The higher-wrapper around all bots. Both `LocalBot` and `DockerBot` subclass
the `Bot` class.
* `Hive` Static game elements responsible for producing units.
* `Cell` Atomic elements of the hexagonal grid that composes a Monad map.
* `Command` Primary communication protocol between bots and the worker, and vice versa.
* `Coordinate` Helper class for easier navigation of the map coordinate system.
* `DockerBot` The Docker-compatible subclass of the `Bot` class; used for all
matches run online.
* `Game` The state manager for each individual match that is run.
* `LocalBot` The local development-compatible subclass of the `Bot` class; used
for all matches run locally.
* `Logger` Module responsible for producing match log files.
* `Map` Primary state containment layer of the game; maintains information regarding
the positions of units and hives by way of the cells that compose the map.
* `Player` A higher-order wrapper around an individual bot to represent the player
involved in the match in which this bot is competing.
* `Rules` Definitions of core logic regarding the initial, intermediary, and final
conditions of a Monad match.
