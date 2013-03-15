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
        content;
    
    if (!url) {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('<p>You did not include a video url. <a href="javascript:history.go(-1);">[ Back ]</a></p>');       
    }
    else {
        content = new Download(url);
        
        content.on('info', function (info, data) {
            res.writeHead(200, {
            'Content-disposition': 'attachment; filename=nodetube.' + format,
            'Content-Type': 'video/x-flv',
            'Content-Length': data.size
            });           
    
            content.on('progress', function (progress) { console.log(progress); });
            content.pipe(res);
        });
    }
}
