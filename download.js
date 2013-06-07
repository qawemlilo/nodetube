
var ytdl = require('ytdl'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;


/*

*/
function download (url, options) {
    var readStream = ytdl(url, options);
    
    return readStream;
}




/*
    Inherit from EventEmitter
*/
util.inherits(download, EventEmitter);




module.exports = download;




