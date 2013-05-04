var http = require('http'),
    connect = connect = require('connect'),
    Download = require('./download'),
    port = process.env.PORT || 3030;
    
    
var app = connect()
    .use(connect.static('app')) 
    .use(connect.bodyParser())
    .use('/download', download);


http.createServer(app).listen(port, function() {
  console.log('App running at http://localhost:%s', port);
});



function download (req, res) {
    var url = req.body.video, 
        format = req.body.format || 'flv',
        quality = req.body.quality || '18',
        contentType = (format === 'flv') ? 'video/x-flv' : 'video/mp4',
        content;
    
    if (!url) {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('<p>You did not include a video url. <a href="javascript:history.go(-1);">[ Back ]</a></p>');       
    }
    else {
        content = new Download(url, {quality: quality});
        
        content.on('info', function (info, data) {
            res.writeHead(200, {
                'Content-disposition': 'attachment; filename=' + (info.title.replace(/ /g, '-')) + '.' + format,
                'Content-Type': contentType,
                'Content-Length': data.size
            });           

            content.pipe(res);
        });
    }
}
