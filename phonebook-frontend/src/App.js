import React, { useState, useEffect } from 'react'
import './index.css'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  // Effect hooks
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  // Fetching the data
  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  // Handlers
  const handleNewName = event => setNewName(event.target.value)
  const handleNewNumber = event => setNewNumber(event.target.value)
  const handleFilter = event => setFilter(event.target.value)

  // Adding a new person to the phonebook
  const addPerson = event => {
    event.preventDefault()
    const person = persons.find(person => person.name === newName)
    if (person) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(person.id, { ...person, number: newNumber })
          .then(data =>
            setPersons(persons.filter(p => p.name !== person.name).concat(data))
          )
          .catch(_error => {
            setError(
              `Information of ${person.name} has already been removed from the server`
            )
            setTimeout(() => setError(null), 5000)
          })
      }
    } else {
      const newObject = { name: newName, number: newNumber }
      personService
        .create(newObject)
        .then(data => setPersons(persons.concat(data)))

      setNotification(`Added ${newObject.name}`)
      setTimeout(() => setNotification(null), 5000)
      setNewName('')
      setNewNumber('')
    }
  }

  const del = person => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService.deleteEntry(person.id)
      setPersons(persons.filter(p => p.name !== person.name))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} error={error} />
      <Filter handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        handleNewName={handleNewName}
        handleNewNumber={handleNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deleteFunction={del} />
    </div>
  )
}

export default App
