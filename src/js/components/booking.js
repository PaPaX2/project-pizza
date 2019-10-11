

import {select, templates} from '../settings.js';
import AmountWidget from './amountWidget.js';
import {DatePicker} from './datePicker.js';

export class Booking {
  constructor(widgetBooking){ //dlaczego wszędzie widgetBooking?
    const thisBooking = this;
    thisBooking.render(widgetBooking);
    thisBooking.initWidgets();
  }

  render(widgetBooking){
    const thisBooking = this;
    const generatedBookingHTML = templates.bookingWidget();
    //console.log('generatedBookingHTML', generatedBookingHTML);

    thisBooking.dom = {};
    thisBooking.dom.wrapper = widgetBooking;
    //console.log('thisBooking.dom.wrapper', thisBooking.dom.wrapper);
    thisBooking.dom.wrapper.innerHTML = generatedBookingHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount); //Dalczego, do czego te instancje?
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }
}
