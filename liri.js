// Packages from node or npm
const yargs = require('yargs');
const _ = require('lodash');

//Packages made inhouse
const commands = require('./commands.js');

// Configuring yargs to display information about commands when typing the help flag
const argv = yargs
    .command('my-tweets', 'List the last 20 tweets')
    .command('spotify-this-song', 'Display information about the song')
    .command('movie-this', 'Display information about the movie')
    .command('do-what-it-says', 'Will run the random text file')
    .help()
    .argv;

// Retrieving user input from terminal
var command = argv._[0];
var query = argv._[1];

//Logic for commands
var runCommand = (command, query) => {
    if (command === 'my-tweets') {
        commands.runTwitter();
        commands.runAddLog(command);
    } else if (command === 'spotify-this-song') {
        commands.runSpotify(query);
        commands.runAddLog(command, query);
    } else if (command === 'movie-this') {
        commands.runOmdb(query);
        commands.runAddLog(command, query);
    } else if (command === 'do-what-it-says') {
        var doWhatItSays = commands.runDoWhatItSays();
        var doCommand = doWhatItSays.split(',')[0];
        var doQuery = doWhatItSays.split(',')[1];
        runCommand(doCommand, doQuery);
        commands.runAddLog(command);
    }
};
runCommand(command, query);