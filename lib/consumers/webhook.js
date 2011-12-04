var request = require('request');

function install(provider) {
  var httpEndpoints = {}; 
  provider.on('endpoint', function (endpoint) {
    if (endpoint && endpoint.method === 'webhook') {
      httpEndpoints[endpoint.value] = true;
    }
  });
  provider.on('notification', function (msg) {
    console.error(arguments)
    if (msg && msg.text) {
      Object.keys(httpEndpoints).forEach(function(webhook) {
        request({
          method: 'POST',
          url: webhook,
          json: msg
        }).pipe(process.stdout);
      });
    }
  });
}

exports.install = install;