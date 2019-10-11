import {select, settings} from '../settings.js';
import BaseWidget from './baseWidget.js';
import {utils} from '../utils.js';

export class HourPicker extends BaseWidget {

  constructor(wrapper){
    super (wrapper, settings.hours.open);
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.initPlugin();
    thisWidget.dom.output = thisWidget.value;
  }

  initPlugin(){
    const thisWidget = this;

    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListner('input', function() {
      thisWidget.value = thisWidget.dom.input;
    });
  }

  parseValue(value){
    return utils.numberToValue(value);
  }

  isValid(){
    return true;
  }

  renderValue(){
    const thisWidget = this;
    thisWidget.dom.output = thisWidget.value;
  }
}
