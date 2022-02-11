import React from 'react'
import CountryInformation from './CountryInformation'

const Countries = ({countries, filterValue}) => {

  const countriesToShow = countries.filter(country => 
    country.name.common.toLowerCase().includes(filterValue.toLowerCase()))
    
    if (filterValue === '') {
        return (
            <p></p>
        )
    } else if (countriesToShow.length === 1) {
      return (
        <div>
          <CountryInformation country={countriesToShow[0]} />
        </div>
      )
    } else if (countriesToShow.length > 10) {
      return (
        <div>
          <p>Too many matches, specify another filter</p>
        </div>
        )
    } else {
      return (
        <div>
          {countriesToShow.map(country => 
            <p key={country.name.common}>{country.name.common}</p>
          )}
        </div>
    )  
  }
}

export default Countries