const express=require("express")
const commonRoutes=require("./routes/commonRoutee")
const cors = require('cors');
const bodyParser = require('body-parser');



// Establishing database and server connection
const app=express()
require('./utilities/connection')(app)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors());


app.use("/",commonRoutes)