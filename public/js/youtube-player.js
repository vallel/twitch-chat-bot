var twitchBot = twitchBot || {};
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
    twitchBot.youtube.currentState = event.data;
    if (event.data == YT.PlayerState.ENDED) {
        twitchBot.songRequest.updateCurrentSong(function(song) {
            player.loadVideoById(song.songId);
        });
    }
}

twitchBot.youtube = {
    currentState: null,

    setVolume: function (volume) {
        var result = false;

        volume = volume >= 0 && volume <= 100 ? volume : null;
        if (volume) {
            player.setVolume(volume);
            result = true;
        }

        return result;
    },

    getVolume: function(fn) {
        console.log(fn);
        if (fn) {
            fn(player.getVolume());
        }
    },

    skipSong: function () {
        twitchBot.songRequest.updateCurrentSong(function(song) {
            player.loadVideoById(song.songId);
        });
    },

    play: function () {
        player.playVideo();
    },

    stop: function () {
        player.stopVideo();
    },

    pause: function () {
        player.pauseVideo();
    },

    update: function() {
        if (twitchBot.youtube.currentState == YT.PlayerState.ENDED || twitchBot.youtube.currentState == YT.PlayerState.UNSTARTED) {
            twitchBot.youtube.skipSong();
        } else {
            twitchBot.songRequest.updatePlayList();
        }
    }
};