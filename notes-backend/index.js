require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const Note = require("./models/note");

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (_req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((_res) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res) => {
  const note = new Note({
    content: req.body.content,
    important: req.body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((err) => next(err));
});

const errorHandler = (err, _req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
