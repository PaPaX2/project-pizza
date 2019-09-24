/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product{
    constructor(id, data){; //argumenty dla funkcji constructora
      const thisProduct = this;
      thisProduct.id = id; //nadanie wartości
      thisProduct.data = data; //nadanie wartości

      thisProduct.renderInMenu(); //wykonanie metody renderInMenu

      console.log('thisProduct: ', thisProduct);
    }
    renderInMenu(){ //metoda tworząca/renderująca m.in nowy kod na stronie
      const thisProduct = this;

      //Generate HTML based on template

      //create element using utils.createElementFromHTML

      //find menu container

      //add element to menu

    }
  }

  const app = {
    initMenu: function (){
      const thisApp = this;
      console.log('thisApp.data: ', thisApp.data); //=dataSource - thisApp pobiera dane z pliku data.js
      for(let productData in thisApp.data.products){  //pętla iterująca po products w zewnętrznym pliku data
        new Product(productData, thisApp.data.products[productData]); //dodanie instancji dla każdego produktu wraz z argumentami
      }

    },

    initData: function(){   // initData - metoda do pobierania danych z innych źródeł
      const thisApp = this;

      thisApp.data = dataSource; // dataSource - stała zadeklarowana w pliku src/js/data.js w której są produkty na pizze
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData(); //wykonanie metody initData
      thisApp.initMenu(); //wykonanie metody initMenu
    },
  };

  app.init();
}
