var http = require('http'),
    connect = connect = require('connect'),
    Download = require('./download'),
    port = process.env.PORT || 3030;
    
    
var app = connect()
    .use(connect.static('app')) // uncomment when deploying
    .use(connect.bodyParser())
    .use('/download', download);


http.createServer(app).listen(port, function() {
  console.log('App running at http://localhost:%s', port);
});



function download (req, res) {
    var url = req.body.video, content;
    
    res.writeHead(200, {
        'Content-disposition': 'attachment; filename=nodetube.flv',
        'Content-Type': 'video/x-flv'
    }); 
    content = new Download(url);
    
    content.on('progress', function (progress) { console.log(progress); });
    content.pipe(res);
}
