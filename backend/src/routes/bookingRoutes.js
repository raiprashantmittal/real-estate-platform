const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/',             protect, authorize('buyer'), createBooking);
router.get('/',              protect, getMyBookings);
router.put('/:id/status',   protect, updateBookingStatus);

module.exports = router;
