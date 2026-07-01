// routes/resultsRoutes.js
const express = require('express')
const multer = require('multer')
const path = require('path')
const router = express.Router()
const { uploadResults, getResultsPreview, sendResults } = require('../controllers/resultsController')

// Configure multer
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
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only CSV and XLSX files are allowed'))
        }
    },
})

router.post('/results/upload', upload.single('file'), uploadResults)
router.post('/results/preview', getResultsPreview)
router.post('/results/send-emails', sendResults)

module.exports = router
