require('dotenv').config();
const accountSid=process.env.ACCOUNTSIDTWILIO;
const authId=process.env.AUTHTOCKENTWILIO;
const serviceSid=process.env.SERVICESIDTWILIO;
const countryCode=process.env.COUNTRYCODE;

const twilio =require('twilio');
const client=twilio(accountSid, authId);

const otpgenerate=async function(phone) {
  console.log(phone);
  verification = await client.verify.v2.services(`${serviceSid}`)
      .verifications.create({to: `${countryCode}${phone}`, channel: 'sms'});
};

module.exports = otpgenerate;