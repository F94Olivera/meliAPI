const mongoose = require('mongoose');
const Show = require('../models/Show');

exports.getShows = async ({ startDate, endDate, minPrice, maxPrice, sort, page, limit }) => {
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);
  const skip = (page - 1) * limit;

  const match = {};
  if (startDate || endDate) match['performances.date'] = {};
  if (startDate) match['performances.date'].$gte = startDate;
  if (endDate) match['performances.date'].$lte = endDate;
  if (minPrice || maxPrice) match['venue.sections.seats.price'] = {};
  if (minPrice) match['venue.sections.seats.price'].$gte = minPrice;
  if (maxPrice) match['venue.sections.seats.price'].$lte = maxPrice;

  try {
    const pipeline = [
      {
        $lookup: {
          from: 'performances',
          localField: 'performances',
          foreignField: '_id',
          as: 'performances'
        }
      },
      {
        $lookup: {
          from: 'venues',
          localField: 'venue',
          foreignField: '_id',
          as: 'venue'
        }
      },
      {
        $unwind: '$venue'
      },
      {
        $unwind: '$performances'
      },
      {
        $unwind: '$performances.availableSeats'
      },
      {
        $match: { 'performances.availableSeats.reserved': false }
      }
    ];

    if (Object.keys(match).length) {
      pipeline.push({ $match: match });
    }

    pipeline.push(
      {
        $sort: { 'performances.date': sort === 'asc' ? 1 : -1 }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          venue: { $first: '$venue' },
          performances: { $push: '$performances' }
        }
      }
    );

    const totalShows = await Show.aggregate([...pipeline, { $count: 'total' }]);

    const shows = await Show.aggregate([
      ...pipeline,
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    return {
      shows,
      pagination: {
        page: page,
        limit: limit,
        total: totalShows.length ? totalShows[0].total : 0
      }
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getSeats = async ({ showId, performanceId, page, limit, sort }) => {
  try {
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;
    const sortOption = sort === 'asc' ? 1 : sort === 'desc' ? -1 : 0;
    const sortStage = sortOption !== 0 ? { $sort: { 'venue.sections.seats.price': sortOption } } : {};

    const result = await Show.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(showId) } },
      {
        $lookup: {
          from: 'performances',
          localField: 'performances',
          foreignField: '_id',
          as: 'performances'
        }
      },
      { $unwind: '$performances' },
      {
        $match: {
          'performances._id': new mongoose.Types.ObjectId(performanceId)
        }
      },
      {
        $lookup: {
          from: 'venues',
          localField: 'venue',
          foreignField: '_id',
          as: 'venue'
        }
      },
      { $unwind: '$venue' },
      { $unwind: '$venue.sections' },
      { $unwind: '$venue.sections.seats' },
      {
        $lookup: {
          from: 'performances',
          let: { seat_id: '$venue.sections.seats._id' },
          pipeline: [
            { $match: { _id: new mongoose.Types.ObjectId(performanceId) } },
            { $unwind: '$availableSeats' },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$availableSeats.seat', '$$seat_id'] },
                    { $eq: ['$availableSeats.reserved', false] }
                  ]
                }
              }
            }
          ],
          as: 'seat_performance'
        }
      },
      { $match: { seat_performance: { $ne: [] } } },
      sortStage,
      {
        $facet: {
          totalDocuments: [{ $count: 'total' }],
          paginatedResults: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                section: '$venue.sections.name',
                row: '$venue.sections.seats.row',
                number: '$venue.sections.seats.number',
                price: '$venue.sections.seats.price',
                seat_id: '$venue.sections.seats._id'
              }
            }
          ]
        }
      }
    ]);

    const totalDocuments =
      result && result[0] && result[0].totalDocuments[0]
        ? result[0].totalDocuments[0].total
        : 0;

    const totalPages = Math.ceil(totalDocuments / limit);
    const seats = result && result[0] ? result[0].paginatedResults : [];

    return {
      seats,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalDocuments: totalDocuments
      }
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
