
var NodeTube = require('./lib/nodetube'),
    fs = require('fs'),
    ua = require('universal-analytics'),
    visitor = ua('UA-43412130-1'),    
    URL = require('url'),
    SIZE_LIMIT = (200 * 1024), // 200mb
    active = false;



    
/*
    Helper functions
*/

// Parses a given youtube url
// @return - (String) video id
function parseUrl (urlStr) {
    "use strict";
    
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
   "use strict";
   
    var fname = title.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
                
    fname = fname.replace(/ /g, '-') + '.' + ext;

    return fname;    
}


// Server error page
function errorPage (req, res, msg, fn) {
    "use strict";
    
    res.writeHead(500, {'Content-Type': 'text/html'});
    res.end('<p><span style="color:red">' + msg + '.</span> <a href="javascript:history.go(-1);">[ Back ]</a></p>'); 
    
    if (fn) {
        fn();
    }
}



/*
    Main function
*/ 

function Routes (req, res) {
    "use strict";
    
    var url = req.body.video, 
        format = req.body.format || 'flv',
        quality = req.body.quality || '18',
        contentType = (format === 'flv') ? 'video/x-flv' : 'video/mp4',
        stream,
        filename,
        vId = parseUrl(url),
        event = {},
        vUrl;

    
    if (!vId) {
        event.ec = 'Errors';
        event.ea = 'Downloading';
        event.el = 'VideoID';
        event.ev = vId;
        event.dp = '/download';
        
        visitor.event(params).send();
        
        errorPage(req, res, 'NodeTube does not understand the URL you entered');       
    }
    
    else if (active) {
        event.ec = 'Errors';
        event.ea = 'Concurrency';
        event.el = 'VideoID';
        event.ev = vId;
        event.dp = '/download';
        
        visitor.event(params).send();
        
        errorPage(req, res, 'This app is currently active and only allows one download at a time. Please try again later');       
    }
    
    else {
        vUrl = 'http://www.youtube.com/watch?v=' + vId;
        
        stream = new NodeTube(vUrl, {quality: quality});
        
        stream.on('error', function () {
            event.ec = 'Errors';
            event.ea = 'Streaming';
            event.el = 'VideoID';
            event.ev = vId;
            event.dp = '/download';
            
            visitor.event(params).send();
            
            errorPage(req, res, ':( An error occured while trying to fetch the video from YouTube'); 
        });
        
        stream.on('info', function (info, data) {
            filename = parseFilename(info.title, format);
            
            // if file is bigger than limit
            //if (data.size > SIZE_LIMIT) {
            if (!data.size) {
                event.ec = 'Errors';
                event.ea = 'Filesize';
                event.el = 'VideoID';
                event.ev = vId;
                event.dp = '/download';
                
                visitor.event(params).send();
                
                errorPage(req, res, 'The file you are trying to download is too big.');
            }
            else {
                active = true;
                
                res.writeHead(200, {
                    'Content-disposition': 'attachment; filename=' + filename,
                    'Content-Type': contentType,
                    'Content-Length': data.size
                });
                
                console.log('Downloading ' + filename + ' ...');
                
                stream.pipe(res, {end: false});
                
                event.ec = 'Downloads';
                event.ea = 'Downloaded';
                event.el = 'Video';
                event.ev = filename;
                event.dp = '/download';
                
                visitor.event(params).send();

                req.on('close', function (chunk) {
                    console.log('request cancelled');
                    stream.unpipe(res);     
                    stream.end();
                    res.end();
                });
                
                stream.on('data', function (chunk) {
                    console.log('got %d bytes of data', chunk.length);
                });
               

                stream.on('end', function () {
                    console.log('stream ended');
                    active = false;
                });
            }
        });
    }
}



module.exports.download = Routes;
module.exports.parseFilename = parseFilename;
module.exports.parseUrl = parseUrl;
module.exports.errorPage = errorPage;
