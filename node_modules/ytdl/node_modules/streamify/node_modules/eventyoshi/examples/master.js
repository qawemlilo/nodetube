var fork = require('child_process').fork;
var yoshi = new(require('..'));


// spawn 5 workers
var NUMBER = 5;
for (var i = 0; i < NUMBER; i++) {
  yoshi.add(fork(__dirname + '/worker.js'));
}


// wait to receive messages from workers
yoshi.on('message', function(m) {
  console.log(m);
  this.child.kill();
});
