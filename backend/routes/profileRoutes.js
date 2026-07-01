// backend/routes/profileRoutes.js
const express = require('express')
const multer = require('multer')
const profileController = require('../controllers/profileController')

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Update profile
router.post('/update', upload.single('profilePhoto'), profileController.updateProfile)

// Get profile
router.get('/get', profileController.getProfile)

module.exports = router
