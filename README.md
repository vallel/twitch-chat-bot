twitch-chat-bot
===============
Simple chat bot for [Twitch](http://twitch.tv). This is still in development.

Current available commands:  
* **!songrequest** (or **!sr** for shorthand)  
    This command uses youtube search api for searching any input found after the command and adds the first video to a playlist (currently using localstorage)  
* **!currentsong**  
    The bot responds to this command and tells you the title of the current playing song (video) and the username of who added to the playlist  
* **!skip**  
    Add a vote to skip the current song. The song is skipped when vote count reach a predifined limit (currently 3).

I'm currently using [tmi.js](https://github.com/tmijs/tmi.js) library for the chat connection/interaction, youtube API for searching and playing videos. Playlist is being stored in localstorage but I'm planning on using node and move all the logic to the backend and use a database.

All messages are currently in spanish. I plan to make most of the stuff configurable on a web interface.

Any suggestions and/or advices are welcome :)
