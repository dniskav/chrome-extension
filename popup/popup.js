import en from '../i18n/en.json' assert { type: 'json' };
import es from '../i18n/es.json' assert { type: 'json' };

let saveButton = document.querySelector('#saveBtn');
let loadButton = document.querySelector('#loadBtn');
let locationField = document.querySelector('#location');
let separatorField = document.querySelector('#separator');
let startTimeField = document.querySelector('#startTime');
let endTimeField = document.querySelector('#endTime');
let totalTimeField = document.querySelector('#totalTime');
let holidaysTypeField = document.getElementById('radios').elements.holidaysType;
let yearField = document.querySelector('#year');
let holidaysField = document.querySelector('#holidays');
let languageSelector = document.querySelectorAll('.language input[type=radio]');

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

function loadConfiguration() {
  chrome.storage.sync.get(['lang']).then((result) => {
    languageSelector.forEach( node => {
      if(node.value === result.lang) node.checked = true;
    })
  });
}

window.translate = () => {
  const dom = document.querySelectorAll('body *');
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT, // Mostrar solo nodos de texto
    null,
    false
  );

  while (treeWalker.nextNode()) {
    const matched = treeWalker.currentNode.nodeValue.match(/\{\{([a-zA-Z0-9_.]*)\}\}/);
    console.log(treeWalker.currentNode);

    if(matched) {
      const toFindAndReplace = matched[0];
      const jsonString = matched[1];
      const parts = jsonString.split('.');

      const value = parts.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, es);
      treeWalker.currentNode.nodeValue = treeWalker.currentNode.nodeValue.replace(toFindAndReplace, value);
    }

  }
}

loadConfiguration();
translate();
