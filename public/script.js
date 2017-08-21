var socket = io.connect();
$('#twitterBtn').on('click', function () {
    socket.emit('my-tweets');
});

socket.on('buttonData', function (data) {
    $('.inner-cover').addClass('mastAdjust');
    data.forEach((tweet) => {
        var card = $('<div>');
        card.addClass('card text-left bg-info my-4 mx-4rem p-3').append(`<div class="card-block"><img class="float-left mr-3 rounded-circle" src="${tweet.image}"><a href="https://twitter.com/${tweet.screenName}" target="_blank"><h4>${tweet.name}</h4>`
        + `<h6 class="card-subtitle mb-2">@${tweet.screenName}</h6></a>`
        + `<p class="card-text ml-4rem">${tweet.text}</p>`
        + '<a href="#" class="card-link ml-4rem">Card link</a><a href="#" class="card-link ml-4rem">Another link</a></div>');
        $('.inner-cover').append(card);
    })

});


