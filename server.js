const express = require('express');
var app = express();
const hbs = require('hbs'); //express view engine for handlebars
const fs = require('fs');
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const Twitter = require('twitter');
const Spotify = require('node-spotify-api');



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
                        tweetData = {
                            created: tweet.created_at,
                            text: tweet.text,
                            name: tweet.user.name,
                            screenName: tweet.user.screen_name,
                            image: tweet.user.profile_image_url,
                            favorite: tweet.favorited,
                            retweeted: tweet.retweeted,
                            quoted: tweet.is_quote_status
                        }
                        allTweets.push(tweetData);
                    });
                    socket.emit('buttonData', allTweets); //sends only to the one that requested it
                }
            });
        };
        runTwitter();
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

app.get('/info', (req, res) => {
    res.render('info.hbs', {
        pageTitle: 'Info',
        active: {
            info: true
        }
    });
});



//binding application to a port in heroku or our machine
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});