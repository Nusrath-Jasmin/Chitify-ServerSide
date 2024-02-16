const express=require('express'); 
require("dotenv").config();
const commonRoutes=require('./routes/commonRoutee');
const userRoute=require("./routes/userRoute")
const cors = require('cors');
const bodyParser = require('body-parser');


// Establishing database and server connection
const app=express();
require('./utilities/connection')(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/', commonRoutes);
app.use('/user',userRoute)
