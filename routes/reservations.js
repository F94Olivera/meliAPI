const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const showsController = require('../controllers/showsController');

router.post(
  '/api/reservations',
  [
    body('showId').isMongoId(),
    body('performanceId').isMongoId(),
    body('customerDni').isString().trim().isLength({ min: 1 }),
    body('customer_name').isString().trim().isLength({ min: 1 }),
    body('seats').isArray({ min: 1 }),
    body('seats.*.section').isString().trim().isLength({ min: 1 }),
    body('seats.*.seatId').isMongoId(),
    body('seats.*.price').isFloat({ min: 0 }).toFloat()
  ],
  showsController.createReservation
);

module.exports = router;
