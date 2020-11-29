const mongoose = require("mongoose")


const productSchema = new mongoose.Schema({
    name:String,
    brand: String,
    category:String,
    price:Number,
    stock:Number,
    ratings: Number,
    image:String,
    description:String,
    numReviews:Number,
    reviews:Array
})

module.exports= mongoose.model("Product",productSchema)