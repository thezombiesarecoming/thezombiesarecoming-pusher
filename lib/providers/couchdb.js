var request = require('request'),
  url = require('url'),
  util = require('util'),
  EventEmitter = require('eventemitter2').EventEmitter2;

//
// options
//   auth : {
//     username : ""
//     password : ""
//   }
//   host : "" || 127.0.0.1
//   port : "" || 5984
//
function CouchDBProvider(options) {
  this.system = options.system;
  this.paused = false;
  this.buffer = [];
}
util.inherits(CouchDBProvider, EventEmitter);
exports.CouchDBProvider = CouchDBProvider;

CouchDBProvider.prototype.pause = function pause() {
  this.paused = true;
}
CouchDBProvider.prototype.push = function push(msg) {
  this.buffer.push(msg);
  this.flush();
}
CouchDBProvider.prototype.resume = function resume() {
  this.paused = false;
  this.flush();
}
CouchDBProvider.prototype.flush = function flush() {
  if (this.paused) {
    return;
  }
  for(var i = 0; i < this.buffer.length; i++) {
    var body = this.buffer[i];
    var seq = this.system.set('history:last', body.seq);
    var notification = body.doc;
    if (notification && notification.type === 'notification') {
      var text = notification.text;
      this.emit('notification', notification);
    }
  }
  this.system.save(function(){});
  this.buffer = [];
}

CouchDBProvider.prototype.listen = function listen(options) {
  options = options || {};
  var settings = {
    host: (options.host || '127.0.0.1') + '',
    port: +(options.port || 5984),
    database: options.database
  }
  if (options.auth) {
    settings.auth = {};
    settings.auth.username = options.auth.username;
    settings.auth.password = options.auth.password;
  }
  options = null;
  
  var param = {
    feed: 'continuous',
    include_docs: 'true'
  };
  var since = this.system.get('history:last');
  if (since) {
    param.since = since;
  }
  var sourceUrl = url.format({
    protocol: 'http:',
    hostname: settings.host,
    port: settings.port,
    pathname: [settings.database, '_changes'].join('/'),
    query: param
  });
  var changes = request({
    url: sourceUrl
  });
  var buffer = '';
  var self = this;
  changes.on('data', function (data) {
    var lines = (buffer + data).split('\n');
    for(var i = 0; i < lines.length - 1; i++) {
      if (lines[i]) {
        try {
          var body = JSON.parse(lines[i]);
          self.push(body);
        }
        catch (e) {
          self.emit('error', e);
        }
      }
    }
    buffer = lines[lines.length - 1];
  });
  changes.on('end', function () {
    if (buffer) {
      try {
        var body = JSON.parse(buffer);
        self.push(body);
      }
      catch (e) {
        provider.emit('error', e);
      }
    }
  })
}