var nodemailer = require('nodemailer');

function install(provider) {
  nodemailer.SES = {
      AWSAccessKeyID: provider.config.get('aws:access-key-id"'),
      AWSSecretKey: provider.config.get('aws:secret-access-key')
  }
  provider.on('notification', function (msg) {
  console.log('SMTP',msg)
    if (msg && msg.text) {
      nodemailer.send_mail(
        {
            sender: 'rhok.tzac@gmail.com',
            to: 'rhok.tzac@gmail.com',
            subject: 'Hello!',
            body: msg.text
        },
        // callback function
        function(error, success){
            console.log('Message ' + success ? 'sent' : 'failed');
        }
      );
    }
  })
}
exports.install = install;
