
import {select, settings} from '../settings.js';
import BaseWidget from './baseWidget.js';
import {utils} from '../utils.js';
//import flatpickr from 'flatpickr';

export class DatePicker extends BaseWidget {
  constructor(wrapper){
    super (wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);

    thisWidget.initPlugin();
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);

    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    console.log('minDate: ', thisWidget.minDate);
    console.log('maxDate: ', thisWidget.maxDate);

    //const flatpickr = require('flatpickr');


    flatpickr(thisWidget.dom.input,{
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable': [
        function(date){
          return (date.getDay() === 1);
        }
      ],
      'locale': {
        'firstDayOfWeek': 1
      },

      onChange: function(selectedDated, dateStr) {
        thisWidget.newValue = dateStr;
        console.log('thisWidget.newValue', thisWidget.newValue);
        thisWidget.value = thisWidget.newValue;
      }
    });
    console.log('thisWidget.value', thisWidget.value);



    //do tego momentu działa, trzeba zrobić:
    // 2.4 zainicjować plugin flatpicker
    //3, 4, 5

  }

}

