// backend/controllers/profileController.js
const Faculty = require('../models/Faculty')
const path = require('path')
const fs = require('fs')

// Update faculty profile
exports.updateProfile = async (req, res) => {
  try {
    const { email, newName, newEmail, phoneNumber, department } = req.body

    // Find faculty by current email
    const faculty = await Faculty.findOne({ email: email })
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' })
    }

    // Check if new email is already taken (if email is being changed)
    if (newEmail !== email) {
      const existingEmail = await Faculty.findOne({ email: newEmail })
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' })
      }
    }

    // Update basic fields
    faculty.name = newName || faculty.name
    faculty.email = newEmail || faculty.email
    faculty.phoneNumber = phoneNumber || faculty.phoneNumber
    faculty.department = department || faculty.department
    faculty.updated_at = new Date()

    // Handle profile photo if uploaded
    if (req.file) {
      // Delete old photo if exists
      if (faculty.profilePhoto) {
        const oldPhotoPath = path.join(__dirname, '../uploads', faculty.profilePhoto)
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath)
        }
      }

      // Save new photo
      const fileName = `${Date.now()}-${req.file.originalname}`
      const photoPath = path.join(__dirname, '../uploads', fileName)
      
      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, '../uploads')
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }

      // Save file
      fs.writeFileSync(photoPath, req.file.buffer)
      faculty.profilePhoto = fileName
    }

    // Save updated faculty
    await faculty.save()

    res.status(200).json({
      message: 'Profile updated successfully',
      faculty: {
        name: faculty.name,
        email: faculty.email,
        phoneNumber: faculty.phoneNumber,
        department: faculty.department,
        profilePhoto: faculty.profilePhoto
      }
    })
  } catch (err) {
    console.error('Profile update error:', err)
    res.status(500).json({ message: 'Failed to update profile', error: err.message })
  }
}

// Get faculty profile
exports.getProfile = async (req, res) => {
  try {
    const { email } = req.query

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    const faculty = await Faculty.findOne({ email: email })
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' })
    }

    res.status(200).json({
      name: faculty.name,
      email: faculty.email,
      phoneNumber: faculty.phoneNumber,
      department: faculty.department,
      profilePhoto: faculty.profilePhoto
    })
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message })
  }
}
