export function fetchCountries(countriesName){
    return fetch(`https://restcountries.com/v3.1/name/${countriesName}?fields=name,capital,population,flags,languages`)
.then(responsePromise)
};

function responsePromise(response){
    if(!response.ok){
        throw new Error('Network response was not ok');
    }
    return response.json()
}