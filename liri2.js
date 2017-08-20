const inquirer = require('inquirer');

const commands = require('./commands.js');

var question = [{
    name: 'command',
    message: 'Which command do you want to run?',
    type: 'list',
    choices: [
        'my-tweets',
        'spotify-this-song',
        'movie-this',
        'do-what-it-says'
    ]
}, {
    name: 'query',
    message: 'Type in your search.',
    when: function (answers) {
        if (answers.command === 'spotify-this-song' || answers.command === 'movie-this') {
            return true;
        }
    }
}];

var app = () => {
    inquirer.prompt(question).then(function (answers) {
        var command = answers.command;
        var query = answers.query;
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
    });
};
app();