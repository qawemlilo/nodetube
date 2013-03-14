var ytdl = require('ytdl'),
    EventEmitter = require('events').EventEmitter;


function Download (url) {
    var readStream = ytdl(url, {quality: 'lowest'}),
        dataRead = 0,
        progress = 0,
        self = this;
        
    self.progress = 0;
   
    readStream.on('info', function (info, format) {
        readStream.on('data', function (data) {
            dataRead += data.length;
    
            var percent = dataRead / format.size;
            
            progress = Math.floor(percent * 100); 
            
            if (progress > self.progress) {
                readStream.emit('progress', progress + '%');
                self.progress = progress;
            }
        });
    });
    
    return readStream;
}

Download.prototype = EventEmitter.prototype;

module.exports = Download;




