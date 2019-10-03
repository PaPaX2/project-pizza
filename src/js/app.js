import {settings, select} from './settings.js';
import Product from './components/product.js';
import Cart from './components/cart.js';

const app = {
  initMenu: function (){
    const thisApp = this;
    //console.log('thisApp.data: ', thisApp.data); //=dataSource - thisApp pobiera dane z pliku data.js
    for(let productData in thisApp.data.products){  //pętla iterująca po products w zewnętrznym pliku data
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]); //dodanie instancji dla każdego produktu wraz z argumentami
    }
  },

  initData: function(){   // initData - metoda do pobierania danych z innych źródeł
    const thisApp = this;

    thisApp.data = {}; // (dataSource) zamienione na {} - stała zadeklarowana w pliku src/js/data.js w której są produkty na pizze
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponce){
        return rawResponce.json();
      })
      .then(function(parsedResponce){
        console.log('parsedResponce', parsedResponce);

        //save parsedResponce as this.App.data.products
        thisApp.data.products = parsedResponce;

        //execute initMenu method
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initData(); //wykonanie metody initData
    //thisApp.initMenu(); //wykonanie metody initMenu, z uwagi na kożystanie z Ajax powinno być skasowane
    thisApp.initCart();
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

};

app.init();
