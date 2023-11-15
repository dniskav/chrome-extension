let saveButton = document.querySelector('#saveBtn');
let loadButton = document.querySelector('#loadBtn');
let locationField = document.querySelector('#location');
let separatorField = document.querySelector('#separator');
let holidaysTypeField = document.getElementById('radios').elements.holidaysType;
let yearField = document.querySelector('#year');
let holidaysField = document.querySelector('#holidays');

let months = {
  'enero': 1,
  'febrero': 2,
  'marzo': 3,
  'abril': 4,
  'mayo': 5,
  'junio': 6,
  'julio': 7,
  'agosto': 8,
  'septiembre': 9,
  'octubre': 10,
  'noviembre': 11,
  'diciembre': 12,
}

loadButton.addEventListener('click', () => {
  getData();
});

saveButton.addEventListener('click', saveData)

function getData() {
  chrome.storage.sync.get(["holidaysPerYear"]).then((result) => {
    console.log("Value currently is ", result.holidaysPerYear);
    locationField.value = result.holidaysPerYear.location;
    yearField.value = result.holidaysPerYear.year;
    holidaysField.value = result.holidaysPerYear.raw;
    holidaysTypeField.value = result.holidaysPerYear.holidaysType;
    separatorField.value = result.holidaysPerYear.separator;
  });
}

function saveData() {
  let year = Math.floor(yearField.value);
  let location = locationField.value;
  let holidaysType = holidaysTypeField.value;
  let holidays = [];

  switch(holidaysType) {
    case 'web':
      holidays = formatWebData(holidaysField.value, year);
      break;
    case 'custom':
      holidays = formatCustomData(holidaysField.value, year);
      break;
  }

  holidaysPerYear = { location, year, holidays, raw: holidaysField.value, holidaysType: holidaysTypeField.value, separator: separatorField.value };

  chrome.storage.sync.set({ holidaysPerYear }).then(() => {
    console.log("Value is set", holidaysPerYear);
  });
}

function formatWebData(location, year) {
  let holidaysStrings = holidaysField.value.split(/\n/);
  return holidaysStrings.map(e => {
    e = e.split('de');
    let day = Math.floor(e[0].trim());
    let month = months[e[1].trim().split(/\:|,|\s/gm)[0]];
    return [day, month, year];
  })
}

function formatCustomData(holidaysField, year) {
  let holidaysStrings = holidaysField.split(/\n/);
  return holidaysStrings.map(e => {
    e = e.split(separatorField.value);
    let day = Math.floor(e[0].trim());
    let month = Math.floor(e[1].trim());
    return [day, month, year];
  })
};