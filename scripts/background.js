console.log('Working!');
let result = {};

async function loadData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const data = await response.json();
  console.log(data);
};

loadData();