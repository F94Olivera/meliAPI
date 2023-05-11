const { validationResult } = require('express-validator');
const reservationService = require('../services/reservationService');

exports.createReservation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const reservationData = req.body;

  try {
    const reservation = await reservationService.createReservation(reservationData);
    if (reservation) {
      res.status(201).json(reservation);
    } else {
      res.status(400).json({ message: 'No se pudo crear la reserva' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};
