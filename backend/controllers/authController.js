// controllers/authController.js
// Handles authentication logic

const bcrypt = require('bcrypt')
const { getFacultyByEmail, createFaculty } = require('../database')

/**
 * Register controller
 * Creates a new faculty account
 */
const register = async (req, res) => {
  const { name, email, password } = req.body

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' })
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' })
  }

  try {
    // Check if faculty already exists
    const existingFaculty = await getFacultyByEmail(email)
    if (existingFaculty) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10)

    // Create new faculty
    const newFaculty = await createFaculty({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: hashedPassword
    })

    console.log(`✅ New faculty registered: ${email}`)

    res.status(201).json({
      success: true,
      email: newFaculty.email,
      name: newFaculty.name,
      message: 'Registration successful. Please login.',
    })
  } catch (error) {
    console.error('❌ Register error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/**
 * Login controller
 * Validates faculty credentials and creates session
 */
const login = async (req, res) => {
  const { email, password } = req.body

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  try {
    // Get faculty from database
    const faculty = await getFacultyByEmail(email)

    // Check if faculty exists
    if (!faculty) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, faculty.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create session
    req.session.user = {
      id: faculty._id,
      email: faculty.email,
      name: faculty.name,
    }

    console.log(`✅ Faculty logged in: ${email}`)

    res.status(200).json({
      success: true,
      email: faculty.email,
      name: faculty.name,
      message: 'Login successful',
    })
  } catch (error) {
    console.error('❌ Login error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

/**
 * Logout controller
 * Destroys session
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err.message })
    }

    console.log('✅ Faculty logged out')
    res.status(200).json({ success: true, message: 'Logout successful' })
  })
}

/**
 * Check session status
 */
const checkAuth = (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      authenticated: true,
      user: req.session.user,
    })
  } else {
    res.status(401).json({
      authenticated: false,
      message: 'Not authenticated',
    })
  }
}

module.exports = {
  register,
  login,
  logout,
  checkAuth,
}
