const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const pwd = process.argv[2];
const url = `mongodb+srv://mciccale:${pwd}@cluster0.spr4a7d.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = new mongoose.model("Person", personSchema);

// Add a new person to the phonebook
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  new Person({ name, number }).save().then((_res) => {
    console.log(`added ${name} number ${number} to the phonebook`);
    mongoose.connection.close();
  });

  // List all the persons in the phonebook database
} else if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });

  // Wrong arguments
} else {
  console.log("give name and number as arguments");
  mongoose.connection.close();
}
