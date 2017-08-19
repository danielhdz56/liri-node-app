// Packages from node or npm
const yargs = require('yargs');
const _ = require('lodash');
const axios = require('axios');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');

// Packages made inhouse
const keys = require('./keys.js');

// User based authentication
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

//Api
//OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=f67d882d
//Poster API: http://img.omdbapi.com/?i=tt3896198&h=600&apikey=f67d882d

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
    query = query ? query : 'The Sign Ace of Base';
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
} else if (command === 'movie-this') {
    query = query ? query : 'Mr. Nobody';
    var encodedQuery = encodeURIComponent(query);
    console.log('Searching Through OMDB');
    console.log('-------------------');
    var omdbUrl = `http://www.omdbapi.com/?i=tt3896198&apikey=40e9cece&t=${encodedQuery}`;
    axios.get(omdbUrl).then((response) => {
        var data = response.data;
        var ratings = data.Ratings;
        console.log(`Title: ${data.Title}`);
        console.log(`Year: ${data.Year}`);
        console.log('**********');
        ratings.forEach((rating) => {
            console.log(`Source: ${rating.Source}`);
            console.log(`Rating: ${rating.Value}`);
            console.log('--------------');
        });
        console.log('**********');
        console.log(`Produced in: ${data.Country}`);
        console.log(`Language: ${data.Language}`);
        console.log('**********');
        var plot = data.Plot;
        plot = plot.replace(/\. /g, ".\n");
        console.log(`Plot:\n${plot}`);
        console.log('**********');
        var actors = data.Actors;
        actors = actors.replace(/\, /g, "\n");
        console.log(`Actors:\n${actors}`);
        console.log('**********');
    }).catch((e) => {
        //console.log(e)
        console.log(`From throw: ${e.message}`);
    })

}