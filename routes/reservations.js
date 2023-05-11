const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reservationController = require('../controllers/reservationController');

router.post(
  '/',
  [
    body('showId').isMongoId(),
    body('performanceId').isMongoId(),
    body('customerDni').isString().trim().isLength({ min: 1 }),
    body('customerName').isString().trim().isLength({ min: 1 }),
    body('seats').isArray({ min: 1 }),
    body('seats.*.sectionId').isString().trim().isLength({ min: 1 }),
    body('seats.*.seatId').isMongoId()
  ],
  reservationController.createReservation
);

module.exports = router;
