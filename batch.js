
var ytdl = require('ytdl-core');
var fs = require('fs');
var parseFilename = require('./routes').parseFilename;
var config = require('./config.json');
var videos = config.videos;
var folder = config.folder;
var ProgressBar = require('progress');


if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, 0777);
}

function exec() {
    "use strict";

    if (!videos.length) {
      return;
    }

    var download;
    var writeStream;
    var url = videos.pop();
    var filename;



    download = ytdl(url, {quality: config.quality});

    download.on('info', function (info, data) {

        console.log('');

        var bar = new ProgressBar('downloading [:bar] :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 30,
          total: parseInt(data.size, 10)
        });

        filename = parseFilename(info.title, config.format);

        writeStream = fs.createWriteStream(folder + filename);

        download.on('data', function (progress) {
           bar.tick(progress.length);
        });

        download.pipe(writeStream);
    });

    download.on('end', function () {
        console.log(filename + ' download complete!');
        console.log('');
        exec();
    });
}

exec();
