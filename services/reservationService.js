const Reservation = require('../models/Reservation');
const Show = require('../models/Show');
const Performance = require('../models/Performance');
const mongoose = require('mongoose');

exports.createReservation = async (reservationData) => {
  const { showId, performanceId, customerDni, customerName, seats } = reservationData;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const show = await Show.findById(showId).populate('venue').session(session);
    if (!show) {
      throw new Error('Show no encontrado');
    }

    const performance = await Performance.findById(performanceId).session(session);
    if (!performance) {
      throw new Error('Performance no encontrada');
    }

    const reservationSeats = [];

    for (const seat of seats) {
      const section = show.venue.sections.find(s => s._id.toString() === seat.sectionId);
      const seatToUpdate = section.seats.find(s => s._id.toString() === seat.seatId);

      if (!section || !seatToUpdate) {
        throw new Error('Sección o asiento no encontrados');
      }

      const availableSeat = performance.availableSeats.find(s => s.seat.toString() === seatToUpdate._id.toString());
      if (!availableSeat || availableSeat.reserved) {
        throw new Error('El asiento ya está reservado');
      }

      reservationSeats.push({
        section: section.name,
        row: seatToUpdate.row,
        number: seatToUpdate.number,
        price: seatToUpdate.price
      });

      availableSeat.reserved = true;
      await performance.save({ session });
    }

    const reservation = new Reservation({
      show: showId,
      performance: performanceId,
      dni: customerDni,
      name: customerName,
      seats: reservationSeats
    });

    const savedReservation = await reservation.save({ session });

    await session.commitTransaction();
    session.endSession();

    return savedReservation;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
