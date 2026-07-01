// routes/authRoutes.js
// Authentication API routes

const express = require('express')
const router = express.Router()
const { register, login, logout, checkAuth } = require('../controllers/authController')

/**
 * POST /api/register
 * Faculty registration endpoint
 */
router.post('/register', register)

/**
 * POST /api/login
 * Faculty login endpoint
 */
router.post('/login', login)

/**
 * POST /api/logout
 * Faculty logout endpoint
 */
router.post('/logout', logout)

/**
 * GET /api/check-auth
 * Check if faculty is authenticated
 */
router.get('/check-auth', checkAuth)

module.exports = router
