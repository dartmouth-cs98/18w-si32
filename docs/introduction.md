# Introduction


### Monad

Welcome to Monad, the web's premiere programming challenge. Our goal is to provide an easy and fun platform for practicing programming and AI skills, for people of various programming experience.
Here you will write bots for playing our game, Monad, where the aim is to eliminate the other player's bot in a very simple turn-based strategy game. However, unlike most turn-based strategy games, it's not you that will be making the strategic decision for playing the game each turn, but your bot.


### How does it work?

Monad is a very simple turn-based strategy game played on a hexgrid map, where each player starts in a different corner with one unit and one building.
#### Units
Every turn, a unit can choose to do one of three things:
1. Move - The unit can move to any adjacent cell
2. Build - If the player controlling the unit has enough resources, the unit can build a building in the cell it is located in
3. Mine - The unit can mine resources from the cell it is located in, in order to be able to build more building in the future
#### Buildings
Buildings, once built, produce 1 new unit every turn, and have an inherent defense rating of 10. This means that it would need to be attacked by 10 enemy units in order to be destroyed. Buildings cost 100 resources to construct, and can be constructed on any cell that does not already have a building in it


#### Goal
The goal of the game is to eliminate all enemy buildings, and to this end, having as many units as possible is helpful, as you need units to destroy enemy buildings.


### Getting Started
It all starts by downloading our software development kit (SDK) for writing a Monad bot. Once you have done this and subsequently developed a bot, you can upload your bot to your account. Once your bot has been uploaded, we will automatically match your bot against other user's bots.
Based on how well your bot performs against other user's bots, we will give your bot a skill rating, which gets updated after every game your bot "plays".
We use the skill ratings of all Monad bots to construct a leaderboard, where you can see the best, and the worst, bots that are out there.


### How to improve
You've made a bot, and played it against other people's bots, but it turns out it's not performing very well. Or maybe it is performing quite well, but is no longer rising through the leaderboard.  What do you do?
There are a couple of approaches you can take.


##### Game Visualization
One of the most useful features for you will be the replay visualization feature. Every game that's played on Monad produces a game log, which tracks the state of the game after every turn, as well as what moves were made by each player.
You can take this gamelog file and go to monad.surge.sh/replay and upload the file there, and the game will be visualized for you. This way, you can see what decisions your bot made throughout the course of the game, identify potential weaknesses, and edit your bot from there.
To that end, it may also help to look at replays of games played by high level bots for some inspiration, by seeing how the best performing bots seem to make their decisions.


##### Edit your bot
You can edit your bot as many times as you'd like, and upload it again. In fact, on your account, you can see the history of how well your bot has improved, with instances of you editing your bot being specially marked.
