

import {select, templates} from '../settings.js';
import AmountWidget from './amountWidget.js';

export class Booking {
  constructor(){
    const thisBooking = this;
    thisBooking.render();
    thisBooking.initWidgets();
  }

  render(widgetBooking){
    const thisBooking = this;
    const generatedBookingHTML = templates.bookingWidget;
    console.log('generatedBookingHTML', generatedBookingHTML);

    thisBooking.dom = {};
    thisBooking.dom.wrapper = widgetBooking;
    thisBooking.dom.wrapper.innerHTML = generatedBookingHTML;

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
  }
}
