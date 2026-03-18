const Property = require('../models/Property');
const { validationResult } = require('express-validator');

// @desc    Get all properties with filters & pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { city, type, listingType, minPrice, maxPrice, bedrooms, status, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (city)        query['location.city'] = { $regex: city, $options: 'i' };
    if (type)        query.type = type;
    if (listingType) query.listingType = listingType;
    if (status)      query.status = status;
    if (bedrooms)    query.bedrooms = Number(bedrooms);
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
    if (!property || !property.isActive) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }
    res.json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private (seller, admin)
const createProperty = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const property = await Property.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ success: true, message: 'Property listed successfully.', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (owner or admin)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property.' });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    res.json({ success: true, message: 'Property updated.', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a property (soft delete)
// @route   DELETE /api/properties/:id
// @access  Private (owner or admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found.' });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property.' });
    }

    property.isActive = false;
    await property.save();
    res.json({ success: true, message: 'Property removed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get properties listed by logged-in seller
// @route   GET /api/properties/my-listings
// @access  Private (seller)
const getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, total: properties.length, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getMyListings };
