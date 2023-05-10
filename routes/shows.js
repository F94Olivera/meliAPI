const express = require('express');
const router = express.Router();
const { query, param } = require('express-validator');
const showsController = require('../controllers/showsController');

router.get(
  '/',
  [
    query('startDate').optional().isISO8601().toDate(),
    query('endDate').optional().isISO8601().toDate(),
    query('minPrice').optional().isInt({ min: 0 }).toInt(),
    query('maxPrice').optional().isInt({ min: 0 }).toInt(),
    query('limit').optional().isInt({ gt: 0 }).toInt(),
    query('page').optional().isInt({ gt: 0 }).toInt(),
    query('sort').optional().isIn(['asc', 'desc'])
  ],
  showsController.getShows
);

router.get(
  '/:showId/performances/:performanceId/seats',
  [
    param('showId').isMongoId(),
    param('performanceId').isMongoId(),
    query('limit').optional().isInt({ gt: 0 }).toInt(),
    query('page').optional().isInt({ gt: 0 }).toInt(),
    query('sort').optional().isIn(['asc', 'desc'])
  ],
  showsController.getSeats
);

module.exports = router;
