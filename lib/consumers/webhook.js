var request = require('request');

function install(provider) {
  var httpEndpoints = {}; 
  provider.on('user', function (user) {
    if (user.endpoints) {
      user.endpoints.forEach(function (endpoint) {
        if (endpoint.type === 'webhook') {
          httpEndpoints[endpoint.value] = true;
        }
      })
    }
  });
  provider.on('notification', function (msg) {
    if (msg && msg.text) {
      Object.keys(httpEndpoints).forEach(function(webhook) {
        request({
          url: webhook,
          json: msg
        });
      });
    }
  });
}

exports.install = install;