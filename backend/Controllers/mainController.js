const express = require('express');
var Product = require("../models/productModel")
const cloudinary = require("cloudinary")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const users = require("../models/user");
const user = require('../models/user');
const filter = require('../models/FilterModel')
const order = require("../models/orderModel")
var nodemailer = require('nodemailer');
const internet = require("check-internet-connected")
var Publishable_Key = 'pk_test_51HsPbgFnuI1DuUy9G5rgy8nzTZcmxtYr4icUOSE55zPXnwlyksLZVdMoCiyXec91fejJU2KWUajgktKdhGRUjOph009Et2MvSA'
var Secret_Key = 'sk_test_51HsPbgFnuI1DuUy9BjnMvxKCZQHxp5mcA1U0dLH0Bobv8an4Ea7artvUSC2SHk7LCEE11UzPAw1xYFfxxfD5zwld00rgPurz8Q'
const stripe = require('stripe')(Secret_Key);

//  ################################
// ############ Email SEttings ########
// #################################

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nikitachananaitl@gmail.com',
    pass: 'ITL2020@#'
  }
});

//  ################################
// ############ Home Page #########
// #################################
const home=async (req,res)=>{
    internet().then(async ()=>{
      if(req.user){
        var data = await user.findOne({_id:req.user.id})
        console.log(data)
        console.log(req.user)
        res.render('index',{success:req.flash('success'),error:req.flash("error"),user:req.user,data:data})
    }
    else{
        res.render('index',{success:null,error:null,user:null})
    }
    }).catch(()=>{
      res.render("noInternet")
    })
}

const login=(req,res)=>{
    internet().then(()=>{
      res.render("login",{success:req.flash('success'),error:req.flash("error"),OTP:req.session.otp,email:req.session.email})
    }).catch(()=>{
      res.render("noInternet")
    })
}
//  ################################
// ############ Contact Page #########
// #################################

const contact=async (req,res)=>{
  internet().then(async ()=>{
    const userData = await users.findOne({_id:req.user.id})
    res.render("contact",{user:req.user,userData:userData})
  }).catch(()=>{
    res.render("noInternet")
  })
}
//  ################################
// ############ Randon OTP generator #########
// #################################

var generateOTP = ()=>{
  var digits = '0123456789';
  let OTP = ''; 
  for (let i = 0; i < 4; i++ ) { 
      OTP += digits[Math.floor(Math.random() * 10)]; 
  } 
  return OTP; 

}
//  ################################
// ############ Send OTP #########
// #################################


const sendOTP= async (req,res)=>{
  console.log(req.body)
  const email = await  users.findOne({email:req.body.email})
  if(email){
      console.log("email", email)
      const OTP = generateOTP()
      req.session.otp= OTP
      console.log(OTP)
      var mailoptions = {
          from: 'nikitachananaitl@gmail.com',
            to: req.body.email,
            subject: `OTP for Shien`,
            text: `Your OTP for Shien is ${OTP}`
      }
      transporter.sendMail(mailoptions,((err,result)=>{
          if(err){
              console.log(err)
          }
          else{
              console.log(result)
              req.session.email = req.body.email
              res.redirect("/login")
          }
      }))
      
  }else{
      res.json({
          error:"no user found"
      })
  }
  
}
//  ################################
// ############ Change password #########
// #################################

const changepassword =async (req,res)=>{
  console.log(req.body)
  var id;
  const email = await  users.findOne({email:req.body.email})
  id = email._id
  var hashedPassword = await bcrypt.hash(req.body.password2,10)
  users.updateOne({_id:id},{password:hashedPassword}).then(result=>{
      console.log(result)
      req.flash("success","Password Updated Successfully")
      res.redirect("/login")
  })
  .catch(err=>{
      req.flash("error","Error updating password")
      res.redirect("/login")
  })
}

//  ################################
// ############ Women Page(filter) #########
// #################################

var filterdata1 = {
    brand: [],
    price: [],
    ratings: [],
    filter: []
  };
  Array.prototype.remove = function () {
    var what,
      a = arguments,
      L = a.length,
      ax;
    while (L && this.length) {
      what = a[--L];
      while ((ax = this.indexOf(what)) !== -1) {
        this.splice(ax, 1);
      }
    }
    return this;
  };
