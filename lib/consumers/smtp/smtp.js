var nodemailer = require('nodemailer');

function install(provider) {
  nodemailer.SMTP = {
      host: provider.config.get('smtp:host'),
      user: provider.config.get('smtp:username'),
      pass: provider.config.get('smtp:password'),
      port: provider.config.get('smtp:port'),
      use_authentication: true
  }
  provider.on('notification', function (msg) {
    if (msg && msg.text) {
      var options = {
          sender: provider.config.get('smtp:sender'),
          to: 'bradley.meck@gmail.com',
          subject: msg.title || 'Ready Global Notification',
          body: msg.text
      };
  console.error(msg, nodemailer.SMTP, options)
      nodemailer.send_mail(
        options,
        function(error, success){
          console.error(arguments)
        }
      );
    }
  })
}
exports.install = install;
