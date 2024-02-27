const mongoose = require("mongoose");

module.exports = (app) => {
  mongoose
    .connect(process.env.DATABASE)
    .then((data) => {
      app.listen(process.env.PORT || 3000);
      console.log("server started");
    })
    .catch((err) => {
      console.log(err);
    });
};
