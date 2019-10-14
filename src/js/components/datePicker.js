import {select, settings} from '../settings.js';
import BaseWidget from './baseWidget.js';
import {utils} from '../utils.js';

export class DatePicker extends BaseWidget {

  constructor(wrapper){
    super (wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
    thisWidget.dom.input.value = thisWidget.value;
  }


  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);

    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

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
      onChange: function(dateStr) {
        thisWidget.value = dateStr;
      }
    });

  }

  parseValue (value){
    return value;
  }

  isValid(){
    return true;
  }

  renderValue(){}
}



