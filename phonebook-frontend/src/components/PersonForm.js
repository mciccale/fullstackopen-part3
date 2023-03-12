import React from 'react'

const PersonForm = ({ addPerson, handleNewName, handleNewNumber }) => {
  return (
    <form onSubmit={addPerson}>
        <div>name: <input onChange={handleNewName}/></div>
        <div>number: <input onChange={handleNewNumber}/></div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

export default PersonForm