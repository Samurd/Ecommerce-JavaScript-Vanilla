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

let cartArray = [];



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
          <div class="product__overlay"></div>
          <div class="product__img">
            <img loading="lazy" src="${element.image}" alt="${element.name}">
            
          </div>  
          <div class="product__actions">
            <button type="button" class="product__actions-btn product--add" data-id="1" onclick=addProduct(${element.id})>
                <i class='bx bx-basket'></i> Agregar
            </button>
            <button type="button" class="product__actions-btn product--view" data-id="${element.id}"onclick=detailProduct(${element.id})>
               <i class='bx bx-show'></i> Detalles
            </button>
          </div>  
          <div class="product__content">
            <div class="product__content-info">
              <h3 class="product__title">${element.name}</h3>
              <span class="product__price">$${element.price}</span>
              <span class="product__category">${element.category}</span>
              <span class="product__stock">
                disponibles: <span class="product__stock-quantity">${element.quantity}</span>
              </span>
            </div>
            <div class="product__content-details">
              <h4 class="detail__text">Medidas</h4>
              <span class="sizes">XS, S, M, L, XL, XXL</span>
              <h4 class="detail__text">Colores</h4>
              <div class="colors">
                <span class="colors__color color--black"></span>
                <span class="colors__color color--blue"></span>
                <span class="colors__color color--red"></span>
                <span class="colors__color color--grey"></span>
              </div>
            </div>
          </div>
        </div>
      </article>`
    })

    containerProducts.innerHTML = products;
    btnNotifyCart.classList.add("show--notify");
}


async function detailProduct(idProduct) {
    try {
        const response = await fetch("https://ecommercebackend.fundamentos-29.repl.co/")
        const data = await response.json()

        for (const element of data) {
            if (idProduct == element.id) {
                modal.style = 'animation: 300ms ease 0s 1 normal none running fade-in; top: 0'
                imageModal.src = element.image
                imageModal.alt = element.name
                titleModal.textContent = element.name
                priceModal.textContent = `$${element.price}`
                descModal.textContent = element.description
                categoryModal.textContent = element.category
                stockModal.textContent = `Disponibles: ${element.quantity}`   
            }
        }

    } catch {
        console.log(error);
    }
}


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

    cartArray.forEach(product => {
        if (product.count > product.quantity) {
          product.count = product.quantity
          alertStockContainer.style = 'animation: 300ms ease 0s 1 normal none running fade-in; top: 0'
        }
    })
    
    updateCartNotify()
    seeCartBody();
}


function confirmModalEmptyCart() {
  containerConfirmEmptyCart.style = 'animation: 300ms ease 0s 1 normal none running fade-in; top: 0'
  confirmMessage.textContent = `¿Quieres vaciar el carrito?`
  btnCancelEmptyCartAccept.style.display = 'flex'
  btnCancelEmptyCartAccept.textContent = 'Cancelar'
}


 function ifTheCartIsEmpty () {
  containerConfirmEmptyCart.style = 'animation: 300ms ease 0s 1 normal none running fade-in; top: 0'
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
          <button type="button" class="article__remove" data-id="2" onclick=removeProduct(${id})>
             <i class='bx bx-trash' ></i>
          </button>
        </div>
        
        <div class="article__body">
          <span class="article__stock">${quantity} disponibles</span>
          <div class="article__quantity">
            <button type="button" class="article__quantity-btn article--minus" data-id="2" onclick=removeCartWithMinus(${id})>
                <i class='bx bx-minus'></i>
            </button>
            <span class="article__quantity-count">${count}</span>
            <button type="button" class="article__quantity-btn article--plus" data-id="2" onclick=addCartWithPlus(${id})>
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


    const subTotal = document.querySelector(".cart--subtotal")
    
    subTotal.textContent = `$${cartArray.reduce((acc, product) => acc + product.count * product.price, 0)}`

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
      alertStockContainer.style = 'animation: 300ms ease 0s 1 normal none running fade-in; top: 0'
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



alertBtnAccept.addEventListener("click", () => alertStockContainer.style = '')


btnCancelEmptyCartAccept.addEventListener("click", () => {
  containerConfirmEmptyCart.style = ''
})

btnConfirmEmptyCartAccept.addEventListener("click", () => {
  cartArray.length = []
  seeCartBody();
  containerConfirmEmptyCart.style = ''
})

emptyCart.addEventListener("click", () => {
  if (cartArray.length > 0) {
    confirmModalEmptyCart();
    seeCartBody();
  } else {
    ifTheCartIsEmpty()
  }
})

btnCloseModal.addEventListener("click", () => {
  modal.style = ''
})

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


