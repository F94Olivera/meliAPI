const mongoose = require('mongoose');
const Show = require('../models/Show');

exports.getShows = async ({ startDate, endDate, minPrice, maxPrice, sort }) => {
  const filter = {
    $and: [
      { 'performances.date': { $gte: startDate ? new Date(startDate) : new Date(0) } },
      { 'performances.date': { $lte: endDate ? new Date(endDate) : new Date('9999-12-31') } },
      { 'venue.sections.seats.price': { $gte: minPrice ? parseInt(minPrice) : 0 } },
      { 'venue.sections.seats.price': { $lte: maxPrice ? parseInt(maxPrice) : Infinity } }
    ]
  };

  const sortOption = sort === 'desc' ? { 'performances.date': -1 } : { 'performances.date': 1 };

  try {
    const shows = await Show.find(filter).sort(sortOption).exec();
    return shows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.getSeats = async (showId, performanceId) => {
  try {
    const show = await Show.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(showId) } },
      { $unwind: '$performances' },
      { $match: { 'performances._id': mongoose.Types.ObjectId(performanceId) } },
      { $unwind: '$venue.sections' },
      { $unwind: '$venue.sections.seats' },
      { $match: { 'venue.sections.seats.reserved': false } },
      {
        $project: {
          section: '$venue.sections.name',
          row: '$venue.sections.seats.row',
          number: '$venue.sections.seats.number',
          price: '$venue.sections.seats.price',
          seat_id: '$venue.sections.seats._id'
        }
      }
    ]);

    if (!show || show.length === 0) {
      return null;
    }

    return show;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
