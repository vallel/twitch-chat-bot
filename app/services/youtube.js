var request = require('request');
var oauth = require('./oauth');

var searchApiUrl = 'https://www.googleapis.com/youtube/v3/search';

var youtube = {
    search: function(query, callback) {
        request(getSearchUrl(query), function(error, response, body) {
            if (error) {
                callback(error);
            }
            else {
                var data = {};
                try  {
                    data = JSON.parse(body);
                } catch(e) {
                    data = {};
                }

                if (response.statusCode == 200) {
                    callback(null, data);
                }
                else {
                    callback(data.error);
                }
            }
        });
    }
};

function getSearchUrl(query, maxResults) {
    var params = [
        'part=snippet',
        'type=video',
        'videoDuration=medium',
        'key=' + oauth.youtube.apiKey
    ];

    if (maxResults) {
        params.push('maxResults=' + maxResults);
    }

    if (query) {
        params.push('q=' + query);
    }

    return searchApiUrl + '?' + params.join('&');
}

module.exports = youtube;