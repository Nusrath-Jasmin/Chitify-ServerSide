require('dotenv').config();
const accountSid=process.env.ACCOUNTSIDTWILIO;
const authId=process.env.AUTHTOCKENTWILIO;
const serviceSid=process.env.SERVICESIDTWILIO;
const countryCode=process.env.COUNTRYCODE;

const twilio =require('twilio');
const client=twilio(accountSid, authId);