const filterData1 = (req,res)=>{
    console.log(req.query)
    req.session.filterData1 = filterdata1;
    if (req.query.brand) {
        if (!req.session.filterData1.brand.includes(req.query.brand)) {
          req.session.filterData1.brand.push(req.query.brand);
          req.session.filterData1.filter.push(req.query.brand);
        } else {
          req.session.filterData1.brand.remove(req.query.brand);
          req.session.filterData1.filter.remove(req.query.brand);
        }
      }
      if (req.query.ratings) {
        if (!req.session.filterData1.ratings.includes(req.query.ratings)) {
          req.session.filterData1.ratings.push(req.query.ratings);
          req.session.filterData1.filter.push(req.query.ratings);
        } else {
          req.session.filterData1.ratings.remove(req.query.ratings);
          req.session.filterData1.filter.remove(req.query.ratings);
        }
      }
      if (req.query.price) {
        if (!req.session.filterData1.price.includes(req.query.price)) {
          req.session.filterData1.price.push(req.query.price);
          req.session.filterData1.filter.push(req.query.price);
        } else {
          req.session.filterData1.price.remove(req.query.price);
          req.session.filterData1.filter.remove(req.query.price);
        }
      }
      var max = 0;
      if (req.session.filterData1.price.length > 0) {
        max = parseInt(req.session.filterData1.price[0]);
        for (var i = 0; i < req.session.filterData1.price.length; i++) {
          max =
            parseInt(req.session.filterData1.price[i]) > max
              ? parseInt(req.session.filterData1.price[i])
              : max;
        }
      }
      console.log(max)
      var min = 0;
      if (req.session.filterData1.ratings.length > 0) {
        min = parseInt(req.session.filterData1.ratings[0]);
        for (var i = 0; i < req.session.filterData1.ratings.length; i++) {
          min =
            parseInt(req.session.filterData1.ratings[i]) < min
              ? parseInt(req.session.filterData1.ratings[i])
              : min;
        }
      }
      console.log(min)
      var query = {
        category:"Women",
        brand: { $in: req.session.filterData1.brand },
        price: { $lte: max },
        ratings: {$gte:min},
      };
    
      if (req.session.filterData1.brand.length == 0) {
        delete query["brand"];
      }
      if (req.session.filterData1.ratings.length == 0) {
        delete query["ratings"];
      }
      if (req.session.filterData1.price.length == 0) {
        delete query["price"];
      }
     
      req.session.filterQuery1 = query;
      console.log(query);
      console.log("filterData1 is", req.session.filterData1);
      res.json({
        done: "done",
      });
    }

//  ################################
// ############ Women Page #########
// #################################
const women = async (req, res) => {
  internet().then(async ()=>{
    console.log("User is",req.user)
    var perPage = 9;
    const page = req.params.page || 1;
    var filterData = await filter.findOne({ _id: 1 });
      console.log("Query is",req.session.filterQuery1)
      var userData = await user.findOne({_id:req.user.id})
    if(req.session.filterData1){
      var allProducts =  await Product.find(req.session.filterQuery1)
      console.log("All Products",allProducts.length)
      var totaPages = Math.ceil(allProducts.length/perPage)
      Product.find(req.session.filterQuery1)
        .limit(perPage * 1)
        .skip((page - 1) * perPage)
        .then((data) => {
          console.log(totaPages);
          console.log(data.length);
          res.render("women", {
            data: data,
            brands: filterData.womenBrands,
            pages: totaPages,
            user: req.user,
            userData: userData,
            filters:req.session.filterData1.filter
          });
        });
    }
    else{
      var allProducts = await Product.find({ category: "Women" });
      console.log("All Products", allProducts.length);
      var totaPages = Math.ceil(allProducts.length / perPage);
      Product.find({ category: "Women" })
        .limit(perPage * 1)
        .skip((page - 1) * perPage)
        .then((data) => {
          res.render("women", {
            data: data,
            brands: filterData.womenBrands,
            pages: totaPages,
            user: req.user,
            userData:userData,
            filters:req.session.filterData1
          });
        });
    }
  }).catch(()=>{
    res.render("noInternet")
  })
};

