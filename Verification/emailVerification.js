const nodemailer = require("nodemailer");

async function sendEmail(email, message, res) {

  console.log(process.env.MAIL + '    ' + process.env.PASSWORD);
  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail", // email service
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Define email content
  const mailOptions = {
    from: process.env.MAIL, // Sender address
    to: email, // List of recipients
    subject: "otp for email verification", // Subject line
    text: message, // Plain text body
  };

  return transporter.sendMail(mailOptions);

  

  // // Send email
  // try {
  //   const info = await transporter.sendMail(mailOptions);
  //   console.log("Email sent:", info.response);
  //   res.json({ success: true, message: "Email sent successfully" });
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   res.status(500).json({ success: false, message: "Error sending email" });
  // }
}

module.exports = {
  sendEmail,
};
