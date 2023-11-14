let saveButton = document.querySelector('#saveBtn');
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

saveButton.addEventListener('click', () => {
  let year = Math.floor(yearField.value);
  let holidaysStrings = holidaysField.value.split(/\n/);
  holidays = holidaysStrings.map(e => {
    e = e.split('de');
    let day = Math.floor(e[0].trim());
    let month = months[e[1].trim().split(':')[0]];
    return [day, month, year];
  })

  console.log({ year, holidays });
})

function saveData(data) {
  console.log(data);
}