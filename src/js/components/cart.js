import {settings, select, templates, classNames} from '../settings.js';
import {utils} from '../utils.js';
import CartProduct from './cartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    //console.log('thisCart.deliveryFee', thisCart.deliveryFee);

    thisCart.getElements(element);
    thisCart.initActions();
    //console.log('New Cart: ', thisCart);
  }
  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    //console.log('thisCart.dom.toggleTrigger: ', thisCart.dom.toggleTrigger);

    thisCart.dom.productList = element.querySelector(select.cart.productList);

    thisCart.renderTotalKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];

    for (let key of thisCart.renderTotalKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

    thisCart.dom.form = element.querySelector(select.cart.form);

    thisCart.dom.phone = element.querySelector(select.cart.phone);

    thisCart.dom.address = element.querySelector(select.cart.address);
  }

  initActions() {
    const thisCart = this;

    //ADD trigger to cart after 'click'
    thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
      event.preventDefault();
      //console.log('Element was clicked', event);

      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function() {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function() {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;

    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalprice,
      deliveryFee: thisCart.deliveryFee,
      products: [], //pusta tablica dla produktów pobranych z metody getData poniżej
    };

    for (let product of thisCart.products) {
      payload.products.push(product.getData()); //wepchnięcie do tablicy produktów z metody getData
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(responce){
        return responce.json();
      })
      .then(function(parsedResponce){
        console.log('parsedResponce', parsedResponce);
      });
  }

  //Dodawanie zamówienia do menu koszyka
  add(menuProduct) {

    const thisCart = this;
    //console.log('menuProduct: ', menuProduct);
    //Generate HTML based on template
    const generatedHTML = templates.cartProduct(menuProduct); //coś tu nie działa porównaj z linijką 109
    //console.log('wartości do koszyka', generatedHTML);

    //changing generatedHTML into DOM elements
    const generatedDom = utils.createDOMFromHTML(generatedHTML);
    //console.log('generatedDom: ', generatedDom);
    //console.log('thisCart.dom.productList: ', thisCart.dom.productList);

    //ADD generatedDOM products to MenuCart
    thisCart.dom.productList.appendChild(generatedDom); //OK, ładuje w dobre miejsce
    //console.log('thisCart.dom.productList: ', thisCart.dom.productList);

    thisCart.products.push(new CartProduct(menuProduct, generatedDom));
    //console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  //Remove products from Cart - Odejmowanie usuniętych produktów z koszyka

  remove(cartProduct) {
    const thisCart = this;
    //Declare const index where its value will be index of cartProduct in array thisCart.products
    const index = thisCart.products.indexOf(cartProduct);
    //console.log('thisCart.products', thisCart.products);
    //console.log('index: ', index);

    //execute splice method to remove index from thisCart.product
    thisCart.products.splice(index, 1);

    //console.log('cartProduct.dom.wrapper: ', cartProduct.dom.wrapper);

    //remove dom element
    cartProduct.dom.wrapper.remove();

    //execute method 'update'
    thisCart.update();
  }


  update() {
    const thisCart = this;

    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;


    for (let product of thisCart.products){ //dlaczego to działa -let product?

      thisCart.totalNumber += product.amount;
      console.log ('Amount of products: ', product.amount);

      thisCart.subtotalPrice += product.price;
      console.log ('Price for products: ', product.price);
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log('thisCart.totalPrice', thisCart.totalPrice);

    for (let key of thisCart.renderTotalKeys) {
      for(let elem of thisCart.dom[key]){
        elem.innerHTML = thisCart[key];
      }
    }
  }
}

export default Cart;
