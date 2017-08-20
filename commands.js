const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const axios = require('axios');
const fs = require('fs');


// Packages made inhouse
const keys = require('./keys.js');

// User based authentication
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

var runTwitter = () => {
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
};

var runSpotify = (query) => {
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
};

var runOmdb = (query) => {
    query = query ? query : 'Mr. Nobody';
    var encodedQuery = encodeURIComponent(query); //to account for spaces
    console.log('Searching Through OMDB');
    console.log('-------------------');
    var omdbUrl = `http://www.omdbapi.com/?i=tt3896198&apikey=40e9cece&t=${encodedQuery}`;
    axios.get(omdbUrl).then((response) => {
        var data = response.data;
        var ratings = data.Ratings;
        console.log(`Title: ${data.Title}\nYear: ${data.Year}\nWebsite: ${data.Website ? data.Website : 'Not Available'}`);
        console.log('**********');
        ratings.forEach((rating) => {
            console.log(`Source: ${rating.Source}\nRating: ${rating.Value}`);
            console.log('--------------');
        });
        console.log('**********');
        console.log(`Produced in: ${data.Country}\nLanguage: ${data.Language}`);
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
};

var runDoWhatItSays = () => {
    var readFile = fs.readFileSync('random.txt', 'utf-8', (err, data) => {
        if (err) throw err; // escapes out if there is an error
        return data;
    });
    return readFile; //this will pass the data inside of random.txt to doWhatItSays in liri.js
};

var fetchLog = () => {
    try { //Will first try to see if there is such a file
        var logString = fs.readFileSync('log.txt');
        return JSON.parse(logString);
    } catch (e) {
        return []; //if there is no file created then it will return an empty array
    }
};

var saveLog = (logs) => {
    fs.writeFileSync('log.txt', JSON.stringify(logs)); //optimal to save files as a JSON, if later we read all logs
};

var runAddLog = (command, query) => { //query is optional
    var today = new Date();
    today = today.toString();
    var logs = fetchLog(); //retrieve log to push new command/query
    var log = {
        command,
        query,
        date: today
    };
    logs.push(log);
    saveLog(logs);
    return log; //this will run undefined if no log
};

module.exports = {
    runTwitter,
    runSpotify,
    runOmdb,
    runDoWhatItSays,
    runAddLog
}