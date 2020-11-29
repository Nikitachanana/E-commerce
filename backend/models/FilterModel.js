const mongoose = require("mongoose")

const filterSchema = new mongoose.Schema({
    _id:{type:Number},
    brand:{
        type:Array
    },
    womenBrands:{
        type:Array
    }
})

module.exports = mongoose.model("filter",filterSchema)