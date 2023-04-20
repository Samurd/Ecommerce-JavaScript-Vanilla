// Variables //

const btnMenu = document.querySelector(".btn--menu");
const btnCart = document.querySelector(".btn--cart");
const menu = document.querySelector(".menu");
const cart = document.querySelector(".cart");
const btnCloseMenu = document.querySelector(".btn--close-menu");
const btnCloseCart = document.querySelector(".btn--close-cart");
const containerProducts = document.querySelector(".products__container")
const modal = document.querySelector(".modal");
const btnCloseModal = document.querySelector(".modal--close");
const imageModal = document.querySelector(".modal__image img");
const titleModal = document.querySelector(".modal__title");
const priceModal = document.querySelector(".modal__price");
const descModal = document.querySelector(".modal__description");
const categoryModal = document.querySelector(".modal__category");
const stockModal = document.querySelector(".modal__stock");
const btnNotifyCart = document.querySelector(".btn--cart-notify");
const emptyCart = document.querySelector(".cart--empty");
const containerConfirmEmptyCart = document.querySelector(".confirm");
const btnConfirmEmptyCartAccept = document.querySelector(".confirm--accept");
const btnCancelEmptyCartAccept = document.querySelector(".confirm--cancel");
const confirmMessage = document.querySelector(".confirm__message");
const btnModalAdd = document.querySelector(".modal--add");
const alertStockContainer = document.querySelector(".alert");
const alertBtnAccept = document.querySelector(".alert--accept");
const header = document.querySelector(".header");
const btnCheckout = document.querySelector(".cart--checkout");
const discountCart = document.querySelector(".cart--checkout");
const btnDiscount= document.querySelector(".discount__form-btn");
const inputDiscount = document.querySelector(".discount__form-input");
const subTotal = document.querySelector(".cart--subtotal");
const totalText = document.querySelector(".cart--total");
const iva = document.querySelector(".cart--tax");
const discountText = document.querySelector(".cart--discount");
const discountMessage = document.querySelector(".discount__message");
const notifyAddProduct = document.querySelector(".notifyAdd-product");


const notifyShow = () => notifyAddProduct.classList.add("show-nofify--product");
const removeNotifyAddProduct = () => setTimeout(() => {notifyAddProduct.classList.remove("show-nofify--product")}, 1300);

document.addEventListener("DOMContentLoaded", () => {
    cartArray = JSON.parse(localStorage.getItem("cart")) || [];
    seeCartBody();
    saveStorage();
    load();
    darkTheme()
})


function load () {
  const load = document.getElementById('load')
  if (load) {
    setTimeout(() => {
      load.style.display = 'none'
    }, 2200)
  }
}


function darkTheme () {
  const themeButton = document.querySelector('#theme-button')
  const darkTheme = 'dark-theme'
  const iconTheme = 'bx-sun'

  const selectedTheme = window.localStorage.getItem('selected-theme')
  const selectedIcon = window.localStorage.getItem('selected-icon')

  const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
  const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun'

  if (selectedTheme) {
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme)
  }

  themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    window.localStorage.setItem('selected-theme', getCurrentTheme())
    window.localStorage.setItem('selected-icon', getCurrentIcon())
  })
}

async function callApiProduct () {

    try {
        const response = await fetch("https://ecommercebackend.fundamentos-29.repl.co/")
        const data = await response.json()
        
        renderProducts(data)
    } catch {
        console.log(error);
    }

}

callApiProduct()

function renderProducts (data) {
    let products = ''

    data.forEach((element) => {
        products = products + `<article class="product">
        <div class="product__container">
          <div class="product__img">
            <img loading="lazy" src="${element.image}" alt="${element.name}">
            
          </div>  
          <div class="product__content">
            <div class="product__content-info">
              <h3 class="product__title">${element.name}</h3>
              <span class="product__price">$${element.price.toFixed(2)}</span>
            </div>
            <div class="product__content-details">
              <div class="product__actions">
              <button type="button" class="product__actions-btn product--add" data-id="${element.id}" onclick=addProduct(${element.id})>
                  <i class='bx bx-shopping-bag'></i> Agregar
              </button>
              <button type="button" class="product__actions-btn product--view" data-id="${element.id}"onclick=detailProduct(${element.id})>
                 <i class='bx bx-show'></i> Detalles
              </button>
            </div>  
            </div>
          </div>
        </div>
      </article>`

    })

    containerProducts.innerHTML = products;


}


async function detailProduct(idProduct) {
    try {
        const response = await fetch("https://ecommercebackend.fundamentos-29.repl.co/")
        const data = await response.json()

        for (const element of data) {
            if (idProduct == element.id) {
                modal.classList.add("show-modal");
                imageModal.src = element.image;
                imageModal.alt = element.name;
                titleModal.textContent = element.name;
                priceModal.textContent = `$${element.price}`
                descModal.textContent = element.description;
                categoryModal.textContent = element.category;
                stockModal.textContent = `Disponibles: ${element.quantity}`   
            }
        }


    } catch {
        console.log(error);
    }
}

// CART ///

let ivaPorcent = 1.03
let discountNumber = 0
let discountDefault;

let codesDiscount = [
  {
  name: "academlo",
  discount: 90
  },
  {
    name: "samuel",
    discount: 20
  }
]


let cartArray = [];


let total = (cart) => cart.reduce((acc, product) => acc + product.count * product.price * ivaPorcent, 0).toFixed(2);

