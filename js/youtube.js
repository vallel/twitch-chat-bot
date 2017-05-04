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
            var request = gapi.client.youtube.search.list({
                q: query,
                part: 'snippet',
                type: 'video',
                videoSyndicated: true,
                videoEmbeddable: true,
                videoDuration: 'medium'
            });

            var video = null;

            request.execute(function (response) {
                if (response.result.items.length) {
                    var item = response.result.items[0];
                    
                    video = {
                        id: item.id.videoId,
                        title: item.snippet.title
                    };

                    callback(video);
                }
            });
        },

        onYouTubeIframeAPIReady: function() {
            twitchbot.youtube.player = new YT.Player('js-youtube-player');
            // , {
            //     height: '390',
            //     width: '640',
            //     videoId: 'M7lc1UVf-VE',
            //     events: {
            //         'onReady': onPlayerReady,
            //         'onStateChange': onPlayerStateChange
            //     }
            // });
        }
    };

    function onPlayerReady(event) {
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        
    }

    function stopVideo() {
        twitchbot.youtube.player.stopVideo();
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