var nodemailer = require('nodemailer');

function install(provider) {
  nodemailer.SES = {
      AWSAccessKeyID: provider.config.get('aws-ses:access-key-id'),
      AWSSecretKey: provider.config.get('aws-ses:secret-access-key'),
      ServiceUrl: 'https://email.us-east-1.amazonaws.com'
  }
  provider.on('notification', function (msg) {
    if (msg && msg.text) {
      nodemailer.send_mail({
            sender: provider.config.get('aws-ses:sender'),
            to: 'bradley.meck@gmail.com',
            subject: msg.title || 'Ready Global Notification',
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
