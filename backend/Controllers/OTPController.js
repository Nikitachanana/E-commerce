const order = require('../models/orderModel');
var Publishable_Key = 'pk_test_51HsPbgFnuI1DuUy9G5rgy8nzTZcmxtYr4icUOSE55zPXnwlyksLZVdMoCiyXec91fejJU2KWUajgktKdhGRUjOph009Et2MvSA'
var Secret_Key = 'sk_test_51HsPbgFnuI1DuUy9BjnMvxKCZQHxp5mcA1U0dLH0Bobv8an4Ea7artvUSC2SHk7LCEE11UzPAw1xYFfxxfD5zwld00rgPurz8Q'
const stripe = require('stripe')(Secret_Key);


const charge =(req, res)=>{
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken  
    }) 
    .then((customer) => { 
        return stripe.charges.create({ 
            amount: 2500,     // Charing Rs 25 
            description: 'Web Development Product', 
            currency: 'INR', 
            customer: customer.id 
        }); 
    }) 
    .then(async (charge) => {
        req.session.payment = "Online"
        req.flash("success", "Payment successful!") 
        res.redirect("/checkout")   
    }) 
    .catch((err) => { 
        res.send(err)       
})

}

const paymentPage = (req,res)=>{
    res.render("payment",{key: Publishable_Key})
}
  module.exports ={
      charge:charge,
      paymentPage:paymentPage
  }