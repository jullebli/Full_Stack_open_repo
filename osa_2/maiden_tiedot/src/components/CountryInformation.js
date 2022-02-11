import React from 'react'


const CountryInformation = ({country}) => {

  const languages = Object.values(country.languages)
 
  return (
    <div>
      <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
      <h2>languages</h2>
        <ul>
          {languages.map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags[1]} />
    </div>
  )  
}

export default CountryInformation