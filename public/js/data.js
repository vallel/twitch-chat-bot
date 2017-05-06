var twitchbot = twitchbot || {};

(function() {
    twitchbot.data = {
        getSongRequests: function() {
            var data = getData('songrequest');

            return data ? data : [];
        },

        storeSongRequests: function(songRequests) {
            var data = Array.isArray(songRequests) ? songRequests : [songRequests];

            storeData('songrequest', data);
        },

        addSongRequest: function(user, video) {
            var data = {
                user: user,
                video: video,
                date: new Date()
            };

            addData('songrequest', data);
        },

        nextSongRequest: function() {
            var songs = twitchbot.data.getSongRequests(),
                nextSong = songs.shift();

            twitchbot.data.storeSongRequests(songs);
            twitchbot.data.setCurrentSong(nextSong);

            return nextSong;
        },

        setCurrentSong: function(song) {
            storeData('currentSong', song);
        },

        getCurrentSong: function() {
            return getData('currentSong');
        }
    };

    /**
     * @param {string} key 
     */
    function getData(key) {
        var data = localStorage.getItem(key);

        return data ? JSON.parse(data) : null;
    }

    /**
     * @param {string} key 
     * @param {json} data 
     */
    function storeData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * @param {string} key 
     * @param {object} data 
     */
    function addData(key, data) {
        var currentData = getData(key);
        
        if (Array.isArray(currentData)) {
            currentData.push(data);
        } else if (currentData) {
            [currentData].push(data);
        } else {
            currentData = [data];
        }

        storeData(key, currentData);
    }

})();