//  ################################
// ############Place Order #########
// #################################
var today = new Date;
const placeOrder =async (req,res)=>{
  console.log(req.session.payment)
  console.log(req.body)
  var total =0;
  var payment;
  var userData =await user.findOne({_id:req.user.id})
  user.findOne({_id:req.user.id}).populate("cart").exec((err, products)=>{
    for(i of products.cart){
      total+=i.price
    }
    if(req.session.payment=="Online"){
      payment= req.session.payment
    }else{
      payment="Cash on Delivery"
    }
    var userDetails = {
      name:req.body.name,
      phone:req.body.phone,
      address:req.body.address,
      tcity:req.body.tcity,
      postal:req.body.postal,
      country:req.body.country,
    }
    var orderDetails = {
      products: products.cart,
      total:total,
      notes:req.body.notes,
      expectedDate: new Date(today.setDate(today.getDate()+5)),
      payment: payment
    }
    // console.log(userDetails)
    // console.log(orderDetails)
    const Order=  new order({
      orderDetails:orderDetails,
      userDetails:userDetails
    })
    Order.save().then(async (result)=>{
      req.session.payment=""
      console.log("Order is",result)
      await user.update({_id:req.user.id},{$push:{order:result._id}})
      const delCart = await user.updateOne({_id:req.user.id},{$unset:{cart:1}})
      console.log("Delete cart", delCart)
      var mailOptions = {
        from: 'nikitachananaitl@gmail.com',
        to: userData.email,
        subject: 'Order Successfully Placed',
        text: `Order placed successfully with order id ${result._id}
        Thanks for Shopping with Shein`
      };
      transporter.sendMail(mailOptions,(err,result)=>{
        if(result){
          
          req.flash("success","You order is successfully placed, Details have been emailed!")
          res.redirect("/cart")
        }
        else if(err){
          console.log(error)
        }
      })
    })
  })
  

}
//  ################################
// ############ Men Page(filter) #########
// #################################

var filterdata = {
    brand: [],
    price: [],
    ratings: [],
    filter: []
  };
  
const filterData = (req,res)=>{
    console.log(req.query)
    req.session.filterData = filterdata;
    if (req.query.brand) {
        if (!req.session.filterData.brand.includes(req.query.brand)) {
          req.session.filterData.brand.push(req.query.brand);
          req.session.filterData.filter.push(req.query.brand);
        } else {
          req.session.filterData.brand.remove(req.query.brand);
          req.session.filterData.filter.remove(req.query.brand);
        }
      }
      if (req.query.ratings) {
        if (!req.session.filterData.ratings.includes(req.query.ratings)) {
          req.session.filterData.ratings.push(req.query.ratings);
          req.session.filterData.filter.push(req.query.ratings);
        } else {
          req.session.filterData.ratings.remove(req.query.ratings);
          req.session.filterData.filter.remove(req.query.ratings);
        }
      }
      if (req.query.price) {
        if (!req.session.filterData.price.includes(req.query.price)) {
          req.session.filterData.price.push(req.query.price);
          req.session.filterData.filter.push(req.query.price);
        } else {
          req.session.filterData.price.remove(req.query.price);
          req.session.filterData.filter.remove(req.query.price);
        }
      }
      var max = 0;
      if (req.session.filterData.price.length > 0) {
        max = parseInt(req.session.filterData.price[0]);
        for (var i = 0; i < req.session.filterData.price.length; i++) {
          max =
            parseInt(req.session.filterData.price[i]) < max
              ? parseInt(req.session.filterData.price[i])
              : max;
        }
      }
      console.log(max)
      var min = 0;
      if (req.session.filterData.ratings.length > 0) {
        min = parseInt(req.session.filterData.ratings[0]);
        for (var i = 0; i < req.session.filterData.ratings.length; i++) {
          min =
            parseInt(req.session.filterData.ratings[i]) < min
              ? parseInt(req.session.filterData.ratings[i])
              : min;
        }
      }
      console.log(min)
      var query = {
        category:"Men",
        brand: { $in: req.session.filterData.brand },
        price: { $lte: max },
        ratings: {$gte:min},
      };
    
      if (req.session.filterData.brand.length == 0) {
        delete query["brand"];
      }
      if (req.session.filterData.ratings.length == 0) {
        delete query["ratings"];
      }
      if (req.session.filterData.price.length == 0) {
        delete query["price"];
      }
     
      req.session.filterQuery = query;
      console.log(query);
      console.log("filterData is", req.session.filterData);
      res.json({
        done: "done",
      });
    }
    
