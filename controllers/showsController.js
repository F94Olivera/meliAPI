const { validationResult } = require('express-validator');
const showsService = require('../services/showsService');

exports.getShows = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    startDate, endDate, minPrice, maxPrice,
    sort = process.env.SORT, page = process.env.PAGE, limit = process.env.LIMIT
  } = req.query;

  try {
    const shows = await showsService.getShows({ startDate, endDate, minPrice, maxPrice, sort, page, limit });
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los shows' });
  }
};

exports.getSeats = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { showId, performanceId } = req.params;
  const { sort = process.env.SORT, page = process.env.PAGE, limit = process.env.LIMIT } = req.query;

  try {
    const seats = await showsService.getSeats({ showId, performanceId, page, limit, sort });
    res.status(200).json(seats);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los asientos' });
  }
};

exports.createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const reservationData = req.body;

  try {
    const reservation = await showsService.createReservation(reservationData);
    if (reservation) {
      res.status(201).json(reservation);
    } else {
      res.status(400).json({ message: 'No se pudo crear la reserva' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};
