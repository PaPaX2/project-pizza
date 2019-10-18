import {select, templates, classNames} from '../settings.js';
import {utils} from '../utils.js';
import AmountWidget from './amountWidget.js';

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
    thisProduct.imageWrapper  = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
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

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    //app.cart.add(thisProduct);
    //console.log('thisProduct', thisProduct.data.name);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}

export default Product;
