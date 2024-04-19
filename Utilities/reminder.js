const cron = require("node-cron");
const { DateTime } = require("luxon");
const Chitty = require("../models/ChitModel");
const Participants = require("../models/participants");
const User = require("../models/userModel");
const nodemailer=require('../Utilities/nodemailer')

// Schedule reminder job
cron.schedule("47 14 * * *", async () => {
  console.log("reminder");
  try {
    console.log("try");
    // Find chitties with lot date 3 days from today
    const dueDate = DateTime.local().plus({ days: 3 })
    console.log(dueDate);
    const dayOfMonth = dueDate.day;
    console.log(dayOfMonth);
    const chitties = await Chitty.find({ lotDate: dayOfMonth });
    console.log(chitties);
    chitties.forEach((chitty) => {
      sendReminderMessages(chitty._id,dayOfMonth);
    });
  } catch {
    console.log(error);
  }
});

async function sendReminderMessages(chitId,dueDate) {
  console.log("rem1");
  try {
    const participants = await Participants.findOne({ chitId });

    if (!participants) {
      console.log("No participants found for chit:", chitId);
      return;
    }

    participants.participants.forEach(async (participant) => {
      const user = await User.findById(participant);
      if (user) {
        const contactInfo = user.email;
        const reminderMessage = `Reminder: Please pay your chit amount before ${dueDate}.You will be considered for lotting only if you complete the payment.pay in time .Plesse ignore this message if already paid - team Chitify`;
        nodemailer.sendMail(contactInfo, reminderMessage);
        console.log(
          `Reminder sent to user: ${user.firstName} ${user.lastName}`
        );
      }
    });
  } catch (error) {
    console.error("Error sending reminder messages:", error);
  }
}
