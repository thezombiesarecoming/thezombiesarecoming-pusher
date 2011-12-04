var request = require('request');
var url = require('url');

function install(provider) {
  var CONSUMER_KEY = provider.config.get('twitter:consumer-key');
  var CONSUMER_SECRET = provider.config.get('twitter:consumer-secret');
  var OAUTH_TOKEN = provider.config.get('twitter:oauth-token');
  var OAUTH_TOKEN_SECRET = provider.config.get('twitter:oauth-token-secret');
  
  var oauth = {
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    token: OAUTH_TOKEN,
    token_secret: OAUTH_TOKEN_SECRET
  };
  
  provider.on('notification', function(msg) {
    if (msg && msg.text) {
      var postUrl = url.format({
        protocol: 'https:',
        host: 'api.twitter.com',
        pathname: '/1/statuses/update.json',
        query: {status: msg.text}
      });
      request.get({
        method: 'POST',
        url: postUrl,
        oauth: oauth
      });
    }
  })
}