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
function CouchDBProvider() {
}
util.inherits(CouchDBProvider, EventEmitter);
exports.CouchDBProvider = CouchDBProvider;

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
  
  var sourceUrl = url.format({
    protocol: 'http:',
    hostname: settings.host,
    port: settings.port,
    pathname: [settings.database, '_changes'].join('/'),
    query: {
      feed: 'continuous',
      include_docs: 'true'
    }
  });
  var changes = request({
    url: sourceUrl
  });
  var buffer = '';
  var self = this;
  changes.on('data', function (data) {
  console.log(data+'')
    var lines = (buffer + data).split('\n');
    for(var i = 0; i < lines.length - 1; i++) {
      if (lines[i]) {
        try {
          var notification = JSON.parse(lines[i]).doc;
          if (notification && notification.type === 'notification') {
            var text = notification.text;
            self.emit('notification', notification);
          }
        }
        catch (e) {
          provider.emit('error', e);
        }
      }
    }
    buffer = lines[lines.length - 1];
  });
  changes.on('end', function () {
    if (buffer) {
      try {
        var notification = JSON.parse(buffer).doc;
        if (notification && notification.type === 'notification') {
          var text = notification.text;
          self.emit('notification', notification);
        }
      }
      catch (e) {
        provider.emit('error', e);
      }
    }
  })
}