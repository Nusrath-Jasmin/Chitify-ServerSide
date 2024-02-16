require("dotenv").config();
const accountSid = process.env.ACCOUNTSIDTWILIO;
const authId = process.env.AUTHTOCKENTWILIO;
const serviceSid = process.env.SERVICESIDTWILIO;
const countryCode = process.env.COUNTRYCODE;

const twilio = require("twilio");
const client = twilio(accountSid, authId);

// verification of otp
const verify = async function (otp, phone) {
  const verificationCheck = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({ to: `+91${phone}`, code: otp });
};

module.exports = verify;
