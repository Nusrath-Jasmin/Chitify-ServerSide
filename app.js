const express=require('express'); 
require("dotenv").config();
const commonRoutes=require('./routes/commonRoutee');
const userRoute=require("./routes/userRoute");
const adminRoute=require('./routes/adminRoute');
const cors = require('cors');
const bodyParser = require('body-parser');
const crone=require("./Utilities/reminder")
const lotting=require("./Utilities/lotting")
// Establishing database and server connection
const app=express();
require('./config/connection')(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/api', commonRoutes);
app.use('/api/user',userRoute);
app.use('/api/admin',adminRoute);
