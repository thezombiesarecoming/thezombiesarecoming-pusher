var irc = require('irc');

function install(provider) {
  var client = new irc.Client(provider.config.get('irc:host'), provider.config.get('irc:nick'), {
      channels: [provider.config.get('irc:channel')],
  });
  var tosend = [];
  provider.on('notification', function(msg) {
    if (msg && msg.text) {
      tosend.push(msg);
      flush();
    }
  });
  var connected = false;
  client.on('motd', function () {
    connected = true;
    flush();
  })
  function flush() {
    if (!connected) return;
    tosend.forEach(function (msg) {
      client.say(provider.config.get('irc:channel'), msg.text);
    });
  }
}
exports.install = install;