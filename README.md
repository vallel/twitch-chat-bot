twitch-chat-bot
===============
Simple chat bot for [Twitch](http://twitch.tv).

Current available commands:

* **!songrequest** (or **!sr** for shorthand)  
    This command uses youtube search api for searching any input found after the command and adds the first video to a playlist (currently using localstorage)  
* **!currentsong**  
    The bot responds to this command and tells you the title of the current playing song (video) and the username of who added to the playlist  

* **!skip**  
    Add a vote to skip the current song. The song is skipped when vote count reach a predifined limit (currently 3).

* **!points**
    To know your current points. Each user gets 1 point for every minute that spents on the stream.

* **!gamble**  
    If enabled, you can gamble a given amount (as parameter) of your points. There is a cooldown to run this command that can be configured.

Commands for mods:

* **!play**  
    Start playing the *songrequest* playlist if it was stopped or paused.

* **!stop**  
    Stop the music.   

* **!pause**  
    Pauses the music.

* **!volume**  
    Change the volumen of the youtube player (*songrequest*). This command needs an integer from 0 to 100 as a parameter as the value that is going to be setted as volume.

I'm currently using [tmi.js](https://github.com/tmijs/tmi.js) library for the chat connection/interaction, youtube API for searching and playing videos and sqlite as database.

All messages are currently in spanish but I plan to make most of the stuff configurable on a web interface.

Any suggestions and/or advices are welcome :)

