const express = require('express');
const router = express.Router();
const { getAllUsers, updateProfile, deactivateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/',          protect, authorize('admin'), getAllUsers);
router.put('/profile',   protect, updateProfile);
router.delete('/:id',    protect, authorize('admin'), deactivateUser);

module.exports = router;