//  ################################
// ############ Men Page #########
// #################################

const men = async (req, res) => {
  internet().then(async ()=>{
    console.log("User is",req.user)
    var perPage = 9;
    const page = req.params.page || 1;
    var filterData = await filter.findOne({ _id: 1 });
      console.log("Query is",req.session.filterQuery)
      var userData = await user.findOne({_id:req.user.id})
    if(req.session.filterData){
      var allProducts =  await Product.find(req.session.filterQuery)
      console.log("All Products",allProducts.length)
      var totaPages = Math.ceil(allProducts.length/perPage)
      Product.find(req.session.filterQuery)
        .limit(perPage * 1)
        .skip((page - 1) * perPage)
        .then((data) => {
          console.log(totaPages);
          console.log(data.length);
          res.render("men", {
            data: data,
            brands: filterData.brand,
            pages: totaPages,
            user: req.user,
            userData: userData,
            filters:req.session.filterData.filter
          });
        });
    }
    else{
      var allProducts = await Product.find({ category: "Men" });
      console.log("All Products", req.session.filterData);
      var totaPages = Math.ceil(allProducts.length / perPage);
      Product.find({ category: "Men" })
        .limit(perPage * 1)
        .skip((page - 1) * perPage)
        .then((data) => {
          res.render("men", {
            data: data,
            brands: filterData.brand,
            pages: totaPages,
            user: req.user,
            userData:userData,
            filters:req.session.filterData
          });
        });
    }
  }).catch(()=>{
    res.render("noInternet")
  })
};

//  ################################
// ############ Register Page #########
// #################################
const register = (req, res) => {
  internet().then(()=>{
    res.render("register");
  }).catch(()=>{
    res.render("noInternet")
  })
};
//  ################################
// ############ Cart Page #########
// #################################
const cart=async (req,res)=>{
  internet().then(async ()=>{
    var total =0
  var userData = await user.findOne({_id:req.user.id})
  user.findOne({_id:req.user.id}).populate("cart").exec((err, products) => {
    console.log("Populated User " + products.cart);
    for(i of products.cart){
      total+=i.price
    }
    res.render('cart',{products:products.cart,userData:userData,user:req.user, total:total,success:req.flash("success")})
  })
  }).catch(()=>{
    res.render("noInternet")
  })
}
//  ################################
// ############Profile #########
// #################################
const profile =(req,res)=>{
  internet().then(async ()=>{
    const userData = await user.findOne({_id:req.user.id})
    console.log(userData)
    res.render("Profile",{user:req.user,userData:userData,success:req.flash('success'),error:req.flash("error")})
  })
}

//  ################################
// ############ Manage Profile #########
// #################################
const editProfile=(req,res)=>{
  internet().then(async ()=>{
    console.log(req.file)
    if(req.file){
      var filename;
      const file = req.file.path;
      cloudinary.uploader.upload(file).then(async result=>{
      filename = result.url;
      await user.updateOne({_id:req.user.id},{
        name:req.body.name,
        email:req.body.name,
        phone:req.body.number,
        DOB:req.body.DOB,
        image:filename
      })
      req.flash("success","Profile Updated Successfully")
      res.redirect("/")
    })
  }else{
    user.updateOne({_id:req.user.id},{
      name:req.body.name,
      email:req.body.name,
      phone:req.body.number,
      DOB:req.body.DOB,
    }).then((result)=>{
      req.flash("success","Profile Updated Successfully")
      res.redirect("/")
    }

    )

  }
  })
}
//  ################################
// ############ Wishlist Page #########
// #################################

