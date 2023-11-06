const express = require("express");
const morgan = require("morgan");

const app = express();

// Creating a Morgan token to log the body in case it's a POST request
morgan.token("body", (req, _res) =>
  req.method === "POST" ? JSON.stringify(req.body) : " "
);

const generateRandomId = () => {
  return Math.floor(Math.random() * 1000);
};

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (_req, res) => {
  res.send(
    `Phonebook has info for ${phonebook.length} people
    <br />
    <br />
    ${new Date()}`
  );
});

app.get("/api/persons", (_req, res) => {
  res.json(phonebook);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  // Handling missing properties
  if (!body.name || !body.number) {
    res
      .status(400)
      .json({ error: "name and number fields are mandatory" })
      .end();
  }
  // Handling unique name
  if (phonebook.find((person) => person.name === body.name)) {
    res.status(400).json({ error: "name must be unique" }).end();
  }
  // Creating a new person
  const newPerson = {
    id: generateRandomId(),
    ...body,
  };
  // Add the new number
  phonebook = phonebook.concat(newPerson);
  // Send the created person
  res.status(201).json(newPerson);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = phonebook.find((person) => person.id === id);
  person ? res.json(person) : res.status(404).end();
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const previousLength = phonebook.length;
  phonebook = phonebook.filter((person) => person.id !== id);
  phonebook.length !== previousLength
    ? res.status(204).end()
    : res.status(404).end();
});

app.use((_req, res) => {
  res.status(404).json({ error: "unknown endpoit" });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
