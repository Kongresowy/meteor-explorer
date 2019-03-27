const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Meteorites = new Schema(
  {
    fall: String,
    mass: String,
    name: String,
    latitude: String,
    longitude: String,
    date: String,
    id: String
  });

module.exports = mongoose.model("Meteorites", Meteorites);