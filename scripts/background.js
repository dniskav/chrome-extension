defaultData = {
  "endTime": "16:00",
  "holidays": [
    [6, 1, 2023],
    [7, 4, 2023],
    [1, 5, 2023],
    [15, 8, 2023],
    [12, 10, 2023],
    [1, 11, 2023],
    [6, 12, 2023],
    [8, 12, 2023],
    [25, 12, 2023]
  ],
  "holidaysType": "web",
  "location": "todas",
  "raw": "6 de enero: Reyes\n7 de abril: Viernes Santo.\n1 de Mayo: Día del Trabajo\n15 de agosto: Asunción de la Virgen.\n12 de octubre: Día de la Hispanidad\n1 de noviembre: Todos los Santos.\n6 de diciembre: Día de la Constitución Española.\n8 de diciembre: Inmaculada Concepción.\n25 de diciembre: Navidad.",
  "separator": "",
  "startTime": "08:00",
  "totalTime": "08:00",
  "year": 2023
}

console.log('Miles+ auto fill extension working!');
let result = {};
let i_von = document.querySelector('[name=i_von]');
let i_bis = document.querySelector('[name=i_bis]');
let autoFillBtnContainer = document.querySelector('#delayedDisplay > form[action="pweektime_gc.createpage_week"] > table > tbody > tr:nth-child(1) > td:nth-child(2)');
let weekFields = [...document.querySelectorAll("#delayedDisplay > form > table > tbody input[type=text]")];
let holidaysPerYear = defaultData;
let weekDays = [...document.querySelectorAll("#delayedDisplay > form > table > tbody > tr:nth-child(1) input[name=i_datum]")].map(e => {
  let arr = e.value.split('.');

  return [
    Math.floor(arr[0]),
    Math.floor(arr[1]),
    Math.floor(arr[2]),
  ];
});

async function loadData(addButon = true) {
  result = await chrome.storage.sync.get(["holidaysPerYear"]);
  
  if(Object.keys(result).length) {
    holidaysPerYear = result.holidaysPerYear;
  } else {
    console.log('error al leer los datos guardados, se cargan los por defecto');
    holidaysPerYear = defaultData;
  };

  if (addButon) addAutoFillButton();
};

function addAutoFillButton() {
  let autoFillButton = document.createElement('input')
  autoFillButton.id = "autofillBtn";
  autoFillButton.type = "button";
  autoFillButton.value = "Autofill Week";
  autoFillButton.setAttribute('class', 'head_big');
  autoFillButton.onclick = fillWeek;
  autoFillButton.style.cssText = 'width: 100%; border-radius: 10px; font-size: 14px; padding: 3px; ';

  autoFillBtnContainer.prepend(autoFillButton);
}

function fillWeek() {
  let weekLength = 0;
  let rowLength= 0;
  let current = 0;

  weekFields.every(e => {
    let notWeekend = e.className !== 'weekend';

    if(!notWeekend || e.name === 'i_row_sum' || current > weekLength) {
      current = 0;
      return true;
    };

    if(e.name === 'i_kommt' && notWeekend) {
      weekLength++;
      e.value = checkHoliday(current) ? '' : holidaysPerYear.startTime ? holidaysPerYear.startTime : '08:00';
    } else if(e.name === 'i_geht' && notWeekend) {
        if(current >= weekDays.length) current = 0;
        e.value = checkHoliday(current) ? '' : holidaysPerYear.endTime ? holidaysPerYear.endTime : '16:00';
    } else if(e.name === 'i_az' ) {
      if(current >= weekDays.length) current = 0;
      if (!notWeekend || rowLength >= weekLength) return false;
        rowLength++;
        e.value = checkHoliday(current) ? '' : holidaysPerYear.totalTime ? holidaysPerYear.totalTime : '08:00';
    }

    current++;
    return true;
  });
}

function checkHoliday(current) {
  return holidaysPerYear.holidays.some(e => e.join('.') === weekDays[current].join('.'))
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  loadData(false);
});

loadData();
