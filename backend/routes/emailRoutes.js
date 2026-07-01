// routes/emailRoutes.js
// Email sending API routes

const express = require('express')
const router = express.Router()
const { sendEmails } = require('../controllers/emailController')

/**
 * POST /api/send-emails
 * Send attendance warning emails to students
 */
router.post('/send-emails', sendEmails)

module.exports = router
