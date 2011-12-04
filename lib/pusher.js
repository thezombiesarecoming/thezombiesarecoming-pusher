var CouchDB = require('./providers/couchdb');
var WebSocket = require('./consumers/websocket');
var WebHook = require('./consumers/webhook');
var IRC = require('./consumers/irc');
var Facebook = require('./consumers/facebook')
var TwilioSms = require('./consumers/sms/twilio');
var TwilioPhone = require('./consumers/phone/twilio');
var SMTP = require('./consumers/smtp/smtp');
var path = require('path');
var nconf = require('nconf');
var HttpLister = require('./listings/http');

var system = new nconf.Provider();
system.file({ file: path.join(__dirname, '..', 'system.json')});

nconf.argv()
     .env()
     .file({
       file: path.join(__dirname, '..', 'config.json')
     });
     
var consumers = [
  SMTP,
  IRC,
  WebSocket,
  WebHook,
  //Facebook,
  TwilioPhone,
  TwilioSms,
  Twitter
]

var provider = new CouchDB.CouchDBProvider({
  system: system
});
provider.config = nconf;
HttpLister.install(provider);
consumers.forEach(function (consumer) {
  consumer.install(provider);
})

provider.listen({
  host: provider.config.get('HOST'),
  port: provider.config.get('PORT'),
  database: provider.config.get('DATABASE')
});