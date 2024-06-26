const accountSid = process.env.ACCOUNTSIDTWILIO;
const authId = process.env.AUTHTOCKENTWILIO;
const serviceSid = process.env.SERVICESIDTWILIO;
const countryCode = process.env.COUNTRYCODE;
const messagingServiceSid =process.env.MESSAGE_SID;

const twilio = require("twilio");
const client = twilio(accountSid, authId);

// code to send otp
const sendOtp = async function (phone) {
  console.log(phone);
  verification = await client.verify.v2
    .services(`${serviceSid}`)
    .verifications.create({ to: `${countryCode}${phone}`, channel: "sms" })
    .catch((error) => {
      console.error("Error creating verification:", error);
      throw error;
    });
};

//code to verify otp
const verifyOtp = async function (phone, otp) {
  try {
    console.log("verify otp",phone,otp);
    const verificationCheck = await client.verify.v2
      .services(`${serviceSid}`)
      .verificationChecks.create({ to: `+91${phone}`, code: otp });
    console.log(verificationCheck.status);
    return verificationCheck
  } catch (error) {
    console.error(error);
  }
};

//code to send message
const sendMessage=async function(phone,message){
  console.log("rem2");
  client.messages
  .create({
    body: message,
    messagingServiceSid: messagingServiceSid,
    to: phone 
  })
  .then(message => console.log(message.sid))
  .catch(error => console.error(error));
}

module.exports = {
  sendOtp,
  verifyOtp,
  sendMessage
}
