var nodemailer = require("nodemailer");
const sendEmail = (options) => {
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  var mainOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: "Chat Sennee",
    text:
      `You need reset password in 10 minutus, click link to reset password: 
      `+ 
      options.message,
  };
  transporter.sendMail(mainOptions);
};

module.exports = sendEmail;
