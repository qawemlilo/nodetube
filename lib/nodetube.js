
var ytdl = require('ytdl'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter;


/*

*/
function NodeTube (url, options) {
    return ytdl.call(this, url, options);
}




/*
    Inherit from EventEmitter
*/
util.inherits(NodeTube, EventEmitter);




module.exports = NodeTube;




