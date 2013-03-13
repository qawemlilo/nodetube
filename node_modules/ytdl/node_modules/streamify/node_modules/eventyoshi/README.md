# eventyoshi [![Build Status](https://secure.travis-ci.org/fent/node-eventyoshi.png)](http://travis-ci.org/fent/node-eventyoshi)

Allows several event emitters to be handled and emitting to a single one.

![concept](https://github.com/fent/node-eventyoshi/raw/master/img/yoshi.png)

# Usage

```js
var EventEmtter = require('events').EventEmitter
  , EventYoshi = require('eventyoshi')

var ee1 = new EventEmitter();
var ee2 = new EventEmitter();
var yoshi = new EventYoshi()
  .add(ee1)
  .add(ee2)

yoshi.on('foo', function() {
  console.log('foo!');
});
ee1.emit('foo'); // foo!
ee2.emit('foo'); // foo!
```


# Why?
Why would you use this instead of doing something like

```js
ee1.on('foo', listener);
ee2.on('foo', listener);
```

Well, you could do that, or you could let EventYoshi handle all the logic for you flawlessly and without modifying the underlying child event emitters. EventYoshi can be treated as another EventEmitter. You can pass it around without having to tell whoever you passed it to what emitters you're listening to and which you aren't listening to anymore.

Same goes for events you might listen to or remove later. As you add more event emitters to event yoshi, it will add listeners that you were already listening for to the emitter you added.

```js
var yoshi = new EventYoshi();
yoshi.on('a', function() {
  console.log('a emitted');
});

var ee = new EventEmitter();
yoshi.add(ee);

ee.emit('a'); // a emitted
```

And as you remove emitters, all listeners that were added through event yoshi are removed too.

```js
yoshi.remove(ee);
ee.emit('a'); // nothing emitted on yoshi
```

EventYoshi also supports the `once` method. It supports listening to `newListener` such that it is emitted only when listeners are added to your EventYoshi instance and not when they are added to child emitters.


# API

### yoshi.add(emitter)
Adds an event emitter to an event yoshi.

### yoshi.remove(emitter)
Remove an event emitter from an event yoshi.

### yoshi.proxy(fn)
Proxies all calls from to `yoshi[fn]` to its children.
```js
yoshi.add(writeStream);
yoshi.proxy('write', 'end');

yoshi.write(data); // this will call writeStream.write() with data
yoshi.end(); // will call writeStream.end()
```

When the proxy'd functions are called, they return the values returned from called functions in an array. If the array's length is only 1, returns only the first value.


## Events

When events are emitted, `this.child` will contain the child emitter the event came from. Or in case of `newListener` event, will contain the event yoshi itself.

```js
yoshi.on('event', function() {
  console.log('Event came from: ', this.child);
});
```

### Event: 'newListener'
`function (event, listener) { }`

Emitted when a listener is added to an event yoshi.

### Event:  'newChildListener'
`function (event, listener) { }`

Emitted when a listener is added to an event emitter that has been added to, and not removed from, an event yoshi. Does not emit listeners added by EventYoshi.


# Install

    npm install eventyoshi


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```

# License
MIT
