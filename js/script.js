/*********************************
 Get search query from form
**********************************/

const form = document.querySelector('form');
const resultCountriesSection = document.querySelector('#resultCountries');
const searchResultHeader = document.querySelector('#searchResult');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const searchQuery = document.querySelector('#searchQuery').value;
  const countryOrLanguage = document.querySelector('input[name="searchChoice"]:checked').value;

  fetchCountryInfo(searchQuery, countryOrLanguage)
    .then(displayCountry)
    .catch(displayError);
 
  resultCountriesSection.innerHTML ='';
  form.reset();
  
});

/******************************************
 Get country info from API URL
******************************************/

async function fetchCountryInfo(countryOrLanguage, searchChoice){
  let nameOrLang ='';
 
  if (searchChoice == 'countryName'){
    nameOrLang = 'name';
  }
  else if (searchChoice == 'countryLanguage'){
    nameOrLang = 'lang';
  }

  const url = `https://restcountries.com/v3.1/${nameOrLang}/${countryOrLanguage}?fields=name,flags,capital,population,subregion`;

  const response = await fetch(url);

  if(response.ok){ 
    const data = await response.json();
    return data;
  }
  else if(response.status === 404){
    throw 404;
  }
}

/*********************************
    Display country
**********************************/

function displayCountry(countryInfo){

  searchResultHeader.innerText = 'Search result:';

  //SORTERNING
  countryInfo.sort((a, b) => b.population - a.population);

  for (let i=0; i<countryInfo.length; i++ ){

    //Create elements for display
    const h2Name = document.createElement('h2');
    const h3Subregion = document.createElement('h3');
    const pCapital = document.createElement('p');
    const pPopulation = document.createElement('p');
    const flagImg = document.createElement('img');
    const countryInfoDiv = document.createElement('div');
    const divLeft = document.createElement('div');
    const divRight = document.createElement('div');
    
    countryInfoDiv.className = "countryInfo";

    resultCountriesSection.append(countryInfoDiv);
    countryInfoDiv.append(divLeft, divRight);
    divLeft.append(h2Name, h3Subregion, pCapital, pPopulation);
    divRight.append(flagImg);

    //Element content
    h2Name.innerText = countryInfo[i].name.official;
    h3Subregion.innerText = countryInfo[i].subregion;
    pCapital.innerText = 'Capital city: ' + countryInfo[i].capital;
    pPopulation.innerText = 'Population: ' + countryInfo[i].population;
    flagImg.src = countryInfo[i].flags.png;
  }
}

/********************************************
   Error
*********************************************/

  function displayError(error) {
    const h3ErrorMess = document.createElement('h3');

    if (error === 404) { 
      h3ErrorMess.innerText = 'No country or language was found. Try another query.';
    }
    else{ 
      h3ErrorMess.innerText = 'Something went wrong, try again later.' 
    }
    searchResultHeader.innerText = '';
    resultCountriesSection.append(h3ErrorMess);
  }
