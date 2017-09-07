# liri-node-app
## Description
A website that uses socket.io to enable real-time bidrectional event-based communication. 
* Clients can:
    * Load my twitter feed
    * Search for a song through Spotify
    * Search for a movie through Omdb
* APIs Used:
    * Omdb
    * Spotify
    * Twitter
## Setup 
1. Clone this repo using the command line
```shellSession
git clone https://github.com/danielhdz56/liri-node-app.git
```
2. Change directory and install packages using npm 
```shellSession
cd liri-node-app/
npm install
```
![clone](/assets_readme/setup.gif?raw=true "Clone")
## How to Use version 1
### Help
Access help by using the `--help` or `-h` flag
```shellSession
node app-promise.js --help
```
![help](/assets/help-liri-v1.gif?raw=true "Help")
### Possible entries
Command | `node liri.js [inputCommandHere] [inputSearch]`
 :---: | :---:
my-tweets | `node liri.js my-tweets` ![twitter](/assets/tweets-v1.gif?raw=true "Twitter")
spotify-this-song | `node liri.js spotify-this-song 'Tongue Tied'` ![spotify](/assets/spotify-v1.gif?raw=true "Spotify")
movie-this | `node liri.js movie-this 'Titanic'` ![omdb](/assets/omdb-v1.gif?raw=true "Omdb")
do-what-it-says | `node liri.js do-what-it-says` ![random](/assets/random-v1.gif?raw=true "random")

![twitter](/assets/tweets-v1.gif?raw=true "Twitter")