/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
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
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product{
    constructor(id, data) { //argumenty dla funkcji constructora
      const thisProduct = this;
      thisProduct.id = id; //nadanie wartości
      //console.log('thisProduct.id: ', thisProduct.id);
      thisProduct.data = data; //nadanie wartości
      //console.log('thisProduct.data: ', thisProduct.data);
      thisProduct.renderInMenu(); //wykonanie metody renderInMenu
      thisProduct.getElements(); //wykonanie metody tworzącej skróty do obiektów i klas w html
      thisProduct.initAccordion(); //wykonanie metody initAccordion - tworzenie akordeonu - samodzielnie duo podpowiedzi
      thisProduct.initOrderForm(); //wykonanie metody initOrderForm
      thisProduct.initAmountWidget(); //wykonanie metody amountWidget
      thisProduct.processOrder(); //wykonanie metody processOrder


    }
    renderInMenu(){ //metoda tworząca/renderująca m.in nowy kod na stronie
      const thisProduct = this;

      //Generate HTML based on template
      const generatedHTML = templates.menuProduct(thisProduct.data);  //tworzenie kodu html przy użyciu Handlebars(templates) na podstawie argumentów z menuProducts(Select)
      //console.log('generatedHTML for renderInMenu', generatedHTML);
      //create element using utils.createDOMFromHTML
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);  //funkcja createDOMfromHTML została stworzona przez Kodilla na potrzbę tego projektu i znajduje się w utils w pliku functions.js

      //find menu container
      const menuContainer = document.querySelector(select.containerOf.menu); //stała w której jest kontener menu

      //add element to menu
      menuContainer.appendChild(thisProduct.element); //funkcja appendChild dodaje wartość thisProduct.element na koniec rodzica, którym jest menuContainer
      //console.log('thisProduct.element: ', thisProduct.element);
    }


    getElements(){ //Skopiowany gotowiec, skróty do wywołań klas w html
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      //console.log('thisProduct.accordionTrigger: ', thisProduct.accordionTrigger);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      //console.log('thisProduct.form: ', thisProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      //console.log('thisProduct.formInputs: ', thisProduct.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      //console.log('thisProduct.cartButton: ', thisProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      //console.log('thisProduct.priceElem: ', thisProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      //console.log('thisProduct.imageWrapper: ', thisProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);

    }

    initAccordion(){  //metoda tworząca akordeon, cała do wykonania samodzielnie
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      //const clickedTrigger = thisProduct.accordionTrigger;
      //console.log('clickedTigger: ', clickedTrigger);
      //Wykomentowane z uwagi na to, że w kolejneym ćwiczeniu przygotowane zostały skróty do elmentów - getElements

      /* START: click event listener to trigger */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {

        /* prevent default action for event */
        event.preventDefault();

        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle('active');

        /* find all active products */
        const activeProducts = document.querySelectorAll('#product-list .product.active');
        //console.log('activeProducts: ', activeProducts);
        /* START LOOP: for each active product */
        for (let actProduct of activeProducts) {

          /* START: if the active product isn't the element of thisProduct */
          if(actProduct != thisProduct.element) { //actProduct posiada różne wartości i typy danych niż thisProduct.element
            /* remove class active for the active product */
            actProduct.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
      /* END: click event listener to trigger */
      });
    }

    initOrderForm() {
      const thisProduct = this;
      //console.log('initOrderForm');

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });

      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }

    processOrder() {
      const thisProduct = this;

      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData: ', formData);

      //ADD new Add empty object
      thisProduct.params = {};

      /* set variable price to equal thisProduct.data.price */

      let price = thisProduct.data.price; //cena całego produktu
      //console.log('price: ', price);

      //LOOP for priceParams in params

      /* START LOOP: for each paramId in thisProduct.data.params */
      for (let paramId in thisProduct.data.params) {
      /* save the element in thisProduct.data.params with key paramId as const param */
        const param = thisProduct.data.params[paramId];

        /* START LOOP: for each optionId in param.options */
        for (let optionId in param.options) {

          /* save the element in param.options with key optionId as const option */
          const option = param.options[optionId];
          //console.log('option: ', option);

          /* START IF: if option is selected and option is not default */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          //console.log('optionSelected: ', optionSelected);
          if (optionSelected && !option.default){
            /* add price of option to variable price */
            price = price + option.price;
            //console.log('price: ', price);
            /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          else if (!optionSelected && option.default){
            /* deduct price of option from price */
            price = price - option.price;
            //console.log('optionId: ', optionId);
            //console.log('paramId: ', paramId);
          /* END LOOP: for each optionId in param.options */
          }

          // create const with chosen products images that have paramId and option Id

          const activeImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          //console.log('activeImages: ', activeImage);

          //const existImg = formData[paramId].indexOf(optionId);
          //console.log('optionSelectedImg', existImg);

          //START If prodct is selected and have image
          if (optionSelected && activeImage) {

            // NOWY wklejony KOD który może walić problemy
            if(!thisProduct.params[paramId]){
              thisProduct.params[paramId] = {
                label: param.label,
                options: {},
              };
            }
            thisProduct.params[paramId].options[optionId] = option.label;

            //ADD class 'active' for image
            activeImage.classList.add(classNames.menuProduct.imageVisible);
          }
          //ELSE when product is not selected
          else {

            // but product have image
            if (activeImage) {

              //REMOVE class 'active'
              activeImage.classList.remove(classNames.menuProduct.imageVisible);

              //END if product have image
            }
            //END else when product is not selected
          }

          /* END ELSE IF: if option is not selected and option is default */
        }

        /* END LOOP: for each paramId in thisProduct.data.params */
      }

      // multiply price by amount
      thisProduct.priceSingle = price;
      thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = thisProduct.price;
      //console.log('price: ', price);
      //console.log('thisProductParams: ', thisProduct.params);
    }

    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function() {
        thisProduct.processOrder();
      });

      //console.log('test', thisProduct.amountWidgetElem);
    }

    addToCart() {
      const thisProduct = this;

      thisProduct.data.name = thisProduct.name;
      thisProduct.amountWidget.value = thisProduct.amount;
      app.cart.add(thisProduct);
      console.log('thisProduct', thisProduct);
    }
  }
  class AmountWidget {
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value = settings.amountWidget.defaultValue;
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();

      //console.log('AmountWidget: ', thisWidget);
      //console.log('element: ', element);
    }

    getElements(element) {
      const thisWidget = this;
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      //console.log('newValue: ', newValue);
      //TO DO add validation
      if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
        thisWidget.value = newValue;
        thisWidget.announce();
      }

      thisWidget.input.value = thisWidget.value;
      //console.log('thisValue: ', value);

    }

    initActions () {
      const thisWidget = this;

      thisWidget.input.addEventListener('change', function() {
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
    announce(){
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }

  class Cart {
    constructor(element) {
      const thisCart = this;

      thisCart.products = [];

      thisCart.getElements(element);
      thisCart.initActions();
      console.log('New Cart: ', thisCart);
    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
      //console.log('thisCart.dom.toggleTrigger: ', thisCart.dom.toggleTrigger);
      thisCart.dom.productList = element.querySelector(select.cart.productList);

    }
    initActions() {
      const thisCart = this;

      //ADD trigger to cart after 'click'
      thisCart.dom.toggleTrigger.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Element was clicked', event);

        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
    }

    //Dodawanie zamówienia do menu koszyka
    add(menuProduct) {

      const thisCart = this;
      console.log('menuProduct: ', menuProduct);
      //Generate HTML based on template
      const generatedHTML = templates.cartProduct(menuProduct); //coś tu nie działa porównaj z linijką 109
      console.log('wartości do koszyka', generatedHTML);

      //changing generatedHTML into DOM elements
      const generatedDom = utils.createDOMFromHTML(generatedHTML);
      //console.log('generatedDom: ', generatedDom);
      //console.log('thisCart.dom.productList: ', thisCart.dom.productList);

      //ADD generatedDOM products to MenuCart
      thisCart.dom.productList.appendChild(generatedDom); //OK, ładuje w dobre miejsce
      //console.log('thisCart.dom.productList: ', thisCart.dom.productList);


    }
  }

  const app = {
    initMenu: function (){
      const thisApp = this;
      //console.log('thisApp.data: ', thisApp.data); //=dataSource - thisApp pobiera dane z pliku data.js
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
      //console.log('*** App starting ***');
      //console.log('thisApp:', thisApp);
      //console.log('classNames:', classNames);
      //console.log('settings:', settings);
      //console.log('templates:', templates);

      thisApp.initData(); //wykonanie metody initData
      thisApp.initMenu(); //wykonanie metody initMenu
      thisApp.initCart();
    },

    initCart: function () {
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

  };

  app.init();
}

