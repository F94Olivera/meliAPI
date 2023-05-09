const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  capacity: Number,
  sections: [{
    name: String,
    seats: [{
      row: Number,
      number: Number,
      price: Number
    }]
  }]
});

module.exports = mongoose.model('Venue', venueSchema);
