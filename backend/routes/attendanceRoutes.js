// routes/attendanceRoutes.js
// Attendance upload and processing API routes

const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const { uploadFile, getPreview } = require('../controllers/attendanceController')

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    cb(null, uniqueName)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only CSV and XLSX files are allowed'))
    }
  },
})

/**
 * POST /api/upload
 * Upload attendance file (CSV or XLSX)
 */
router.post('/upload', upload.single('file'), uploadFile)

/**
 * POST /api/preview
 * Get preview of students who will receive emails
 */
router.post('/preview', getPreview)

module.exports = router
