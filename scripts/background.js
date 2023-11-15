console.log('Miles+ auto fill extension working!');
let result = {};
let i_von = document.querySelector('[name=i_von]');
let i_bis = document.querySelector('[name=i_bis]');
let autoFillBtnContainer = document.querySelector("#delayedDisplay > form > table > tbody > tr:nth-child(1) > td:nth-child(2)");
let autoFillButton = document.createElement('input')
let weekFields = [...document.querySelectorAll("#delayedDisplay > form > table > tbody input[type=text]")];

async function loadData() {
  
  let result = await chrome.storage.sync.get(["holidaysPerYear"]);


  console.log('data? ', result, i_von, i_bis);
};

function addAutoFillButton() {
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

  weekFields.every(e => {
    let notWeekend = e.className !== 'weekend';

    if(checkHoliday()) return false;

    if(e.name === 'i_kommt' && notWeekend) {
        e.value = '08:00';
        weekLength++;
    } else if(e.name === 'i_geht' && notWeekend) {
        e.value = '16:00';
    } else if(e.name === 'i_az' ) {
      if (!notWeekend || rowLength >= weekLength) return false;
        rowLength++;
        e.value = '08:00';
    }

    return true;
  });

  console.log(weekFields)
}

function checkHoliday() {

}

loadData();
addAutoFillButton();