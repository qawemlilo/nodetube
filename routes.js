
var Download = require('./download'),
    fs = require('fs'), 
    active = false;
 
 
function Main (req, res) {
    var url = req.body.video, 
        format = req.body.format || 'flv',
        quality = req.body.quality || '18',
        contentType = (format === 'flv') ? 'video/x-flv' : 'video/mp4',
        stream;
    
    if (!url) {
        errorPage(req, res, 'You did not include a video url');       
    }
    else if (active) {
        errorPage(req, res, 'This app is currently active and only allows one download at a time. Please try again later');       
    }
    else {
        stream = new Download(url, {quality: quality});
        
        stream.on('info', function (info, data) {
            var title = info.title.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''),
                filename = title.replace(/ /g, '-') + '.' + format,
                localfile;
            
            console.log(data.size);
            
            if (data.size > 209715200) {
                errorPage(req, res, 'The file you are trying to download is too big.');
            }
            else {
                active = true;
                
                res.writeHead(200, {
                    'Content-disposition': 'attachment; filename=' + filename,
                    'Content-Type': contentType,
                    'Content-Length': data.size
                });
                
                localfile = fs.createWriteStream('./downloads/' + filename);
                
                stream.pipe(res, {end: false});
                
                stream.on('data', function (chunk) {
                    localfile.write(chunk);    
                });

                
                stream.on('end', function () {
                    active = false;
                });
            }
        });
    }
}

function log(url) {
    var time = Date.now()
        
}




function errorPage (req, res, msg, fn) {
    res.writeHead(500, {'Content-Type': 'text/html'});
    res.end('<p>' + msg + '. <a href="javascript:history.go(-1);">[ Back ]</a></p>'); 
    
    if (fn) {
        fn();
    }
}



module.exports.download = Main;
