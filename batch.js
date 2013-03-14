var Download = require('./download'),
    fs = require('fs'),
    config = require('./config'),
    
    videos = config.videos,
    folder = config.folder
    counter = 1;
    

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, 0777);
}
   
videos.forEach(function (url) {
    var download, 
        path = folder + '/video_' + counter + '.flv',
        writeStream = fs.createWriteStream(path);
    
    download = new Download(url);
    
    download.on('progress', function (progress) { 
        if (progress == '100%') {
            console.log(path + ' download complete!');
        } 
    });
    
    console.log('Downloading ' + url + ' to ' + path);
    
    download.pipe(writeStream);
    
    counter++;
});
