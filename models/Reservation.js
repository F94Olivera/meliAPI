const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  performance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Performance'
  },
  dni: String,
  name: String,
  seats: [{
    section: { type: String, required: true },
    row: { type: Number, required: true },
    number: { type: Number, required: true },
    price: { type: Number, required: true }
  }]
});

module.exports = mongoose.model('Reservation', reservationSchema);
