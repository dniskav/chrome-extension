import { translate, translateSetup } from '../scripts/i18n.js';
import en from '../i18n/en.json' assert { type: 'json' };
import es from '../i18n/es.json' assert { type: 'json' };

const saveButton = document.querySelector('#saveBtn');
const loadButton = document.querySelector('#loadBtn');
const locationField = document.querySelector('#location');
const separatorField = document.querySelector('#separator');
const startTimeField = document.querySelector('#startTime');
const endTimeField = document.querySelector('#endTime');
const totalTimeField = document.querySelector('#totalTime');
const holidaysTypeField = document.getElementById('radios').elements.holidaysType;
const yearField = document.querySelector('#year');
const holidaysField = document.querySelector('#holidays');
const languageSelector = document.querySelectorAll('.language input[type=radio]');

window.translate = translate;

translateSetup({
  en,
  es,
});

let months = {
  enero: 1,
  febrero: 2,
  marzo: 3,
  abril: 4,
  mayo: 5,
  junio: 6,
  julio: 7,
  agosto: 8,
  septiembre: 9,
  octubre: 10,
  noviembre: 11,
  diciembre: 12,
};

let lang = 'es';

loadButton.addEventListener('click', () => {
  getData();
});

languageSelector.forEach( node => {
  // add listeners
  node.addEventListener('change', ev => {
    console.log(ev.target.value);
    const lang = ev.target.value;
    chrome.storage.sync.set({ lang }).then(() => {
      console.log(`lang ${lang} saved`);
      translate(lang);
    });
  });
})


saveButton.addEventListener('click', saveData);
startTimeField.addEventListener('blur', e => e.target.value = formatTime(e.target.value));
endTimeField.addEventListener('blur', e => e.target.value = formatTime(e.target.value));
totalTimeField.addEventListener('blur', e => e.target.value = formatTime(e.target.value));

function getData() {
  chrome.storage.sync.get(['holidaysPerYear']).then((result) => {
    console.log('Value currently is ', result.holidaysPerYear);
    locationField.value = result.holidaysPerYear.location;
    yearField.value = result.holidaysPerYear.year;
    holidaysField.value = result.holidaysPerYear.raw;
    startTimeField.value = result.holidaysPerYear.startTime;
    endTimeField.value = result.holidaysPerYear.endTime;
    totalTimeField.value = result.holidaysPerYear.totalTime;
    holidaysTypeField.value = result.holidaysPerYear.holidaysType;
    separatorField.value = result.holidaysPerYear.separator;
  });
}

function saveData() {
  let year = Math.floor(yearField.value);
  let location = locationField.value;
  let holidaysType = holidaysTypeField.value;
  let startTime = startTimeField.value;
  let endTime = endTimeField.value;
  let totalTime = totalTimeField.value;
  let holidaysPerYear = {};

  let holidays = [];

  if(!holidaysField.value || !year || !location) {
    alert('no se pueden dejar en blanco: festivos, año o ubicación');
    return;
  }

  switch (holidaysType) {
    case 'web':
      holidays = formatWebData(holidaysField.value, year);
      break;
    case 'custom':
      holidays = formatCustomData(holidaysField.value, year);
      break;
  }

  holidaysPerYear = {
    location,
    startTime,
    endTime,
    totalTime,
    year,
    holidays,
    raw: holidaysField.value,
    holidaysType: holidaysTypeField.value,
    separator: separatorField.value,
  };

  chrome.storage.sync.set({ holidaysPerYear }).then(() => {
    console.log('Value is set', holidaysPerYear);
    alert(`festivos para el: ${year} en ${location} guardados`)
  });
}

function formatWebData(location, year) {
  let holidaysStrings = holidaysField.value.split(/\n/);
  return holidaysStrings.map((e) => {
    e = e.split('de');
    let day = Math.floor(e[0].trim());
    let month = months[e[1].trim().split(/\:|,|\s/gm)[0].toLowerCase()];
    return [day, month, year];
  });
}

function formatCustomData(holidaysField, year) {
  let holidaysStrings = holidaysField.split(/\n/);
  return holidaysStrings.map((e) => {
    e = e.split(separatorField.value);
    let day = Math.floor(e[0].trim());
    let month = Math.floor(e[1].trim());
    return [day, month, year];
  });
}

function formatTime(str) {
  let formattedHour = '';
  let fullHour = str.split(':');
  if(fullHour.length > 1) {
    formattedHour = `${fullHour[0].padStart(2, 0)}:${fullHour[1].padStart(2, 0)}`;
  } else {
    formattedHour = `${fullHour[0].padStart(2, 0)}:00`;
  };

  return formattedHour;
}

window.loadConfiguration = () => {
  chrome.storage.sync.get(['lang']).then((result) => {
    translate(result.lang);
    languageSelector.forEach( node => {
      if(node.value === result.lang) node.checked = true;
    })
  });
}

loadConfiguration();
