import React from 'react'

const Persons = ({ persons, filter, deleteFunction }) => {
  return persons.map(person => {
    if (person.name.toLowerCase().includes(filter.toLowerCase()))
      return (
        <div key={person.name}>
          <span>
            {person.name} {person.number}
          </span>
          <span> </span>
          <button onClick={() => deleteFunction(person)}>delete</button>
        </div>
      )
  })
}

export default Persons
