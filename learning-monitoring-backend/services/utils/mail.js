const nodemailer = require('nodemailer');
require('dotenv').config();
const { EMAIL, PASSWORD } = process.env;

function sendMail(details) {    
    const { recipient, subject, body } = details;    
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });
   

    const mailOptions = {
        from:  `"no reply" <${EMAIL}>`,
        to: recipient,
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

module.exports = { sendMail }
