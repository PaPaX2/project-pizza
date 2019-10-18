
tableReservation(){
  const thisBooking = this;

  const url = settings.db.url + '/' + settings.db.booking;
  let reservation = {};

  const button = thisBooking.dom.wrapper.querySelector(select.booking.submitBTN);
  console.log('button', button);

  button.addEventListener('click', function(event) {
  event.preventDefault();
  console.log('click');
  });

  //Start loop for every table
  for (let table of thisBooking.dom.tables){

    //Add eventListener for clicked table
    table.addEventListener('click', function(event) {
      event.preventDefault();
      console.log(thisBooking.dom.tables);

      //Add variable for current time and data into object
      let currentData = thisBooking.datePicker.value;
      let currentHour = thisBooking.hourPicker.value;
      console.log('currentData', currentData);
      console.log('currentHour', currentHour);

      //check if table isn't booked

      //toggle class booked on selected table
      table.classList.add(classNames.booking.tableBooked);

      //read chosen table number and save to variable
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      console.log('tableId', tableId);
    });

    //Prepare object for send to API
    let reservation = {
      id: '',
      date: currentData,
      hour: currentHour,
      table: tableId,
      repeat: 'false',
      duration: '',
      ppl: 3,
      starters: [],
    };
    console.log('reservation', reservation);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservation),
      };

    fetch(url, options)
      .then(function(responce){
        return responce.json();
      })
      .then(function(parsedResponce){
      console.log('parsedResponce', parsedResponce);
      });
  }
    console.log('table', reservation);

}
