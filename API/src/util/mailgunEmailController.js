const dotenv = require('dotenv');
const Mailgun = require('mailgun-js');

dotenv.config()

module.exports = {
    async sendEmail(recipient, subject, body) {
        let sender = `${process?.env?.MAILGUN_DEFAULT_SENDER} <postmaster@${process?.env?.MAILGUN_DOMAIN}>`
        let api_key = process.env.MAILGUN_API_KEY;
        var mailgun = new Mailgun({ apiKey: api_key, domain: process?.env?.MAILGUN_DOMAIN });
        var data = {
            //Specify email data
            from: sender,
            //The email to contact
            to: recipient,
            //Subject and text data  
            subject: subject,
            html: body
        }

        let resp = mailgun.messages().send(data, function (err, body) {
            if (err) {
                console.log("got an error: ", err);
                throw new Error('Error while sending email.');
            }
            else {
                return body;
            }
        });
        return resp;
    }

}

