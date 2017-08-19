// Packages from node or npm
const yargs = require('yargs');
const _ = require('lodash');
const axios = require('axios');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

const http = require("http");

// Packages made inhouse
const keys = require('./keys.js');

// User based authentication
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

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
if (command === 'my-tweets') {
    console.log('Retriving My Tweets');
    console.log('-------------------');
    var params = {
        count: 20
    };
    client.get('statuses/user_timeline', params, (error, tweets, response) => {
        if (!error) {
            tweets.forEach((tweet) => {
                console.log(tweet.created_at)
                console.log(tweet.text);
                console.log('-------------------');
            })
        }
    });
} else if (command === 'spotify-this-song') {
    console.log('Searching Through Spotify');
    console.log('-------------------');

    spotify.search({
        type: 'track',
        query,
        limit: 5
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var spotifyObj = data.tracks.items;
        spotifyObj.forEach((song) => { // Ternary operators used for edge cases where property might be null/undefined
            console.log(`Artist: ${song.artists[0].name ? song.artists[0].name : 'Not Available'}`);
            console.log(`Song: ${song.name ? song.name : 'Not Available'}`);
            console.log(`Preview link: ${song.preview_url ? song.preview_url : 'Not Available'}`);
            console.log(`Album name: ${song.album.name ? song.album.name : 'Not Available'}`)
            console.log('--------------')
        });
    });
}