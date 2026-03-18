const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProperties, getPropertyById, createProperty,
  updateProperty, deleteProperty, getMyListings
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

const propertyValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['apartment', 'house', 'villa', 'plot', 'commercial']).withMessage('Invalid property type'),
  body('listingType').isIn(['sale', 'rent']).withMessage('Listing type must be sale or rent'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('area').isNumeric().withMessage('Area must be a number'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.pincode').notEmpty().withMessage('Pincode is required'),
];

router.get('/',           getProperties);
router.get('/my-listings', protect, authorize('seller', 'admin'), getMyListings);
router.get('/:id',        getPropertyById);
router.post('/',          protect, authorize('seller', 'admin'), propertyValidation, createProperty);
router.put('/:id',        protect, authorize('seller', 'admin'), updateProperty);
router.delete('/:id',     protect, authorize('seller', 'admin'), deleteProperty);

module.exports = router;
