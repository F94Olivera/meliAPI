const mongoose = require('mongoose');
const Venue = require('./Venue');
const showSchema = new mongoose.Schema({
  name: String,
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Venue
  },
  performances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performance'
  }]
});

module.exports = mongoose.model('Show', showSchema);
mongoose.set({ debug: true });
