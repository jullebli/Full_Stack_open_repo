import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(e => e.name === newName)) {
      alert(`${newName} is already added to phonebook`)

    } else {
      const newPerson = { name: newName, number: newNumber }
      setPersons(persons.concat(newPerson))
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value) 
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filterValue} onChange={handleFilterChange} />
      
      <h3>add a new</h3>

      <PersonForm onSubmit={addPerson} nameValue={newName} nameOnChange={handleNameChange}
      numberValue={newNumber} numberOnChange={handleNumberChange} />

      <h3>Numbers</h3>

      <Persons persons={persons} filterValue={filterValue} />
    </div>
  )
}

export default App
