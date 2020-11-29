const mongoose = require("mongoose")
const Product = require("./productModel")
const order =  require("./orderModel")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cart:[{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    order:[{type:mongoose.Schema.ObjectId, ref:'order'}]



})
module.exports = mongoose.model("users",userSchema)