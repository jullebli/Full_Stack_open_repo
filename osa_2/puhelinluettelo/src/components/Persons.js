import React from 'react'
import Person from './Person'

const Persons = ({persons, filterValue}) => {

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))

  return (
    <div>
      {personsToShow.map(person => 
        <Person key={person.name} person={person} />
      )}
    </div>
  )  
}

export default Persons