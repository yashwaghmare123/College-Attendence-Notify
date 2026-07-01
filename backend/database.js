// Database setup - MongoDB with Mongoose
// This file initializes the MongoDB connection and provides database functions

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require('dotenv').config()

// Import models
const Faculty = require('./models/Faculty')
const EmailLog = require('./models/EmailLog')
const Year = require('./models/Year')
const Division = require('./models/Division')
const Subject = require('./models/Subject')
const Teacher = require('./models/Teacher')
const Classroom = require('./models/Classroom')
const Lab = require('./models/Lab')
const Batch = require('./models/Batch')
const Timetable = require('./models/Timetable')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://host.docker.internal:27017/faculty_attendance'

/**
 * Connect to MongoDB
 */
async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    await initializeDatabase()
  } catch (err) {
    console.error('❌ Error connecting to MongoDB:', err.message)
    console.error('\n⚠️  MongoDB Connection Failed!')
    console.error('   Make sure MongoDB is running:')
    console.error('   • Local: mongod or check Services (Windows)')
    console.error('   • MongoDB Atlas: Check MONGODB_URI in .env file')
    console.error('   • Connection string:', MONGODB_URI)
    process.exit(1)
  }
}

/**
 * Initialize database with demo faculty if needed
 */
async function initializeDatabase() {
  try {
    // Check if demo faculty exists
    const existingFaculty = await Faculty.findOne({ email: 'faculty@sggs.ac.in' })
    
    if (!existingFaculty) {
      const password = 'password123'
      const hashedPassword = bcrypt.hashSync(password, 10)
      
      await Faculty.create({
        name: 'Head Of Department',
        email: 'faculty@sggs.ac.in',
        password_hash: hashedPassword
      })
      
      console.log('✅ Demo faculty account created (faculty@sggs.ac.in / password123)')
    } else {
      console.log('✅ Database initialized with existing demo faculty')
    }
  } catch (err) {
    console.error('❌ Error initializing database:', err.message)
  }
}

/**
 * Get faculty by email
 * @param {string} email - Faculty email
 * @returns {Promise} - Faculty document
 */
const getFacultyByEmail = async (email) => {
  try {
    const faculty = await Faculty.findOne({ email: email.toLowerCase() })
    return faculty
  } catch (err) {
    console.error('❌ Error fetching faculty:', err.message)
    throw err
  }
}

/**
 * Create new faculty
 * @param {Object} facultyData - Faculty data object
 * @returns {Promise} - Created faculty document
 */
const createFaculty = async (facultyData) => {
  try {
    const faculty = await Faculty.create(facultyData)
    return faculty
  } catch (err) {
    console.error('❌ Error creating faculty:', err.message)
    throw err
  }
}

/**
 * Log email sending activity
 * @param {Object} logData - Log data object
 * @returns {Promise} - Created log document
 */
const logEmailActivity = async (logData) => {
  try {
    const log = await EmailLog.create(logData)
    console.log('✅ Email activity logged')
    return log
  } catch (err) {
    console.error('❌ Error logging email activity:', err.message)
    throw err
  }
}

/**
 * Get email logs
 * @param {number} limit - Number of logs to retrieve
 * @returns {Promise} - Array of email logs
 */
const getEmailLogs = async (limit = 10) => {
  try {
    const logs = await EmailLog.find().sort({ timestamp: -1 }).limit(limit)
    return logs
  } catch (err) {
    console.error('❌ Error fetching email logs:', err.message)
    throw err
  }
}

/**
 * Update faculty
 * @param {string} email - Faculty email
 * @param {Object} updateData - Data to update
 * @returns {Promise} - Updated faculty document
 */
const updateFaculty = async (email, updateData) => {
  try {
    const faculty = await Faculty.findOneAndUpdate(
      { email: email.toLowerCase() },
      updateData,
      { new: true }
    )
    return faculty
  } catch (err) {
    console.error('❌ Error updating faculty:', err.message)
    throw err
  }
}

module.exports = {
  connectDatabase,
  getFacultyByEmail,
  createFaculty,
  logEmailActivity,
  getEmailLogs,
  updateFaculty,
  Faculty,
  EmailLog,
  Year,
  Division,
  Subject,
  Teacher,
  Classroom,
  Lab,
  Batch,
  Timetable,
}
