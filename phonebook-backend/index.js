require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

const PORT = process.env.PORT

morgan.token('body', (request, _response) => {
  const body = request.body
  if (!body.name) {
    return
  }
  return JSON.stringify(body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// GET Info resource
app.get('/info', (_request, response) => {
  response.send(`
      <div><span>Phonebook has info for people</span><br/><br/><span>${new Date()}</span></div>`)
})

// GET Persons resource
app.get('/api/persons', (_request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    response.json(person)
  })
})

// DELETE Person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

// POST Person
app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
