var ytdl = require('ytdl'),
    EventEmitter = require('events').EventEmitter,
    ProgressBar = require('progress');


function Download (url, options) {
    var readStream = ytdl(url, options);
    
    return readStream;
}

Download.prototype = EventEmitter.prototype;

module.exports = Download;




