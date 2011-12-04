var socketio = require('socket.io')

function install(provider) {
  var io = socketio.listen(provider.config.get('websocket:port') || 80);
  provider.on('notification', function (msg) {
    if (msg && msg.text) {
      io.sockets.emit('notification', msg);
    }
  });
}
exports.install = install;