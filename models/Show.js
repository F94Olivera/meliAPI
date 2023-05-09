const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  name: String,
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue'
  },
  performances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performance'
  }]
});
showSchema.index({ _id: 1 });

module.exports = mongoose.model('Show', showSchema);
