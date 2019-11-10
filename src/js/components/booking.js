

import {select, templates, settings, classNames} from '../settings.js';
import AmountWidget from './amountWidget.js';
import {DatePicker} from './datePicker.js';
import {HourPicker} from './hourPicker.js';
import { utils } from '../utils.js';

export class Booking {
  constructor(widgetBooking){ //dlaczego wszędzie widgetBooking?
    const thisBooking = this;
    thisBooking.render(widgetBooking);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.tableChoice();
    thisBooking.tableReservation();
  }
  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],

      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],

      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    //console.log('get Data Params:', params);

    const urls = {
      booking:        settings.db.url + '/' + settings.db.booking
                                      + '?' + params.booking.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.event
                                      + '?' + params.eventsRepeat.join('&'),
    };

    //console.log(urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];

        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        //console.log(bookings);
        //console.log(eventsCurrent);
        //console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};
    //console.log('thisBooking.booked', thisBooking.booked);
    for (let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for (let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  tableChoice(){
    const thisBooking = this;


    //Start loop for every table
    for (let table of thisBooking.dom.tables){

      //Add eventListener for clicked table
      table.addEventListener('click', function(event) {
        event.preventDefault();

        if (!table.classList.contains(classNames.booking.tableBooked)){

          //toggle teble for order
          table.classList.toggle(classNames.booking.newlyBooked);
        }
        else {
          console.log('table is already booked, chose another one');
        }
      });
    }
  }

  tableReservation(){
    const thisBooking = this;

    const button = thisBooking.dom.wrapper.querySelector(select.booking.submitBTN);
    thisBooking.options = [];

    button.addEventListener('click', function(event) {
      event.preventDefault();

      thisBooking.orderTable = thisBooking.dom.wrapper.querySelectorAll(select.booking.markedTables);

      thisBooking.selectedTables = [];
      thisBooking.reservation = [];

      for (let tTable of thisBooking.orderTable){

        //read chosen table number and parse its value to integer
        let table = tTable.getAttribute(settings.booking.tableIdAttribute);
        if (!isNaN(table)){
          table = parseInt(table);
        }
        thisBooking.selectedTables.push(table);
      }

      console.log('table id', thisBooking.selectedTables);

      for (let reservedTable of thisBooking.selectedTables) {
        let reservation = {
          id: '',
          date: thisBooking.datePicker.value,
          hour: thisBooking.hourPicker.value,
          table: reservedTable,
          repeat: 'false',
          duration: thisBooking.hoursAmount.value,
          ppl: thisBooking.peopleAmount.value,
          starters: [],
        };

        thisBooking.reservation.push(reservation);

        thisBooking.makeBooked(thisBooking.datePicker.value, thisBooking.hourPicker.value, thisBooking.hoursAmount.value, reservedTable);
        thisBooking.updateDOM();
      }

      //prepare object for sending to API
      console.log('Reservation for API', thisBooking.reservation);
      console.log('Reservation until refresh webpage', thisBooking.booked);
      for (let body of thisBooking.reservation){

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        };

        const url = settings.db.url + '/' + settings.db.booking;

        fetch(url, options)
          .then(function(responce){
            return responce.json();
          })
          .then(function(parsedResponce){
            console.log('parsedResponce', parsedResponce);
          });
      }
    });
  }

  updateDOM(){
    const thisBooking = this;
    const currentDate = thisBooking.datePicker.value;
    const currentHour = thisBooking.hourPicker.value;

    if (thisBooking.date !== currentDate || thisBooking.hour !== currentHour) {
      for (let table of thisBooking.dom.tables) {
        table.classList.remove(classNames.booking.newlyBooked);
      }
    }

    thisBooking.date = thisBooking.datePicker.value;
    //console.log(thisBooking.date);
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    //console.log(thisBooking.hour);
    let allAvaliable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvaliable = true;
    }

    for (let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if (!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvaliable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
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
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    //thisBooking.dom.table = thisBooking.dom.wrapper.querySelector(select.booking.tables);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount); //Dalczego, do czego te instancje?
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }
}
