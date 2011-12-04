var TwilioRestClient = require('twilio').RestClient;

function install(provider) {
  var client = new TwilioRestClient(
    provider.config.get("twilio:account-sid"),
    provider.config.get("twilio:auth-token")
  );
  var source = provider.config.get("twilio:phone-number");
  var phoneEndpoints = {
  };
  phoneEndpoints[provider.config.get("twilio:phone-number")] = 1;
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
      Object.keys(phoneEndpoints).forEach(function(number) {
        var twiml = 'http://thezombiesarecoming.iriscouch.com/thezombiesarecoming/_design/notifications/_show/twilml/test1'
        console.error('PHONING', number)
        client.makeOutgoingCall(source, number, twiml, {}, function success() {
          console.log('SUCCESS!')
        }, function error() {
          console.log('FAILURE!')
          console.error(arguments)
        });
      });
    }
  });
}

exports.install = install;