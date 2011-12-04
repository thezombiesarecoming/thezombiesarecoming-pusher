var request = require('request'),
  url = require('url');
  

function install(provider) {
  var listingUrl = provider.config.get('http-listing:url');
  var changes = request({
    url: listingUrl
  });
  var buffer = '';
  var self = provider;
  changes.on('data', function (data) {
    var lines = (buffer + data).split('\n');
    for(var i = 0; i < lines.length - 1; i++) {
      if (lines[i]) {
        try {
          var endpoint = JSON.parse(lines[i]).doc;
          if (endpoint && endpoint.type === 'endpoint') {
            var text = endpoint.text;
            self.emit('endpoint', endpoint);
          }
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
        var endpoint = JSON.parse(buffer).doc;
        if (endpoint && endpoint.type === 'endpoint') {
          var text = endpoint.text;
          self.emit('endpoint', endpoint);
        }
      }
      catch (e) {
        provider.emit('error', e);
      }
    }
  })
}
exports.install = install;
