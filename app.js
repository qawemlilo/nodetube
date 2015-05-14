var http = require('http'),
    connect = require('connect'),
    routes = require('./routes'),
    port = process.env.PORT || 3030;
    
    
var app = connect()
    .use(connect.static('app'))
    .use(connect.compress()) 
    .use(connect.bodyParser())
    .use('/download', routes.download);


http.createServer(app).listen(port, function() {
  console.log('App running at http://localhost:%s', port);
});