const wishlist =async (req,res)=>{
  internet().then(async ()=>{
    var userData = await user.findOne({_id:req.user.id})
  user.findOne({_id:req.user.id}).populate("wishlist").exec((err, products) => {
    console.log("Populated User " + products.wishlist);
    res.render('wishlist',{data:products.wishlist,userData:userData,user:req.user})
  })
  }).catch(()=>{
    res.render("noInternet")
  })
}
//  ################################
// ############ Orders Page #########
// #################################
const myOrders =async (req,res)=>{
  internet().then(async ()=>{
  var userData = await user.findOne({_id:req.user.id})
  console.log(userData)
  user.findOne({_id:req.user.id}).populate("order").exec(async (err, orders)=>{
        if(err){
          console.log(error)
        }else{
          const allOrderProducts =[]
          if(orders.order){
            for(i of orders.order){
              var orderProducts=[]
              for(j of i.orderDetails.products){
                const product = await Product.findOne({_id:j})
                orderProducts.push(product)
              }
              allOrderProducts.push(orderProducts)
            }
            
          }
          console.log(allOrderProducts.length)
          console.log(orders.order.length)
          res.render("myOrders",{userData:userData,user:req.user,success:req.flash('success'),error:req.flash("error"),orders:orders.order,products:allOrderProducts})
        }
  })
  })
  .catch(()=>{
    res.render('noInternet')
  })
 
}
//  ################################
// ############ Checkout Page #########
// #################################

const checkout=async (req,res)=>{
  console.log(req.session.payment)
  internet().then(async ()=>{
    var total = 0
  var userData=await user.findOne({_id:req.user.id})
  user.findOne({_id:req.user.id}).populate("cart").exec((err, products)=>{
    for(i of products.cart){
      total+=i.price
    }
    if(total>0){
      res.render("checkout",{user:req.user,userData:userData,data:products.cart,total:total,key:Publishable_Key,payment:req.session.payment})
    }
    else{
      res.redirect("/")
    }
  })
  }).catch(()=>{
    res.render("noInternet")
  })
    
}

//  ################################
// ########Add product from wishlist to cart#########
// #################################


const wishlistTocart =async (req,res)=>{
  console.log(req.query)
  user.updateMany({_id:req.user.id},{$push:{cart:req.query.id},$pull:{wishlist:req.query.id}}).then(result=>{
    console.log(result)
    res.redirect("/wishlist")
  })

}

//  ################################
// ############ Product Details Page #########
// #################################
const productDetails=async (req,res)=>{
    internet().then(async ()=>{
      console.log(req.user)
    var data = await Product.findOne({_id:req.params.id})
    var userData = await user.findOne({_id:req.user.id})
    console.log(data)
    res.render("product-details",{data:data, user:req.user, userData:userData})
    }).catch(()=>{
      res.render("noInternet")
    })
}
//  ################################
// ########Add to cart functionality#####
// #################################
const addtocart = async (req,res)=>{
  console.log(req.query.id)
  console.log(req.user)
  user.updateOne({_id:req.user.id},{$push:{cart:req.query.id}}).then((data)=>{
    if(data){
      console.log(data)
      return res.json({
       done: "done"
      })
      
    }
    else{
      console.log("error")
    }
  })
}
//  ################################
// ###Add to wishlist functionality#####
// #################################
const addtowishlist = async (req,res)=>{
  console.log(req.query.id)
  console.log(req.user)
  user.updateOne({_id:req.user.id},{$push:{wishlist:req.query.id}}).then((data)=>{
    if(data){
      console.log(data)
      return res.json({
       done: "done"
      })
      
    }
    else{
      console.log("error")
    }
  })
}
//  ################################
// #######Remove from cart functionality#####
// #################################

const removeItem = (req,res)=>{
  console.log(req.query)
  user.updateOne({_id:req.user.id},{$pull:{cart:req.query.id}}).then(result=>{
    console.log(result)
    res.redirect("cart")
  }).catch(err=>{
    console.log(err)
  })

}

