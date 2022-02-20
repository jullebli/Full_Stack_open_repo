import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setFilterValue] = useState('')

  useEffect(() => {
    phonebookService
      .getAll()
        .then(persons => {
        setPersons(persons)
        })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(e => e.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(n => n.name === newName)
        const id = person.id
        const changedPerson = {...person, number: newNumber}
        phonebookService
          .update(changedPerson)
            .then (response => {
            setPersons(persons.map(person => person.id !== id ? person : response))
            })
      }

    } else {
      const newPerson = { name: newName, number: newNumber }
      phonebookService
        .create(newPerson)
          .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
    }

    setNewName('')
    setNewNumber('')
  }

  const removePerson = (event, {person}) => {
    event.preventDefault()
    if (window.confirm(`Delete ${person.name} ?`)) {
      phonebookService
        .remove(person)
        setPersons(persons.filter(n => n.id !== person.id))
    }
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

      <Persons persons={persons} filterValue={filterValue} removePerson={removePerson} />
    </div>
  )
}

export default App
