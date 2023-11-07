require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
const Person = require("./models/person");

// Creating a Morgan token to log the body in case it's a POST request
morgan.token("body", (req, _res) =>
  req.method === "POST" ? JSON.stringify(req.body) : " "
);

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/info", (_req, res) => {
  Person.find({}).then((persons) => {
    res.send(`Phonebook has info for ${persons.length} people\n${new Date()}`);
  });
});

app.get("/api/persons", (_req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  new Person({ name, number })
    .save()
    .then((person) => {
      res.status(201).json(person);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((_deletedPerson) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((err) => next(err));
});

app.use((_req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
});

app.use((err, _req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
