const express = require("express");
require("dotenv").config()
const logger = require("morgan");
const compression = require("compression");
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const mainRoutes = require("./backend/Router/mainRouter")
const session = require("express-session")
var cookieParser = require('cookie-parser')
app.use(cookieParser())
const flash = require("connect-flash")
var multer  =   require('multer'); 
var path = require("path")
require('dotenv/config'); 
app.use(session({
    secret: "ANything",
    saveUninitialized : true,
    resave : true
}))
app.set("view engine",'ejs');
app.set("views",__dirname + "/client/views");
app.engine("html",require('ejs').renderFile);
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(logger('dev'))
app.use(express.static(__dirname + '/client'));
app.use(express.json())
app.use(flash())
const cloudinary = require("cloudinary")
const mongoose = require('mongoose');
var connectionString = 'mongodb+srv://nikitachanana:nikita@123@cluster0.x4zla.mongodb.net/shein?retryWrites=true&w=majority'
mongoose.connect(connectionString,
  { useUnifiedTopology: true, useNewUrlParser: true ,useCreateIndex: true}, (err, client) => {
    if (err) return console.error(err)
    console.log('Connected to Database')
  })
 

cloudinary.config({
cloud_name: "nikita4206",
api_key: 818828728795436,
api_secret: "Yselfwkj5B4SZ1Kcw77_2PDEpPE",
});
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use("/", mainRoutes);

app.set("port", process.env.PORT || 5050); //Line11
app.listen(app.get("port"), () => {
  console.log(`Application running oN port: ${process.env.PORT}`);
});
app.use(express.json())

module.exports = app;
