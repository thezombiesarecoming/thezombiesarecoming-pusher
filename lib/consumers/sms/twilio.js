var TwilioRestClient = require('twilio').RestClient;

function install(provider) {
  var client = new TwilioRestClient(
    provider.config.get("twilio:account-sid"),
    provider.config.get("twilio:auth-token")
  );
  var source = provider.config.get("twilio:phone-number");
  var smsEndpoints = {}; 
  provider.on('user', function (user) {
    if (user.endpoints) {
      user.endpoints.forEach(function (endpoint) {
        if (endpoint.type === 'sms') {
          smsEndpoints[endpoint.value] = true;
        }
      })
    }
  });
  provider.on('notification', function (msg) {
    if (msg && msg.text) {
      Object.keys(smsEndpoints).forEach(function(number) {
        client.sendSms(source, number, msg.text, null, function success() {
          console.log('SUCCESS!')
        }, function error() {
          console.log('FAILURE!')
        });
      });
    }
  });
}

exports.install = install;