const express = require('express')
const mainControlller = require("../Controllers/mainController")
const OtpController = require("../Controllers/OTPController")
const router = express.Router()
var multer = require("multer")
var storage = multer.diskStorage({});   
var upload = multer({storage:storage});

router.route("/").get(mainControlller.authorizeToken,mainControlller.home)
router.route("/login").get(mainControlller.authcheck, mainControlller.login)
router.route("/men/:page").get(mainControlller.authorizeToken,mainControlller.men)
router.route("/women/:page").get(mainControlller.authorizeToken,mainControlller.women)
router.route("/register").get(mainControlller.authcheck,mainControlller.register)
router.route("/contact").get(mainControlller.authorizeToken,mainControlller.contact)
router.route("/cart").get(mainControlller.authorizeToken,mainControlller.cart)
router.route("/product-details/:id").get(mainControlller.authorizeToken,mainControlller.productDetails)
router.route("/checkout").get(mainControlller.authorizeToken, mainControlller.checkout)
router.route("/product-form").get(mainControlller.productForm)
router.route("/product-save").post(upload.single("image"),mainControlller.product)
router.route("/register").post(mainControlller.registration)
router.route("/login").post( mainControlller.userLogin)
router.route("/logout").get(mainControlller.logout)
router.route("/filterData").get(mainControlller.filterData)
router.route("/filterData1").get(mainControlller.filterData1)
router.route("/addtocart").get(mainControlller.authorizeToken,mainControlller.addtocart)
router.route("/remove-item").post(mainControlller.authorizeToken,mainControlller.removeItem)
router.route("/addtowishlist").get(mainControlller.authorizeToken,mainControlller.addtowishlist)
router.route("/wishlist").get(mainControlller.authorizeToken,mainControlller.wishlist)
router.route("/wishlistTocart").post(mainControlller.authorizeToken,mainControlller.wishlistTocart)
router.route("/place-order").post(mainControlller.authorizeToken, mainControlller.placeOrder)
router.route("/send-OTP").post(mainControlller.sendOTP)
router.route("/change-password").post(mainControlller.changepassword)
router.route("/orders").get(mainControlller.authorizeToken,mainControlller.myOrders)
router.route("/payments-page").get(mainControlller.authorizeToken, OtpController.paymentPage)
router.route("/payment").post(mainControlller.authorizeToken,OtpController.charge)
router.route("/profile").get(mainControlller.authorizeToken, mainControlller.profile)
router.route("/edit-profile").post(mainControlller.authorizeToken,upload.single("image"), mainControlller.editProfile)



module.exports= router;