const productForm = (req,res)=>{
     res.render("productForm")
}

const product =async (req,res)=>{
    console.log(req.body)
    const update = await filter.findOne({_id:1}).then(data=>{
        if(req.body.category === "Men"){
            if(!data.brand.includes(req.body.brand)){
                filter.update({_id:1},{$push:{brand:req.body.brand}}).then((data)=>{
                    console.log("brand added")
                })
                
            }
        }else if(req.body.category === "Women"){
            if(!data.womenBrands.includes(req.body.brand)){
                filter.update({_id:1},{$push:{womenBrands:req.body.brand}}).then((data)=>{
                    console.log("Women brand added")
                })
                
            }
        }
    }) 
    var filename;
    const file = req.file.path;
    cloudinary.uploader.upload(file).then(result=>{
        filename = result.url;
        var product = new Product({
            name:req.body.name,
            brand:req.body.brand,
            category:req.body.category,
            price:req.body.price,
            stock:req.body.stock,
            ratings:req.body.ratings,
            image:filename,
            description:req.body.description,
            numReviews:req.body.numReviews
        })
        product.save()
        res.redirect("/product-form")
    })
}
//  ################################
// ########Registration functionality#####
// #################################
const registration =async (req, res)=>{
    const hashedPassword= await bcrypt.hash(req.body.password,10)
    console.log(hashedPassword)
   new users({
       name:req.body.name,
       email:req.body.email,
       password:hashedPassword
   })
   .save()
   req.flash("success","Succesfully registered! You can login now.")
   res.redirect("/login")
}

//  ################################
// ########Login functionality#####
// #################################

const userLogin = async (req,res)=>{
    users.find({email:req.body.email}).then(async result=>{
        //user found//
        if(result.length==1){
            const user = {id:result[0]._id}
            bcrypt.compare(req.body.password,result[0].password,(err,result)=>{  //compare passwords//
                if(result){
                    console.log(user)
                    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
                    console.log("access token is ",accessToken)
                    res.cookie('token', accessToken)
                    req.flash("success", "welcome! happy shopping")
                    res.redirect("/")
                }
                else{
                    req.flash("error","Incorrect password")
                    console.log("did not match")     //passwords did not match
                    res.redirect("/login")
                }
            })
        }
        else{
            //no user found//
            req.flash("error","No user found")
            res.redirect("/login")
        }
    })
   
}
//  ################################
// ########Logout functionality#####
// #################################
const logout = (req, res)=>{
    res.clearCookie("token")
    console.log(req.session.filterData)
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            request.session.message = "Error Logging out"
            res.redirect("/")
        } else {
            console.log("session destroyed")
            
            res.redirect("/login")
        }
    })
}

//  ################################
// ########Check token functionality#####
// #################################

const authorizeToken = (req,res,next)=>{
    const token = req.cookies["token"]
    if(token==null){
        res.redirect("/login")
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            res.redirect("/login")
        }
        req.user = user
        console.log("verified")
        next()
    })
}



const authcheck = (req,res,next)=>{
    const token = req.cookies["token"]
    console.log(token)
    if(token){
      jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            res.redirect("/login")
        }
        req.user = user
        console.log("verified")
        res.redirect("/")
    })
    }
    else{
      next()
    }
    
}



module.exports = {
    home:home,
    login:login,
    men:men,
    women:women,
    register:register,
    contact:contact,
    cart:cart,
    productDetails:productDetails,
    checkout:checkout,
    productForm:productForm,
    product:product,
    registration:registration,
    userLogin:userLogin,
    authorizeToken:authorizeToken,
    logout:logout,
    filterData:filterData,
    filterData1:filterData1,
    addtocart:addtocart,
    removeItem:removeItem,
    addtowishlist:addtowishlist,
    wishlist:wishlist,
    wishlistTocart:wishlistTocart,
    placeOrder:placeOrder,
    sendOTP:sendOTP,
    changepassword:changepassword,
    authcheck:authcheck,
    myOrders:myOrders,
    profile:profile,
    editProfile:editProfile
   
}