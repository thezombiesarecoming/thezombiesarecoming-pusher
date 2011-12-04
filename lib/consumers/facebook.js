var Facebook = require('facebook.node');
function install(provider) {
  console.error(provider.config.get('facebook:access-token'))
  var  client = new Facebook(provider.config.get('facebook:access-token'));

  client.graph('me', function(err, user) {
    if (err) {
      console.error(err.stack);
      return;
    }

    console.log('Nice to meet you ' + user.name + '!');
  });
/*
  client.graph_post('me/friends', function(friend) {
    console.error()
    console.log('I know ' + friend.name);
  }, function(err, count) {
    if (err) {
      console.error(err.stack);
      return;
    }

    console.log('Wow, I have ' + (count == 0 ? 'no' : count) + ' friend' + (count == 1 ? '' : 's') + '!');
  });
*/
}
exports.install = install;