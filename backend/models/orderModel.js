const mongoose = require("mongoose")

const Orderschema = new mongoose.Schema({
    orderDetails:new mongoose.Schema({
        products:Array,
        total: Number,
        notes:String,
        expectedDate: Date,
        payment: String
    }),
    userDetails:new mongoose.Schema({
        name:String,
        phone: String,
        address: Array,
        tcity: String,
        postal: String,
        country:String
    })
    
})

const order = mongoose.model("order", Orderschema)

module.exports = order