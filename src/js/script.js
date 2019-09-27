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
      thisProduct.processOrder(); //wykonanie metody process.Order
    }
    renderInMenu(){ //metoda tworząca/renderująca m.in nowy kod na stronie
      const thisProduct = this;

      //Generate HTML based on template
      const generatedHTML = templates.menuProduct(thisProduct.data);  //tworzenie kodu html przy użyciu Handlebars(templates) na podstawie argumentów z menuProducts(Select)

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
      });
    }

    processOrder() {
      const thisProduct = this;

      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData: ', formData);
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
          console.log('optionSelected: ', optionSelected);
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
            console.log('optionId: ', optionId);
            console.log('paramId: ', paramId);
          /* END LOOP: for each optionId in param.options */
          }

          // create const with chosen products images that have paramId and option Id

          const activeImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId);
          console.log('activeImages: ', activeImage);

          //const existImg = formData[paramId].indexOf(optionId);
          //console.log('optionSelectedImg', existImg);

          //START If prodct is selected and have image
          if (optionSelected && activeImage) {

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
      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem.innerHTML = price;
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
    },
  };

  app.init();
}

