var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('js-youtube-player', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    player.setVolume(30);
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        twitchBot.songRequest.updateCurrentSong(function(song) {
            player.loadVideoById(song.videoId);
        });
    }
}