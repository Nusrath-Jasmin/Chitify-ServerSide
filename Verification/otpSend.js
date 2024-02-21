const accountSid = process.env.ACCOUNTSIDTWILIO;
const authId = process.env.AUTHTOCKENTWILIO;
const serviceSid = process.env.SERVICESIDTWILIO;
const countryCode = process.env.COUNTRYCODE;

const twilio = require("twilio");
const client = twilio(accountSid, authId);

// code to send otp
const otpgenerate = async function (phone) {
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


module.exports = {
  otpgenerate,
  verifyOtp
}
