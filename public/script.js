var socket = io.connect();
$('#twitterBtn').on('click', function () {
    $('#socket').remove();
    socket.emit('my-tweets');
});
$('#spotifyBtn').on('click', function() {
    $('#socket').remove();    
    var query = $('#searchInput').val().trim();
    var encodedQuery = encodeURIComponent(query);
    socket.emit('spotify-this-song', encodedQuery);
});
$('#omdbBtn').on('click', function() {
    $('#socket').remove();    
    var query = $('#searchInput').val().trim();
    var encodedQuery = encodeURIComponent(query);
    socket.emit('movie-this', encodedQuery);
});

socket.on('buttonTwitterData', function (data) {
    $('.inner-cover').addClass('mastAdjust');
    var grid = $('<div>');
    grid.attr('id', 'socket');
    data.forEach((tweet) => {
        var card = $('<div>');
        card.addClass('card text-left bg-info my-4 mx-4rem p-3').append(`<div class="card-block"><img class="float-left mr-3 rounded-circle" src="${tweet.image}"><a href="https://twitter.com/${tweet.screenName}" target="_blank"><h4>${tweet.name}</h4>`
        + `<h6 class="card-subtitle mb-2">@${tweet.screenName}</h6></a>`
        + `<p class="card-text ml-4rem">${tweet.text}</p>`
        + '<a href="#" class="card-link ml-4rem">Card link</a><a href="#" class="card-link ml-4rem">Another link</a></div>');
        grid.append(card);
    });
    $('.inner-cover').append(grid);
});

socket.on('buttonSpotifyData', function(data){
    $('.inner-cover').addClass('mastAdjust');
    var grid = $('<div>');
    grid.attr('id', 'socket');
    data.forEach((song) => {
        var card = $('<div>');
        card.addClass('card text-left my-4 mx-auto audio').append(`<img class="card-img-top albumImage" src="${song.albumImage}" alt="Card image cap"><div class="card-block"><h4>${song.song}</h4>
        <h6 class="card-subtitle mb-2">By: ${song.artist}</h6>
        <audio class="w-100" controls name="media"><source src="${song.previewLink}" type="audio/mpeg">
        Your browser does not support the <code>audio</code> element.</audio></div>`);
        grid.append(card);
    });
    $('.inner-cover').append(grid);
});

socket.on('buttonOmdbData', function(data){

    $('.inner-cover').addClass('mastAdjust');
    var grid = $('<div>');
    grid.attr('id', 'socket').addClass('container').append('<div id="movieRow" class="row"></div>');
    $('.inner-cover').append(grid);
    var imageColumn = $('<div>');
    imageColumn.addClass("col-6 mt-4").append(`<img class="img-fluid moviePoster" src="${data.poster}" alt="movie poster">`);
    var infoColumn = $('<div>');
    infoColumn.addClass("col-6 mt-4");
    var detailCard = $('<div>');
    detailCard.addClass('card text-left mx-auto movie').append(`<div class="card-block"><h6>${data.title} (${data.year})</h6>
    <p class="card-text">${data.plot}</p>
    <p class="card-text"><strong>Actors:</strong> ${data.actors}</p>
    <div class="text-center"><a href="${data.website}" target="_blank" class="btn btn-primary mb-3">Visit Website</a></div>
    <div class="card-footer text-muted bg-transparent"><p>${data.imdbSource}: ${data.imdbRating}</p><p>${data.rottenSource}: ${data.rottenRating}</p><p>${data.metaSource}: ${data.metaRating}</p></div>`);
    infoColumn.append(detailCard);
    $('#movieRow').append(imageColumn, infoColumn);
});