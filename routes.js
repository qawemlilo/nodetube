"use strict";

var ytdl = require('ytdl-core');
var fs = require('fs');
var URL = require('url');
var active = false;




/*
    Helper functions
*/

// Parses a given youtube url
// @return - (String) video id
function parseUrl (urlStr) {

    var urlObject = URL.parse(urlStr, true),
        regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        match = urlStr.match(regExp),
        vId = false;

    if (urlObject.query.v) {
        vId = urlObject.query.v;
    }
    else if (match && match[7].length === 11) {
        vId = match[7];
    }

    return vId;
}


// Parses a video title and concatenates the video extension
// @return - (String) clean video filename
function parseFilename (title, ext) {

    var fname = title.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    fname = fname.replace(/ /g, '-') + '.' + ext;

    return fname;
}


// Server error page
function errorPage (req, res, msg, fn) {
    res.writeHead(500, {'Content-Type': 'text/html'});
    res.end('<p><span style="color:red">' + msg + '.</span> <a href="javascript:history.go(-1);">[ Back ]</a></p>');

    if (fn) {
        fn();
    }
}



/*
    Main function
*/

function download (req, res, next) {

  console.log('download called');

  var url = req.body.video,
      format = req.body.format || 'flv',
      quality = req.body.quality || '18',
      contentType = (format === 'flv') ? 'video/x-flv' : 'video/mp4',
      stream,
      filename,
      vId = parseUrl(url),
      vUrl;


  if (!vId) {
      return errorPage(req, res, 'NodeTube does not understand the URL you entered');
  }

  else if (active) {
      return errorPage(req, res, 'This app is currently active and only allows one download at a time. Please try again later');
  }

  else {
    vUrl = 'https://www.youtube.com/watch?v=' + vId;

    stream = ytdl(vUrl, {quality: quality});

    stream.on('error', function (error) {
        console.error(error);
        errorPage(req, res, ':( An error occured while trying to fetch the video from YouTube');
        active = false;
    });

    stream.on('progress', function(chunkLength, downloaded, total) {
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write((downloaded / total * 100).toFixed(2) + '% ');
    });

    stream.on('info', function (info, data) {
      filename = parseFilename(info.title, format);

      // if file is bigger than limit
      active = true;

      res.writeHead(200, {
          'Content-disposition': 'attachment; filename=' + filename,
          'Content-Type': contentType
      });

      stream.pipe(res);

      req.on('close', function (chunk) {
          console.log('request cancelled');
          stream.unpipe(res);
          stream.end();
          res.end();
      });


      stream.on('end', function () {
          console.log('stream ended \n');
          active = false;
          res.end();
      });
    });
  }
}



module.exports.download = download;
module.exports.parseFilename = parseFilename;
module.exports.parseUrl = parseUrl;
module.exports.errorPage = errorPage;
