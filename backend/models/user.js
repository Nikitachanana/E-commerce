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
    image:{
        type:String
    },
    cart:[{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
    order:[{type:mongoose.Schema.ObjectId, ref:'order'}],
    DOB:{
        type:Date
    },
    gender:{
        type:String
    },
    phone:{type:String}
})
module.exports = mongoose.model("users",userSchema)