import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'

function App() {

  const [filterValue, setFilterValue] = useState('')
  const [countries, setCountries] = useState([])
  
  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  return (
    <div className="App">
      <Filter value={filterValue} onChange={handleFilterChange} />
      <Countries countries={countries} filterValue={filterValue} />
    </div>
  );
}

export default App;
