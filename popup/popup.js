let saveButton = document.querySelector('#saveBtn');
let loadButton = document.querySelector('#loadBtn');
let locationField = document.querySelector('#location');
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

saveButton.addEventListener('click', () => {
  let year = Math.floor(yearField.value);
  let location = locationField.value;
  let holidaysStrings = holidaysField.value.split(/\n/);
  holidays = holidaysStrings.map(e => {
    e = e.split('de');
    let day = Math.floor(e[0].trim());
    let month = months[e[1].trim().split(/\:|,|\s/gm)[0]];
    return [day, month, year];
  })

  holidaysPerYear = { location, year, holidays };

  chrome.storage.sync.set({ holidaysPerYear }).then(() => {
    console.log("Value is set");
  });
})


function getData() {
  chrome.storage.sync.get(["holidaysPerYear"]).then((result) => {
    console.log("Value currently is ", result.holidaysPerYear);
  });
}

function saveData(data) {
  console.log(data);
}