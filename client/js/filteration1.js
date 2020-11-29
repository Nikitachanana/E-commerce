var checkBoxes = document.querySelectorAll("input[type=checkbox]");
console.log(checkBoxes);
for (i of checkBoxes) {
  i.addEventListener("change", filterData);
}
var filters = document.querySelector(".filterData").innerHTML.split(",");
console.log("filters = ", filters);
for (i of checkBoxes) {
  for (j of filters) {
    if (i.value === j) {
      i.setAttribute("checked", "true");
    }
  }
}
var closeButton = document.querySelectorAll(".close_filter");
for (i of closeButton) {
  i.addEventListener("click", removeFilter);
}
function removeFilter(e) {
  var filter = e.target.parentElement.innerHTML.split(" <")[0];
  for (i of checkBoxes) {
    if (i.value === filter) {
      console.log(i);
      i.click();
    }
  }
}

function filterData(e) {
  var brand, price, ratings;
  console.log(e.target.value);
  if (this.checked) {
    this.setAttribute("checked", "true");
  } else if (!this.checked) {
    this.setAttribute("checked", "false");
  }

  if (e.target.name == "brand") {
    brand = e.target.value;
    var params = {
      brand: brand,
      price: price,
      ratings: ratings,
    };
  } else if (e.target.name == "price") {
    price = e.target.value;
    var params = {
      brand: brand,
      price: price,
      ratings: ratings,
    };
  } else if (e.target.name == "ratings") {
    ratings = e.target.value;
    var params = {
      brand: brand,
      price: price,
      ratings: ratings,
    };
  }
  axios.get("/filterData1", { params: params }).then((res) => {
    console.log(res);
    window.location.href = "/women/1";
  });
}

// var dropButton = document.querySelector(".dropdown");
// console.log(dropButton);
// dropButton.addEventListener("click", () => {
//   console.log("HEY");
//   var dropdownlist = document.querySelector(".list");
//   dropdownlist.classList.toggle("showDropdown");
// });

// const Logout = () => {
//   axios.get("/logout").then(() => {
//     window.location = "/login";
//   });
// };
