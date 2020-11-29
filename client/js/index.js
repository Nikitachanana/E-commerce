var index =0;
Move()
function Move(){
    var dots = document.querySelectorAll(".dot")
    var banner = document.querySelectorAll(".banner")
    var i;
    for(i=0; i<banner.length; i++){
        banner[i].style.display ="none"
    }
    index++
    if(index>banner.length){index=1}
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }
      banner[index-1].style.display = "grid";  
        dots[index-1].className += " active";
        setTimeout(Move, 2000); 
}
setTimeout(function () {document.querySelector(".message").style.display='none'}, 3000); 




function InvalidMsg(textbox) { 
  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var specialChars= /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
  if (textbox.value.length < 8 || !(textbox.value.match(lowerCaseLetters)) || !(textbox.value.match(upperCaseLetters) || !(textbox.value.match(specialChars)))) { 
      textbox.setCustomValidity 
            ('minimum 8 characters,one lowercase, one uppercase letter and a special character'); 
  }
  else{
      textbox.setCustomValidity("")
  }
  return true; 
} 

const Logout = ()=>{
  axios.get("/logout").then(()=>{
    window.location = "/login"
  })
}


function OpenNavBar() {
  document.getElementById("mySidenav").style.width = "8rem";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}


function AddToCart(id){
  axios.get("/addtocart",{params:{id:id}}).then((res)=>{
    console.log(res)
    window.location.href = "/product-details/"+id
  })
}
function addToWishlist(id){
  axios.get("/addtowishlist",{params:{id:id}}).then((res)=>{
    console.log(res)
    window.location.href = "/product-details/"+id
  })
}

function RemoveItem(id){
  axios.post("/remove-item",null,{params:{id:id}}).then((res)=>{
    console.log(res)
    window.location.href= "/cart"
  })
}

function wishlistTocart(id){
  axios.post('/wishlistTocart',null,{params:{id:id}}).then(res=>{
    console.log(res)
    window.location.href = "/wishlist"
  })
}