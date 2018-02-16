Si32 Web
========

The UI component of Si32

## Building and Running

From this directory, `docker-compose build` and then `docker-compose up` should run the front end on your machine at `localhost:4000`.

Any changes to code inside `/src` should propagate through without needing
to rebuild the image.  

## Anatomy 

* Landing Page
	- Introduces users to the site 
* Login / Register Page
	- Allows existing users to log in
	- Allows new users to create an account
* Dashboard (Profile) Page
	- Allow users to upload a bot  
	- Allow users to view their global stats
	- Allow users to view the stats for their current bot(s)
	- Allow users to view the stats for previous bots
	- Allow users to view their game history
	- Allow users to request to challenge a known opponent
* Docs Page 
	- Allow users to interact with a variety of documentation / resources
* Leaderboard Page
	- Allow users to view the global leaderboard
	- Allow users to view their position on global leaderboard 
	- Allow users to view the position of other known users on leaderboard
* Replay Page
	- Allow users to upload a replay file 
	- Allow users to view a game visualization from uploaded replay file 
	- Allow users to view game stats from uploaded replay file 

