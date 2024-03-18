const nodemailer = require("nodemailer");

const sendMail = async function (mail, message) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Define email content
  const mailOptions = {
    from: process.env.MAIL,
    to: mail,
    subject: "Reminder",
    text: message,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("mail send");
  } catch (error) {
    console.log("error");
  }
};

module.exports={sendMail}