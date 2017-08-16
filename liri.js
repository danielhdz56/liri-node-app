// Packages from node or npm
const yargs = require('yargs');
const _ = require('lodash');
const axios = require('axios');
const Twitter = require('twitter');
const spotify = require('spotify');

// Packages made inhouse
const keys = require('./keys.js');

// User based authentication
var client = new Twitter(keys.twitterKeys);

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
} else if(command === 'spotify-this-song'){
    console.log('Searching Through Spotify');
    console.log('-------------------');
    
}