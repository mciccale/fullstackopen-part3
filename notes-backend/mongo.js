const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const pwd = process.argv[2];
const url = `mongodb+srv://mciccale:${pwd}@cluster0.spr4a7d.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (_doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: "NodeJS is AWESOME!!!!",
//   important: true,
// });

// note.save().then((_res) => {
//   console.log("Note saved");
//   mongoose.connection.close();
// });

Note.find({ important: true }).then((res) => {
  res.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
