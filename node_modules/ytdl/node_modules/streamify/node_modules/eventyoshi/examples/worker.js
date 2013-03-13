//
// This worker performs some arbitrary job for its master
// in this case it's generating a random number between 0 and 10000
// and taking some random time at it
//

setTimeout(function() {
  process.send(Math.floor(Math.random() * 10001));
}, Math.floor(Math.random() * 5000));
