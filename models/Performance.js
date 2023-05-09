const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show'
  },
  date: Date,
  availableSeats: [{
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue.sections.seats'
    },
    reserved: {
      type: Boolean,
      default: false
    }
  }]
});
performanceSchema.index({ _id: 1 });
performanceSchema.date({ _id: 1 });

module.exports = mongoose.model('Performance', performanceSchema);
