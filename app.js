var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var routes = require('./routes');
var port = process.env.PORT || 3030;


var app = connect();

app.use(serveStatic('app'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/download', routes.download);


http.createServer(app).listen(port, function() {
  console.log('App running at http://localhost:%s', port);
});
