import Notiflix from 'notiflix';
import throttle from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

let searchField = '';
let arrayCountries;

refs.input.addEventListener('input', throttle(onInput, DEBOUNCE_DELAY));

function onInput() {
  searchField = refs.input.value.trim();
  if(searchField.length === 0){
    return refs.list.innerHTML = '', refs.info.innerHTML = '';;
  }
  fetchCountries(searchField)
    .then(countries => {
      refs.list.innerHTML = '';
      refs.info.innerHTML = '';
      arrayCountries = countries;
         if (arrayCountries.length >= 1) {
        countries.map(country => {
          appendMarkup(country);
        });
      } else {
        refs.list.innerHTML = '';
        refs.info.innerHTML = '';
      }
      if (arrayCountries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(error => { 
        if(error.message === 'Network response was not ok'){
        Notiflix.Notify.failure('Oops, there is no country with that name'); 
        }
    });
}


function appendMarkup(country) {
  const { name, flags, capital, population, languages } = country;
  const language = Object.values(languages).join(', ');
 
  const listOfCountries = `
    <div class = 'name-title'>    
        <img class = 'flag-img' width = '30' height = '20' src = ${flags.svg}>
        <p class = 'name-country'>${name.official}</p>
    </div>`;

  const infoAboutCountries = `  
    <div class = 'name-title'>    
        <img class = 'info-img' width = '30' height = '20' src = ${flags.svg}>
        <h1 class='title'>${name.official}</h1>
    </div>
    <ul class='name__list'>
        <li class='info__item'>Capital:<span class = 'value'>${capital}</span></li>
        <li class='info__item'>Population:<span class = 'value'>${population}</span></li>
        <li class='info__item'>Languages:<span class = 'value'> ${language}</span></li>
    </ul>`;

    if (arrayCountries.length > 10) {
        return;
  } else if (arrayCountries.length > 1) {
    refs.list.insertAdjacentHTML('beforeend', listOfCountries);
  }else{
    refs.info.insertAdjacentHTML('beforeend', infoAboutCountries);
  }
}