var Stream = require('stream').Stream
  , util = require('util')


/**
 * @constructor
 * @extends Stream
 */
var EventYoshi = module.exports = function() {
  this.children = [];
  this.__listeners = [];
  this.__wrappers = {};
  this.__lastEvent = null;
  this._events = {};
};

util.inherits(EventYoshi, Stream);


/**
 * Adds an event emitter to eventyoshi
 * @param (EventEmitter) ee
 * @return (EventYoshi)
 */
EventYoshi.prototype.add = function(ee) {
  if (this.children.indexOf(ee) === -1) {
    var self = this;

    // iterate through list of already listened to events
    // and listen to them on the newly added emitter
    Object.keys(self._events).forEach(function(event) {
      ee.on(event, self.__wrappers[event]);
    });

    // listen for new listeners after adding all previous event listeners
    var listen = function(event, listener) {

      // do not emit `newChildListener` event if this listener
      // was added by eventyoshi
      if (self.__wrappers[event] === listener) return;

      self.child = ee;
      self._emit('newChildListener', event, listener);
      self.child = null;
    };

    ee.on('newListener', listen);
    this.__listeners.push(listen);

    this.children.push(ee);
  }

  return this;
};


/**
 * Remove an event emitter from eventyoshi
 * remove all of the listeners that were added by eventyoshi
 * @param (EventEmitter) ee
 * @return (EventYoshi)
 */
EventYoshi.prototype.remove = function(ee) {
  var i;
  if ((i = this.children.indexOf(ee)) !== -1) {
    var self = this;
    Object.keys(self._events).forEach(function(event) {
      ee.removeListener(event, self.__wrappers[event]);
    });

    // remove newListener listener from event emitter
    ee.removeListener('newListener', this.__listeners[i]);
    this.__listeners.splice(i, 1);

    this.children.splice(i, 1);
  }

  return this;
};


/**
 * Keep a copy of old EventEmitter functions
 * when the new functions are called publicly they will
 * be proxied to the emitters
 */
['addListener', 'on', 'once', 'emit', 'removeListener',
 'removeAllListeners', 'setMaxListeners'].forEach(function(fn) {
  EventYoshi.prototype['_' + fn] = EventYoshi.prototype[fn];
});


/**
 * Adds listener to event emitters
 *
 * All event handling functions deal with
 * the special `newListener` event
 * in that case, it's treated only on eventyoshi
 * and not the rest of the emitters
 *
 * @param (string) event
 * @param (function) listener
 * @override
 */
EventYoshi.prototype.on = function(event, listener) {
  if (event === 'newListener' || event === 'newChildListener') {
    this._on(event, listener);
    return;
  }

  if (this.__wrappers[event] === undefined) {

    // proxy events emitted from each emitter onto eventyoshi
    // with a wrapper function
    var self = this;
    var wrapper = this.__wrappers[event] = function() {

      // skip events emitted to yoshi
      if (self.__lastEvent === event) return;

      self.child = this;
      self._emit.apply(self,
           [event].concat(Array.prototype.slice.call(arguments)));
      self.child = null;
    };

    this.children.forEach(function(ee) {
      ee.on(event, wrapper);
    });
  }

  this.child = this;
  this._on(event, listener);
  this.child = null;
};

/**
 * @alias EventYoshi.prototype.addListener
 */
EventYoshi.prototype.addListener = EventYoshi.prototype.on;


/**
 * @param (string) event
 * @param (function) listener
 * @override
 */
EventYoshi.prototype.once = function(event, listener) {
  var self = this;
  var wrapper = function() {
    self.removeListener(event, wrapper);
    listener.apply(self, arguments);
  };

  wrapper.listener = listener;

  self.on(event, wrapper);
};


/**
 * removeListener and removeAllListeners must iterate through
 * the list of previously added listeners,
 * remove the wrapper from the emitters
 * and remove the listener from eventyoshi
 *
 * @param (string) event
 * @param (function) listener
 * @override
 */
EventYoshi.prototype.removeListener = function(event, listener) {
  if (event === 'newListener' || event === 'newChildListener') {
    this._removeListener(event, listener);
    return;
  }

  this._removeListener(event, listener);

  // check if wrapper needs to be removed
  // by checking if there are anymore listeners for this event
  var wrapper = this.__wrappers[event];
  if (this._events[event] === undefined && wrapper !== undefined) {
    this.children.forEach(function(ee) {
      ee.removeListener(event, wrapper);
    });
    delete this.__wrappers[event];
  }
};


/**
 * @param (string) event Optional event. If not given in node >= v0.6,
 *   removes all events in emitter.
 * @override
 */
EventYoshi.prototype.removeAllListeners = function(event) {
  if (event != null) {
    if (event === 'newListener' || event === 'newChildListener') {
      this._removeAllListeners(event);
      return;
    }

    var ev;
    if ((ev = this._events[event]) !== undefined) {
      this.children.forEach(function(ee) {
        ee.removeAllListeners(event);
      });
      this._removeAllListeners(event);
    }

  } else {
    this.children.forEach(function(ee) {
      ee.removeAllListeners();
    });
    this._removeAllListeners();
  }
};


/**
 * Proxy the rest of EventEmitter's functions from eventyoshi
 * to all of the emitters added
 * Note that addListener/on cannot simply be proxied due to
 * once and the `addListener` event
 * 
 * @param (number) n
 */
EventYoshi.prototype.setMaxListeners = function(n) {
  this._setMaxListeners(n);
  this.children.forEach(function(ee) {
    ee._setMaxListeners(n);
  });
};


/**
 * @param (string) event
 * @param (Object...) args
 */
EventYoshi.prototype.emit = function(event) {
  var args = arguments;
  this._emit.apply(this, args);
  if (event === 'newListener') return;

  this.__lastEvent = event;

  this.children.forEach(function(ee) {
    ee.emit.apply(ee, args);
  });

  this.__lastEvent = null;
};


/**
 * Proxy custom functions
 * @param (string...) funcs
 */
EventYoshi.prototype.proxy = function() {
  var self = this;

  Array.prototype.slice.call(arguments).forEach(function(fn) {
    self[fn] = function() {
      var args = arguments;
      var rs = [];

      self.children.forEach(function(ee) {
        if (typeof ee[fn] === 'function') {
          rs.push(ee[fn].apply(ee, args));
        }
      });

      return rs.length === 1 ? rs[0] : rs;
    };
  });
};
