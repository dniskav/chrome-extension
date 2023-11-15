console.log('Miles+ auto fill extension working!');
let result = {};
let i_von = document.querySelector('[name=i_von]');
let i_bis = document.querySelector('[name=i_bis]');
let autoFillBtnContainer = document.querySelector("#delayedDisplay > form > table > tbody > tr:nth-child(1) > td:nth-child(2)");
let weekFields = [...document.querySelectorAll("#delayedDisplay > form > table > tbody input[type=text]")];
let holidays = [];
let weekDays = [...document.querySelectorAll("#delayedDisplay > form > table > tbody > tr:nth-child(1) input[name=i_datum]")].map(e => {
  let arr = e.value.split('.');

  return [
    Math.floor(arr[0]),
    Math.floor(arr[1]),
    Math.floor(arr[2]),
  ];
});


async function loadData() {
  
  let result = await chrome.storage.sync.get(["holidaysPerYear"]);
  holidays = result.holidaysPerYear.holidays;
  addAutoFillButton();

  console.log('data? ', holidays, weekDays);
};

function addAutoFillButton() {
  let autoFillButton = document.createElement('input')
  autoFillButton.id = "autofillBtn";
  autoFillButton.type = "button";
  autoFillButton.value = "Autofill Week";
  autoFillButton.setAttribute('class', 'head_big');
  autoFillButton.onclick = fillWeek;
  autoFillButton.style.cssText = 'width: 100%; border-radius: 10px; font-size: 14px; padding: 3px; ';

  autoFillBtnContainer.appendChild(autoFillButton);
}

function fillWeek() {
  let weekLength = 0;
  let rowLength= 0;
  let current = 0;

  weekFields.every(e => {
    let notWeekend = e.className !== 'weekend';

    if(!notWeekend || e.name === 'i_row_sum') {
      current = 0;
      return true;
    };

    if(e.name === 'i_kommt' && notWeekend) {
      weekLength++;
      e.value = checkHoliday(current) ? '' : '08:00';
    } else if(e.name === 'i_geht' && notWeekend) {
        e.value = checkHoliday(current) ? '' : '16:00';
    } else if(e.name === 'i_az' ) {
      if (!notWeekend || rowLength >= weekLength) return false;
        rowLength++;
        e.value = checkHoliday(current) ? '' : '08:00';
    }

    current++;
    return true;
  });

  console.log(weekFields)
}

function checkHoliday(current) {
  return holidays.some(e => e.join('.') === weekDays[current].join('.'))
}

loadData();