# Monad 
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)

_Last updated: 7 March 2018_

## Overview

Monad is a web-based artificial intelligence programming challenge. The user-facing interface is a web client where users submit code files that implement artificial intelligence agents, hereafter referred to as bots. Once submitted, users pit their bots gainst those designed by other users in a simple turn-based strategy game (think: Starcraft meets Chess).

Monad is currently deployed and publicly available [here](http://monad.surge.sh).

## Project Status

A brief overview of where we are, and where we intend to go. 

**Implemented Functionality:**

- Initial game logic 
- Initial _game helper_ class to aid users in bot development
- Web client that allows users to:
	- Register / sign in
	- Upload a new bot
	- Modify an existing bot (with new code)
	- Start a match against a selected opponent
	- View replays of matches (both those that they have participated in and others)
	- View the profile of other users
	- Create and join groups
	- View leaderboards of bot performance 
	- Upload locally-produced replay files and view corresponding replays
	- View documentation on game rules, development, and strategy

**Planned Functionality:**

- Improved UI / UX experience 
- Feed page to display activity of users _followed_ by the current user
- Guided tutorials regarding bot development
- Guided tutorials regarding bot strategy
- Provided bots of various known skill levels against which users may train their bots and gauge progress 
- Collection and visualization of match statistics (units, resources, etc.)
- Support for matches of varying numbers of players 
- More advanced / aesthetically pleasing replay graphics 
- Native desktop application / CLI to enable local replay visualization and more efficient local bot development

## Architecture

This project consists of several distinct components that together implement the above functionality. 

**Web Client**

The project's user-facing interface. This component is responsible for allowing users to register, login, upload bots, and interact with other users of the application. The web client follows the single-page application paradigm. 

The code that implements the web client is located in the `web/` subdirectory. 

**Web Documentation**

User-facing documentation regarding all aspects of interacting with the product including getting started, game rules, strategies, and an API reference. We use GitBook to generate a static site that provides this documentation. 

The code that implements the web documentation is located in the `docs/` subdirectory. 

**Web API**

The project's web server. This component is responsible for receiving requests from the both the web client and the game engine, performing some computation in response to these requests, interacting with the database, and generating appropriate responses. The web API follows the REST paradigm. 

The code that implements the web API is located in the `api/` subdirectory.   

**Database**

The project's persistence layer. This component is responsible for maintaining user-produced data, including account details, match and bot statistics, and bot code files. 

For bot code file persistence, we use Amazon S3. For all other data persistence, we use MongoDB. 

The code that implements the database is located in the `api/` subdirectory.

**Worker**

A containerized infrastructure for running matches. The game engine is a process that constantly polls the web API awaiting matches to run, initiates these matches once they become available, and communicates the results of these matches to the web API once they conclude.

We use Docker for containerization. 

The code that implements the worker is located in the `worker/` subdirectory. 

**Game Engine / Game Logic**

The rules and protocols that implement the game itself, as well as a definition of the procedure for running an individual game. 

The code that implements the game engine and game logic is located in the `game/` subdirectory. 

**Bot Development Kit**

A wrapper around various game protocols to allow users to design and implement bots more efficiently by abstracting away low level details.

The code that implements the bot development kit is located in the `game/` subdirectory. 

## Development

**Web Client**

Navigate to the `web/` directory. 

The command `npm run start` will build and serve the client at `localhost:4000`. 

To build for production, run `npm run build`. 

View README in the `web/` subdirectory for more details. 

**Web Documentation**

Navigate to the `docs/` directory. 

The command `npm run serve` will build the static site and serve it at `localhost:4001`. 

To build for production, run `npm run build`. 

View README in the `docs/` subdirectory for more details. 

**Web API**

Navigate to the `api/` directory.

Ensure that you have Docker installed on your machine. 

The command `npm run build` (equivalent to `docker-compose build`) will build the Docker images necessary to run the API locally. Once the image has been built, run `npm run up` (equivalent to `docker-compose up`) to run the API locally. Docker links together mongo, redis, and the web components for you. 

View README in the `api/` subdirectory for more details. 

**Worker**

Navigate to the `worker/` directory.

Ensure that you have Docker installed on your machine. 

The command `make` will build and configure the worker. You should now be ready to run the script `./start.sh` and see a 'game' spin up, where the bots do nothing. 

View README in the `worker/` subdirectory for more details. 

## Deployment

**Web Client**

We deploy the web client statically with Surge. Running `npm run deploy` in the `web/` directory will deploy the client. 

**Web Documentation** 

We deploy the web documentation statically with Surge. Running `npm run deploy` in the `docs/` directory will deploy the documentation. 

**Web API** 

We deploy the web API with Heroku. Running `heroku container:push web -a APPNAME` will deploy to the application at `APPNAME`. 

**Worker**

We deploy the worker with Heroku. 

## Authors

Gabe Boning, Kyle Dotterrer, Robin Jayaswal, Paul Spangfort, Tong Xu

## Acknowledgments

We owe a great deal to Professor Tim Tregubov for providing an academic setting in which a project like this may be realized. Cheers, Tim! 

We derived a significant degree of inspiration from the [Halite](https://halite.io) programming challenge. While we are deeply indebted to the creators of this superb competition, we simultaneously hope to differentiate our product from theirs via original game mechanics and additional web interface functionalities that combine to produce a fundamentally different user experience. 
