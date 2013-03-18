var ytdl = require('ytdl'),
    EventEmitter = require('events').EventEmitter,
    ProgressBar = require('progress');


function Download (url, options) {
    var readStream = ytdl(url, options),
        dataRead = 0,
        progress = 0,
        self = this; 
        
    self.progress = 0;
   
    readStream.on('info', function (info, format) {
        var bar = new ProgressBar('  downloading [:bar] :percent :etas', {complete: '=', incomplete: ' ', width: 40, total: parseInt(format.size, 10)});
        
        readStream.on('data', function (data) {
            bar.tick(data.length);
        });
        
        readStream.on('end', function(){
            console.log('\n');
        });
    });
    
    return readStream;
}

Download.prototype = EventEmitter.prototype;

module.exports = Download;




