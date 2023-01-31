import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));


function onInput(e) {
  let countryName = e.target.value;
  const name = countryName.trim()
  countryList.innerHTML = "";
  countryInfo.innerHTML = "";
  if (name) {
    fetchCountries(name)
      .then(country => {
        error(country);
        countryListMake(country);
      })
      .catch(error => console.log(error));
  }
}

function error(country) {
  if (country.status === 404) {
    Notify.failure('Oops, there is no country with that name');
  }
}
function countryListMake(country) {
  if (country.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.')
  }
  if (country.length >= 2 && country.length <= 10) {
    const markup = country.map(makeLiEl).join(" ");
    countryList.insertAdjacentHTML('beforeend', markup);
  }
  if (country.length === 1) {
    const markupInfo = country.map(makeInfoEl).join(" ");
    countryInfo.insertAdjacentHTML('beforeend', markupInfo);
  }
}

const makeLiEl = ({ flags: { svg }, name: { official } }) => {

  return `
  <li class = "country-item">
  <img 
  class = "image"
  src = ${svg}
  alt = 'flag'
  height = "30"
  />
  <p> ${official} </p>
  </li>
  `;
}

const makeInfoEl = ({ flags: { svg }, name: { official }, capital, population, languages }) => {
  const lang = Object.values(languages);
  return `
  <img 
  class = "image"
  src = ${svg}
  alt = 'flag'
  height = "30"
  />
  <h2 class ="title"> ${official} </h2>
  <p> Capital: ${capital} </p>
    <p> Population: ${population} </p>
      <p> Languages: ${lang} </p>
  `;
}