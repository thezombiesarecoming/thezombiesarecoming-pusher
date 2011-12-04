var CouchDB = require('./providers/couchdb');
var WebSocket = require('./consumers/websocket');
var IRC = require('./consumers/irc');
var TwilioSms = require('./consumers/sms/twilio');
var TwilioPhone = require('./consumers/phone/twilio');
var SMTP = require('./consumers/smtp/smtp');
var path = require('path');
var nconf = require('nconf');

nconf.argv()
     .env()
     .file({
       file: path.join(__dirname, '..', 'config.json')
     });
     
var consumers = [
  //SMTP,
  //IRC,
  //Webhook,
  TwilioPhone,
  //TwilioSms
  //IRC
]

var provider = new CouchDB.CouchDBProvider();
provider.on('notification', function () {
  console.error(arguments)
})
provider.config = nconf;

consumers.forEach(function (consumer) {
  consumer.install(provider);
})

provider.listen({
  host: provider.config.get('HOST'),
  port: provider.config.get('PORT'),
  database: provider.config.get('DATABASE')
});