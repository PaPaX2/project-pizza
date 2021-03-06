import {settings, select, classNames} from './settings.js';
import Product from './components/product.js';
import Cart from './components/cart.js';
import {Booking} from './components/booking.js';

const app = {

  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    let pagesMatchingHash = [];
    if (window.location.hash.length > 2) {

      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = [...thisApp.pages].filter(function(page) {
        return page.id == idFromHash;
      });
      thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);
    }
    else {
      thisApp.activatePage(thisApp.pages[0].id);
    }



    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        //get page id from href attribute
        const id = clickedElement.getAttribute('href').replace('#', '');

        // run thisApp.actvate page wih id attribute
        thisApp.activatePage(id);
        console.log('id',id);

        thisApp.cart = document.querySelector(select.containerOf.cart);
        thisApp.nav = document.querySelector(select.containerOf.nav);
        thisApp.carousel = document.querySelectorAll(select.containerOf.carousel);
        console.log('thisApp.carousel',thisApp.carousel);

        if (id == select.containerOf.landingpage){
          thisApp.cart.classList.add(classNames.cart.disabled);
          thisApp.nav.classList.add(classNames.nav.disabled);
        }

        if (id != select.containerOf.landingpage){
          thisApp.cart.classList.remove(classNames.cart.disabled);
          thisApp.nav.classList.remove(classNames.nav.disabled);
        }
        // change URL hash
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage(pageId){
    const thisApp =this;

    //Add class 'active' to matching pages, rmove from non matching
    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
      //console.log('page.id', page.id);
    }

    //Add class 'active' to matching links, rmove from non matching
    for (let link of thisApp.navLinks){
      //console.log('links', link);
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },

  initMenu: function () {
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
        //console.log('parsedResponce', parsedResponce);

        //save parsedResponce as this.App.data.products
        thisApp.data.products = parsedResponce;

        //execute initMenu method
        thisApp.initMenu();
      });
    //console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initPages();
    thisApp.initData(); //wykonanie metody initData
    //thisApp.initMenu(); //wykonanie metody initMenu, z uwagi na kożystanie z Ajax powinno być skasowane
    thisApp.initCart();
    thisApp.initBooking();
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

  initBooking: function() {
    const thisApp = this;

    const widgetBooking = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(widgetBooking);
    //console.log('widgetBooking', widgetBooking);
  },
};

app.init();
