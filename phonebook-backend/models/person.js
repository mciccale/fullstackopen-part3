const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log(`connecting to MongoDB`);

mongoose
  .connect(url)
  .then((_res) => {
    console.log("connected to MongoDB");
  })
  .catch((err) => {
    console.error(`error connecting to MongoDB: ${err}`);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (_doc, obj) => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
