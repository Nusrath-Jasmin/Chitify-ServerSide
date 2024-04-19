const cron = require("node-cron");
const moment = require("moment");
const Payment = require("../models/paymentModel");
const Chitty = require("../models/ChitModel");
const WebSocket = require("ws");
const User = require("../models/userModel");
const SelectedUser = require("../models/winners");

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Function to send messages to clients
const sendMessageToClients = (message) => {
  console.log("sended");
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// // Define a cron job to run daily
// cron.schedule('7 15 * * *', async () => {
//     try {
//         // Get current month name
//         const currentMonthName = moment().format('MMMM');

//         // Find chits with lot date equal to current day of the month
//         const chits = await Chitty.find({ lotDate: moment().date() });

//         // Iterate over each chit
//         for (const chit of chits) {
//             // Find all paid users for the current month
//             const paidUsers = await Payment.find({
//                 chitId: chit._id,
//                 month: currentMonthName,
//             });

//             // Select a random user from paid users
//             const randomIndex = Math.floor(Math.random() * paidUsers.length);
//             const selectedUser = paidUsers[randomIndex];
//             const user=User.findById(selectedUser)

//             // Perform any action with the selected user (e.g., notify them)
//             console.log(`Selected user for chit ${chit._id}: ${selectedUser.userId}`);
//             sendMessageToClients({ user });

//         }
//     } catch (error) {
//         console.error('Error in cron job:', error);
//     }
// }, {
//     scheduled: true,
//     timezone: 'Asia/Kolkata', // Adjust timezone as per your requirement
// });

// Define a cron job to run daily
cron.schedule(
  "8 15 * * *",
  async () => {
    try {
      // Get current month name
      const currentMonthName = moment().format("MMMM");

      // Find chits with lot date equal to the current day of the month
      const chits = await Chitty.find({ lotDate: moment().date() });

      // Iterate over each chit
      for (const chit of chits) {
        // Find all paid users for the current month and chit
        const paidUserslist = await Payment.find({
          chitId: chit._id,
          month: currentMonthName,
        });

        // Find all winners for the current chit
        const selectedUsers = await SelectedUser.find({ chitId: chit._id });
        console.log(selectedUsers);
        // Extract user IDs of winners
        const winnerUserIds = selectedUsers.map((user) => user.userId);
        console.log(winnerUserIds);
        // Remove the users who are already winners from the paid users list
        const filteredPaidUsers = paidUserslist.filter(user => {
            const userId = user.userId.toString(); // Convert user.userId to string
            return !winnerUserIds.some(winnerId => winnerId.equals(userId)); // Compare ObjectId objects
        });
        
        
        console.log(filteredPaidUsers);
        // Select a random user from the filtered paid users list
       // Select a random user from the filtered paid users list
if (filteredPaidUsers.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredPaidUsers.length);
    const selectedUser = filteredPaidUsers[randomIndex];

    // Fetch the user details from the User model
    const user = await User.findById(selectedUser.userId);

    if (user) {
        // Save the selected user as a winner
        const newSelectedUser = new SelectedUser({
            chitId: chit._id,
            userId: user._id,
            month: currentMonthName
        });
        await newSelectedUser.save();

        // Perform any action with the selected user (e.g., notify them)
        console.log(`Selected user for chit ${chit._id}: ${user}`);

        // Send only necessary user properties to clients
        sendMessageToClients({ 
            name: user.firstName,
            email: user.email,
            // Add more properties as needed
        });
    } else {
        console.error('User not found:', selectedUser);
    }
} else {
    console.error('No filtered paid users found for chit:', chit._id);
}

      }
    } catch (error) {
      console.error("Error in cron job:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata", // Adjust timezone as per your requirement
  }
);
