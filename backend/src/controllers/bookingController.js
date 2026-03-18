const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a booking / visit request
// @route   POST /api/bookings
// @access  Private (buyer)
const createBooking = async (req, res) => {
  try {
    const { propertyId, visitDate, visitTime, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    if (property.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Property is not available for booking.' });
    }

    // Prevent owner from booking their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot book your own property.' });
    }

    const booking = await Booking.create({
      property: propertyId,
      buyer: req.user._id,
      seller: property.owner,
      visitDate,
      visitTime,
      message,
    });

    res.status(201).json({ success: true, message: 'Visit request submitted.', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for the logged-in user (buyer or seller view)
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const filter = req.user.role === 'seller'
      ? { seller: req.user._id }
      : { buyer: req.user._id };

    const bookings = await Booking.find(filter)
      .populate('property', 'title location price type')
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, total: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (confirm / cancel / complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status, cancelReason } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found.' });

    // Only seller can confirm/complete; buyer or seller can cancel
    const isSeller = booking.seller.toString() === req.user._id.toString();
    const isBuyer  = booking.buyer.toString()  === req.user._id.toString();

    if (!isSeller && !isBuyer && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }
    if ((status === 'confirmed' || status === 'completed') && !isSeller && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the seller can confirm or complete a booking.' });
    }

    booking.status = status;
    if (status === 'cancelled' && cancelReason) booking.cancelReason = cancelReason;
    await booking.save();

    res.json({ success: true, message: `Booking ${status}.`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, updateBookingStatus };
