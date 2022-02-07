import React, { useState } from 'react'

const Person = ({name}) => {
  return (
    <p>{name}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()

    if (persons.some(e => e.name === newName)) {
      alert(`${newName} is already added to phonebook`)

    } else {
      const newPerson = { name: newName }
      setPersons(persons.concat(newPerson))
    }

    setNewName('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value) 
  } 

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(person => 
        <Person key={person.name} name={person.name} />
        )}
    </div>
  )
}

export default App
