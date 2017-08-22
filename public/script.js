var socket = io.connect();
$('#twitterBtn').on('click', function () {
    $('#socket').remove();
    socket.emit('my-tweets');
});
$('#spotifyBtn').on('click', function () {
    $('#socket').remove();
    var query = $('#searchInput').val().trim();
    var encodedQuery = encodeURIComponent(query);
    socket.emit('spotify-this-song', encodedQuery);
});
$('#omdbBtn').on('click', function () {
    $('#socket').remove();
    var query = $('#searchInput').val().trim();
    var encodedQuery = encodeURIComponent(query);
    socket.emit('movie-this', encodedQuery);
});

socket.on('buttonTwitterData', function (data) {
    $('.inner-cover').addClass('mastAdjust');
    $('body').removeClass('bg-twitter-transparent').addClass('bg-twitter-transparent');
    $('html').removeClass('bg-twitter-transparent').addClass('bg-twitter-transparent');
    var grid = $('<div>');
    grid.attr('id', 'socket');
    data.forEach((tweet) => {
        var card = $('<div>');
        card.addClass('card text-left bg-twitter my-4 p-3 tweet').append(`<div class="card-block"><img class="float-left mr-3 rounded-circle profileImage" src="${tweet.image}"><a href="https://twitter.com/${tweet.screenName}" target="_blank"><h4>${tweet.name}</h4>` +
            `<h6 class="card-subtitle mb-2">@${tweet.screenName}</h6></a>` +
            `<p class="card-text ml-6rem">${tweet.text}</p>` +
            '<a href="#" class="card-link ml-6rem">Card link</a><a href="#" class="card-link ml-4rem">Another link</a></div>');
        grid.append(card);
    });
    $('.inner-cover').append(grid);
});

socket.on('buttonSpotifyData', function (data) {
    $('.inner-cover').addClass('mastAdjust');
    $('body').removeClass('bg-twitter-transparent');
    $('html').removeClass('bg-twitter-transparent');
    var grid = $('<div>');
    if (data === "error") {
        grid.attr('id', 'socket').addClass('container').append('<div id="songRow" class="row"><div class="col-12 col-sm-5 mt-4"><h3>No Search Results found</h3><p>Please make sure you search for another song.</p></div></div>');
        $('.inner-cover').append(grid);
    } else {
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
    }
});

socket.on('buttonOmdbData', function (data) {
    $('.inner-cover').addClass('mastAdjust');
    $('body').removeClass('bg-twitter-transparent');
    $('html').removeClass('bg-twitter-transparent');
    var grid = $('<div>');
    grid.attr('id', 'socket').addClass('container').append('<div id="movieRow" class="row"></div>');
    $('.inner-cover').append(grid);
    if (data === "error") {
        var errorColumn = $('<div>');
        errorColumn.addClass("col-12 col-sm-5 mt-4").append(`<h3>No Search Results found</h3><p>Please make sure you search for a movie.</p>`);
        $('#movieRow').append(errorColumn);
    } else {
        var imageColumn = $('<div>');
        imageColumn.addClass("col-12 col-sm-5 mt-4").append(`<img class="img-fluid moviePoster" src="${data.poster}" alt="movie poster">`);
        var infoColumn = $('<div>');
        infoColumn.addClass("col-12 col-sm-7 mt-4");
        var detailCard = $('<div>');
        detailCard.addClass('card text-left mx-auto movie').append(`<div class="card-block"><h6>${data.title} (${data.year})</h6>
        <p class="card-text">${data.plot}</p>
        <p class="card-text"><strong>Actors:</strong> ${data.actors}</p>
        <div class="text-center"><a href="${data.website}" target="_blank" class="btn btn-code mb-3">Visit Website</a></div>
        <div class="card-footer text-muted-omdb bg-transparent"><p>${data.imdbSource}: ${data.imdbRating}</p><p>${data.rottenSource}: ${data.rottenRating}</p><p>${data.metaSource}: ${data.metaRating}</p></div>`);
        infoColumn.append(detailCard);
        $('#movieRow').append(imageColumn, infoColumn);
    }
});