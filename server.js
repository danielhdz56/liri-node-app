const express = require('express');
var app = express();
const hbs = require('hbs'); //express view engine for handlebars
const fs = require('fs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const axios = require('axios');



// Packages made inhouse
const keys = require('./keys.js');

// User based authentication
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

const port = process.env.PORT || 3000; // heroku or remote


//Allows us to reuse code from handlebars
hbs.registerPartials(__dirname + '/views/partials');

//set up express in order to use handlebars
app.set('view engine', 'hbs');

//appending the time, method, and url the client used in server
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next(); //lets express know that we can move on
});

//middlware to set up express as a static directory
app.use(express.static(__dirname + '/public'));

//when a client connects, do this
io.on('connection', function (socket) {
    console.log('Client connected...');
    socket.on('my-tweets', function (data) {
        runTwitter = () => {
            var params = {
                count: 20
            };
            var twitterClient = client.get('statuses/user_timeline', params, (error, tweets, response) => {
                if (!error) {
                    var allTweets = [];
                    tweets.forEach((tweet) => {
                        var image = tweet.user.profile_image_url;
                        image = image.split('normal').join('400x400');
                        tweetData = {
                            created: tweet.created_at,
                            text: tweet.text,
                            name: tweet.user.name,
                            screenName: tweet.user.screen_name,
                            image,
                            favorite: tweet.favorited,
                            retweeted: tweet.retweeted,
                            quoted: tweet.is_quote_status
                        }
                        allTweets.push(tweetData);
                    });
                    socket.emit('buttonTwitterData', allTweets); //sends only to the one that requested it
                }
            });
        };
        runTwitter();
    });
    socket.on('spotify-this-song', function (data) {
        runSpotify = (query) => {
            query = query ? query : 'The Sign Ace of Base';
            spotify.search({
                type: 'track',
                query,
                limit: 5
            }, function (err, data) {
                if (err || data.tracks.items.length === 0) {
                    var errorStatus = 'error';
                    socket.emit('buttonSpotifyData', errorStatus);
                } else {
                    var allSpotifyQueries = [];
                    var spotifyObj = data.tracks.items;
                    spotifyObj.forEach((song) => { // Ternary operators used for edge cases where property might be null/undefined
                        songData = {
                            artist: song.artists[0].name ? song.artists[0].name : 'Not Available',
                            song: song.name ? song.name : 'Not Available',
                            previewLink: song.preview_url ? song.preview_url : 'Not Available',
                            album: song.album.name ? song.album.name : 'Not Available',
                            albumImage: song.album.images[0].url ? song.album.images[0].url : 'Not Available'
                        }
                        allSpotifyQueries.push(songData);
                    });
                    socket.emit('buttonSpotifyData', allSpotifyQueries);
                }
            });
        };
        runSpotify(data);
    });
    socket.on('movie-this', function (data) {
        runOmdb = (query) => {
            query = query ? query : 'Mr. Nobody';
            var omdbUrl = `http://www.omdbapi.com/?i=tt3896198&apikey=40e9cece&t=${query}`;
            axios.get(omdbUrl).then((response) => {
                var dataMovie = response.data;
                var ratings = dataMovie.Ratings;
                var plot = dataMovie.Plot;
                plot = plot.replace(/\. /g, ".\n");
                var actors = dataMovie.Actors;
                actors = actors.replace(/\, /g, "\n");
                var movieData = {
                    title: dataMovie.Title,
                    year: dataMovie.Year,
                    website: dataMovie.Website ? dataMovie.Website : 'Not Available',
                    imdbSource: ratings[0].Source,
                    imdbRating: ratings[0].Value,
                    rottenSource: ratings[1].Source,
                    rottenRating: ratings[1].Value,
                    metaSource: ratings[2].Source,
                    metaRating: ratings[2].Value,
                    country: dataMovie.Country,
                    language: dataMovie.Language,
                    plot,
                    actors,
                    poster: dataMovie.Poster
                }
                socket.emit('buttonOmdbData', movieData);
            }).catch((e) => {
                var errorStatus = 'error';
                socket.emit('buttonOmdbData', errorStatus);
            })
        };
        runOmdb(data);
    });
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home',
        active: {
            home: true,
        }
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About',
        active: {
            about: true,
        },
    });
});

app.get('/contact', (req, res) => {
    res.render('contact.hbs', {
        pageTitle: 'Contact',
        active: {
            contact: true
        }
    });
});



//binding application to a port in heroku or our machine
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});