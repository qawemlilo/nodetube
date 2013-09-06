var NodeTube = require('./lib/nodetube'),
    fs = require('fs'),
    parseFilename = require('./routes').parseFilename,
    config = require('./config.json'),
    
    videos = config.videos,
    folder = config.folder;
    

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, 0777);
}
   
videos.forEach(function (url) {
    "use strict";
    
    var download,
        writeStream;
    
    download = new NodeTube(url, {quality: config.quality});
    
    download.on('info', function (info, data) {
        var filename = parseFilename(info.title, config.format);
        
        writeStream = fs.createWriteStream(folder + filename);
    
        download.on('progress', function (progress) { 
            if (progress == '100%') {
                console.log(filename + ' download complete!');
            } 
        });
        
        console.log('Downloading ' + filename + ' (' + data.size + 'kb)');
        download.pipe(writeStream);
    });
});