async function addProduct(id) {
    const response = await fetch("https://ecommercebackend.fundamentos-29.repl.co/")
    const data = await response.json()
    const item = data.find((prod) => prod.id === id)

    if(cartArray.some(prod => prod.id === id)) {
      const index =cartArray.findIndex(prod => prod.id === id);
      cartArray[index].count++;

    } else {
      item.count = 1;
      cartArray.push(item)
    }

    notifyShow();
    removeNotifyAddProduct();


    cartArray.forEach(product => {
        if (product.count > product.quantity) {
          product.count = product.quantity
          alertStockContainer.classList.add("show-modal");
          notifyAddProduct.classList.remove("show-nofify--product")
        }
    })
    
    updateCartNotify()
    seeCartBody();
}





function confirmModalEmptyCart() {
  containerConfirmEmptyCart.classList.add("show-modal");
  confirmMessage.textContent = `¿Quieres vaciar el carrito?`
  btnCancelEmptyCartAccept.style.display = 'flex'
  btnCancelEmptyCartAccept.textContent = 'Cancelar'
}


 function ifTheCartIsEmpty () {
  containerConfirmEmptyCart.classList.add("show-modal");
  confirmMessage.textContent = `No hay productos para eliminar`
  btnCancelEmptyCartAccept.style.display = 'none'
 }

function seeCartBody() {
    const cartBody = document.querySelector(".cart__body")

    cartBody.innerHTML = ''

    cartArray.forEach((prod) => {
        let {id, name, image, quantity, count , price} = prod;
        cartBody.innerHTML += `<article class="article">
        <div class="article__image">
          <img src="${image}" alt="${name}">
          <span class="article__price">$${price}</span>
        </div>
    
        <div class="article__header">
          <h3 class="article__title">${name}</h3>
          <button type="button" class="article__remove" data-id="${id}" onclick=removeProduct(${id})>
             <i class='bx bx-trash' ></i>
          </button>
        </div>
        
        <div class="article__body">
          <span class="article__stock">${quantity} disponibles</span>
          <div class="article__quantity">
            <button type="button" class="article__quantity-btn article--minus" data-id="${id}" onclick=removeCartWithMinus(${id})>
                <i class='bx bx-minus'></i>
            </button>
            <span class="article__quantity-count">${count}</span>
            <button type="button" class="article__quantity-btn article--plus" data-id="${id}" onclick=addCartWithPlus(${id})>
                <i class='bx bx-plus' ></i>
            </button>
          </div>
          <span class="article__subtotal">$${count * price}</span>
        </div>
      </article>`
    })


    if(cartArray.length === 0) {
        cartBody.innerHTML = `
        <span class="cart__empty-text">Tu canasta esta vacia</span>`
        btnNotifyCart.classList.remove("show--notify")
    }

    iva.textContent = `$${ivaPorcent}%`

    
    subTotal.textContent = `$${cartArray.reduce((acc, product) => acc + product.count * product.price, 0).toFixed(2)}`

    totalText.textContent = `$${total(cartArray)}`

    updateCartNotify()
    saveStorage();
}


function removeCartWithMinus(id) {
  if (cartArray.some((prod) => prod.id === id)) {
    const index =cartArray.findIndex(prod => prod.id === id);
    cartArray[index].count--;
    seeCartBody()
  } if(cartArray.some(prod => prod.count < 1)) {
    removeProduct(id)
    seeCartBody()
  }

  updateCartNotify()
}

function addCartWithPlus(id){
  if(cartArray.some(prod => prod.id === id)) {
    const index =cartArray.findIndex(prod => prod.id === id);
    cartArray[index].count++;
  }

  cartArray.forEach(product => {
    if (product.count > product.quantity) {
      product.count = product.quantity
      alertStockContainer.classList.add("show-modal")
    }
  })

  seeCartBody()
  updateCartNotify()

}

function updateCartNotify() {
  let newBtnNotifyCart = cartArray.reduce((acc, product) => acc + product.count, 0);
  btnNotifyCart.textContent = `${newBtnNotifyCart}`

  if(cartArray.length === 0) {
    btnNotifyCart.classList.remove("show--notify")
  } else {
    btnNotifyCart.classList.add("show--notify")
  }
}


function removeProduct(id) {
    const productId = id;
    cartArray = cartArray.filter((prod) => prod.id !== productId)
    seeCartBody()
    updateCartNotify();
}

function saveStorage() {
    localStorage.setItem("cart", JSON.stringify(cartArray));
    localStorage.setItem("notifyCart", JSON.stringify(btnNotifyCart.textContent))
}





window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    header.style = 'background-color: var(--container-color); box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.341); '
  } else {
    header.style = ''
  }
})


btnCheckout.addEventListener("click", () => {

cartArray.length = []
seeCartBody();

});

alertBtnAccept.addEventListener("click", () => alertStockContainer.classList.remove("show-modal"));


btnCancelEmptyCartAccept.addEventListener("click", () => {
  containerConfirmEmptyCart.classList.remove("show-modal")
})

btnConfirmEmptyCartAccept.addEventListener("click", () => {
  cartArray.length = []
  containerConfirmEmptyCart.classList.remove("show-modal")
  seeCartBody();
})

emptyCart.addEventListener("click", () => {
  if (cartArray.length > 0) {
    confirmModalEmptyCart();
    seeCartBody();
  } else {
    ifTheCartIsEmpty()
  }
});

btnCloseModal.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});

btnMenu.addEventListener("click", () => {
    menu.classList.add("show--menu");
})


btnCloseMenu.addEventListener("click", () => {
    menu.classList.remove("show--menu");
})

btnCloseCart.addEventListener("click", () => {
    cart.classList.remove("show--cart");
})


btnCart.addEventListener("click", () => {
    cart.classList.add("show--cart");
})


