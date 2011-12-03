var CouchDB = require('./providers/couchdb');
var WebSocket = require('./consumers/websocket');
var IRC = require('./consumers/irc');
var Twilio = require('./consumers/sms/twilio');
var SES = require('./consumers/smtp/amazon-ses');
var path = require('path');
var nconf = require('nconf');

nconf.argv()
     .env()
     .file({
       file: path.join(__dirname, '..', 'config.json')
     });
     
var consumers = [
  Twilio,
  SES
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