var twitchbot = twitchbot || {};

(function() {
    twitchbot.youtube = {
        player,
        videoDone: false,

        init: function() {
            gapi.load('client', function() {
                gapi.client.init(
                    {'apiKey': twitchbot.oauth.youtubeKey}
                ).then(function() {
                    gapi.client.load('youtube', 'v3', function() {});
                });
            });
        },

        search: function(query, callback) {
            console.log(query);

            var request = gapi.client.youtube.search.list({
                q: query,
                part: 'snippet',
                type: 'video',
                // videoSyndicated: 'any',
                // videoEmbeddable: 'any',
                videoDuration: 'medium'
            });

            var video = null;

            request.execute(function (response) {
                if (response.result.items.length) {
                    var item = null;

                    var vetoList = twitchbot.data.getVetoList();

                    for (var i = 0; i < response.result.items.length; i++) {
                        if (vetoList.indexOf(response.result.items[i].id.videoId) == -1) {
                            item = response.result.items[i];
                            break;
                        }
                    }

                    if (item) {
                        video = {
                            id: item.id.videoId,
                            title: item.snippet.title
                        };

                        callback(video);
                    }
                }
            });
        },

        onYouTubeIframeAPIReady: function() {
            twitchbot.youtube.player = new YT.Player('js-youtube-player', {
                height: '390',
                width: '640',
                videoId: '',
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        },

        nextSong: function() {
            playNextSong();
        }
    };

    function onPlayerReady(event) {
        playNextSong();
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
          playNextSong();
        }
    }

    function stopVideo() {
        twitchbot.youtube.player.stopVideo();
    }

    function playNextSong() {
        var nextSong = twitchbot.data.nextSongRequest();

        if (nextSong) {
            twitchbot.youtube.player.cueVideoById({videoId: nextSong.video.id});
            twitchbot.youtube.player.playVideo();
        }
    }
})();


// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    twitchbot.youtube.onYouTubeIframeAPIReady();
}