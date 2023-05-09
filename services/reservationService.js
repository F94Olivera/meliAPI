const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Show = require('../models/Show');

exports.createReservation = async (reservationData) => {
  const { showId, performanceId, customerDni, customerName, seats } = reservationData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const show = await Show.findById(showId).session(session);
    if (!show) {
      throw new Error('Show no encontrado');
    }

    const performance = show.performances.id(performanceId);
    if (!performance) {
      throw new Error('Performance no encontrada');
    }

    const reservation = new Reservation({
      show: showId,
      performance: performanceId,
      customerDni,
      customerName,
      seats
    });

    const savedReservation = await reservation.save({ session });

    for (const seat of seats) {
      const section = show.venue.sections.id(seat.section_id);
      const seatToUpdate = section.seats.id(seat.seat_id);

      if (seatToUpdate.reserved) {
        throw new Error('El asiento ya está reservado');
      }

      seatToUpdate.reserved = true;
    }

    await show.save({ session });

    await session.commitTransaction();
    session.endSession();

    return savedReservation;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
