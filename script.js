const removeCart = document.querySelector('.empty-cart');
const localStorageArray = [];
let total = 0;
let getLocalStorage;
if (localStorage.getItem('id') !== null) {
  getLocalStorage = localStorage.getItem('id').split(',');
}
const boxCart = document.querySelector('.cart');

const userAction = async (target) => {
  const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${target}`);
  const myJson = await response.json(); // extract JSON from the http response
  return myJson;
};

const getAPI = userAction('computador');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

boxCart.appendChild(createCustomElement('p', 'total-price', `${total}`));
const totalPrice = document.querySelector('.total-price');

function cartItemClickListener(event) {
 event.target.remove();
 const getElement = event.target.innerText.split(' ');
 const value = parseFloat(getElement[getElement.length - 1].replace('$', '')); 
 total = parseFloat(total - value);
 totalPrice.innerText = `${total}`;
 if (document.querySelectorAll('.cart__item').length === 0) {
  total = 0;
  totalPrice.innerText = `${total}`;
}
}

function cartClear() {
  const allItems = document.querySelectorAll('.cart__item');
  allItems.forEach((each) => {
    each.remove();
  });
  total -= total;
  totalPrice.innerText = `${total}`;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  const add = 'Adicionar ao carrinho!';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', add));

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function createCartItemElement(sku, name, salePrice) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
}

async function addToCart(item) {
  const itemInAPI = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const itemInJSON = await itemInAPI.json();
  const itemTitle = itemInJSON.title;
  const itemId = itemInJSON.id;
  const itemPrice = itemInJSON.price;
  createCartItemElement(itemId, itemTitle, itemPrice);
  localStorageArray.push(itemId);
  localStorage.setItem('id', localStorageArray);
  total += parseFloat(itemPrice);
  totalPrice.innerText = `${total}`;
  }

  function getIdOfItem(event) {
    const itemId = event.target.parentNode.firstChild.innerText;
    addToCart(itemId);
  }

const createList = async () => {
  const section1 = document.querySelector('.items');
  getAPI.then((element) => element.results.forEach((obj) => {
  section1.appendChild(createProductItemElement(obj.id, obj.title, obj.thumbnail));
}));
};

const addEventInButtons = async (type, event) => {
  const buttons = document.querySelectorAll('.item__add');
    buttons.forEach((but) => {
      but.addEventListener(type, event);
      });
};

 window.onload = async () => {
   await userAction();
   await createList();
   await addEventInButtons('click', getIdOfItem);
   getLocalStorage.forEach((itemId) => {
    addToCart(itemId);
   });
   removeCart.addEventListener('click', cartClear);
  };