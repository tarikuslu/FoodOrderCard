import { menuArray } from "./data.js";
let checkoutArray = [];
const totalPrice = document.getElementById("total");
const checkoutItemsEl = document.querySelector(".checkout-items");
const checkoutContainer = document.querySelector(".checkout-container");
const modal = document.querySelector(".modal");
const container = document.querySelector(".container");
const payButton = document.querySelector(".pay-btn");
function render() {
  console.log("rendered");
  const menu = document.querySelector(".menu-items");
  let itemHtml = "";

  menuArray.forEach((item) => {
    let ingEl = "";
    item.ingredients.forEach((ing) => {
      ingEl += `<span class="ingredient">${ing}</span>`;
    });
    itemHtml += `
        <div id="item-container">
        <div id="menu-icon">
           <span>${item.emoji}</span>
        </div>
        <div id="menu-info">
            <h3>${item.name}</h3>
            <div id="ingredients">
            ${ingEl}
            </div>
            <h4 class="price">$${item.price}</h4>
        </div>
        <div class="button-container">
        <button class="add-button">
        <i class="fa-regular fa-plus" id="btn-click" data-item-id ="${item.id}"></i>
        </button>
        </div>
        </div>
        `;
  });
  menu.innerHTML = itemHtml;
}

document.addEventListener("click", (e) => {
  if (e.target.id === "btn-click") {
    addOrder(e.target.dataset.itemId);
  } else if (e.target.id === "remove-item") {
    deleteOrder(e.target.dataset.itemId);
  } else if (e.target.classList.contains("checkout-btn")) {
    goCheckOut();
  } else if (e.target.classList.contains("pay-btn")) {
    let isFormValid = document.querySelector("form").checkValidity();
    if (!isFormValid) {
      document.querySelector("form").reportValidity();
    } else {
      e.preventDefault();
      console.log("hey");
      payConfirm(e);
    }
  }
});

function goCheckOut() {
  if (checkoutArray.length !== 0) {
    modal.style.display = "flex";
    container.style.backgroundColor = "rgba(0,0,0,0.1)";
  }
}

function payConfirm() {
  modal.style.display = "none";
  checkoutArray = [];
  checkoutItemsEl.innerHTML = " ";
  checkoutContainer.innerHTML = `<div class="confirm-order"><p>Thanks! Your order is on its way.</p></div>`;
  container.style.backgroundColor = "#fff";
  totalPrice.textContent = 0;
}

function addOrder(itemId) {
  checkoutContainer.classList.remove("hidden");
  const item = menuArray.filter((item) => {
    return item.id == itemId;
  })[0];
  let isContain = false;
  item.quantity++;
  checkoutArray.forEach((element) => {
    if (element.id === item.id) {
      isContain = true;
      return;
    }
  });

  if (isContain) {
    incrementQuantityPrice(item);
  } else {
    checkoutArray.push(item);
    if (item.name === "Pizza") {
      item.price = 14;
      totalPrice.textContent = Number(totalPrice.textContent) + 14;
    } else if (item.name === "Hamburger" || item.name === "Beer") {
      item.price = 12;
      totalPrice.textContent = Number(totalPrice.textContent) + 12;
    }
  }
  showCheckout();
}

function showCheckout() {
  let checkoutHtml = "";
  checkoutArray.forEach((item) => {
    checkoutHtml += `
    <div class="checkout-item">
    <p class="checkout-item-name">${item.name} <span> x${item.quantity}</span>  <a id="remove-item" data-item-id="${item.id}"> remove</a></p>
    <p class="checkout-price">$${item.price}</p>
    </div>
  `;
  });

  if (checkoutArray.length === 0) {
    checkoutContainer.classList.add("hidden");
  } else {
    checkoutItemsEl.innerHTML = checkoutHtml;
  }
}

function deleteOrder(itemId) {
  checkoutArray.forEach((item) => {
    if (item.id == itemId) {
      if (item.quantity > 1) {
        item.quantity--;
        decrementQuantityPrice(item);
      } else if (item.quantity === 1) {
        item.quantity--;
        checkoutArray = checkoutArray.filter((item) => item.id != itemId);
        decrementQuantityPrice(item);
      }
    }
  });
  showCheckout();
}

function decrementQuantityPrice(item) {
  if (item.name === "Pizza") {
    item.price -= 14;
    totalPrice.textContent = Number(totalPrice.textContent) - 14;
  } else if (item.name === "Hamburger" || item.name === "Beer") {
    item.price -= 12;
    totalPrice.textContent = Number(totalPrice.textContent) - 12;
  }
}

function incrementQuantityPrice(item) {
  if (item.name === "Pizza") {
    item.price += 14;
    totalPrice.textContent = Number(totalPrice.textContent) + 14;
  } else if (item.name === "Hamburger" || item.name === "Beer") {
    item.price += 12;
    totalPrice.textContent = Number(totalPrice.textContent) + 12;
  }
}

render();
