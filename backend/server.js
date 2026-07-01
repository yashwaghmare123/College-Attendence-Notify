// server.js
// Main Express server file
// Faculty Attendance Email Automation System - Backend Server

const express = require('express')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

// Import routes
const authRoutes = require('./routes/authRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const emailRoutes = require('./routes/emailRoutes')
const resultsRoutes = require('./routes/resultsRoutes')
const profileRoutes = require('./routes/profileRoutes')
const timetableRoutes = require('./routes/timetableRoutes')
const yearRoutes = require('./routes/yearRoutes')
const divisionRoutes = require('./routes/divisionRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const subjectRoutes = require('./routes/subjectRoutes')
const classroomRoutes = require('./routes/classroomRoutes')
const labRoutes = require('./routes/labRoutes')
const batchRoutes = require('./routes/batchRoutes')

// Import database connection
const { connectDatabase } = require('./database')

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 5001

/**
 * MIDDLEWARE SETUP
 */

// Body parser middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// CORS middleware - Allow frontend to communicate with backend
app.use(
  cors({
    origin: [
      'http://localhost:3001',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL || 'http://localhost:3001',
    ],
    credentials: true,
  })
)

// Session middleware - Store faculty session information
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
)

// Static files middleware - Serve uploaded profile photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

/**
 * ROUTES
 */

// Authentication routes
// POST /api/login - Faculty login
// POST /api/logout - Faculty logout
// GET /api/check-auth - Check authentication status
app.use('/api', authRoutes)

// Attendance routes
// POST /api/upload - Upload attendance file
// POST /api/preview - Get preview of students
app.use('/api', attendanceRoutes)

// Email routes
// POST /api/send-emails - Send emails to students
app.use('/api', emailRoutes)

// Exam Results routes
// POST /api/results/upload - Upload exam results file
// POST /api/results/preview - Get preview of exam results
// POST /api/results/send-emails - Send exam results emails
app.use('/api', resultsRoutes)

// Profile routes
// POST /api/profile/update - Update faculty profile with photo upload
// GET /api/profile/get - Get faculty profile
app.use('/api/profile', profileRoutes)

// Timetable Management Routes (NEW)
// POST /api/timetable/generate - Generate timetable
// GET /api/timetable - Get all timetables
// GET /api/timetable/:id - Get specific timetable
app.use('/api/timetable', timetableRoutes)

// Year Management Routes (NEW)
// GET /api/year - Get all years
// POST /api/year - Create year
app.use('/api/year', yearRoutes)

// Division Management Routes (NEW)
// GET /api/division - Get all divisions
// POST /api/division - Create division
// POST /api/division/auto-generate - Auto-generate divisions for a year
app.use('/api/division', divisionRoutes)

// Teacher Management Routes (NEW)
// GET /api/teacher - Get all teachers
// POST /api/teacher - Create teacher
app.use('/api/teacher', teacherRoutes)

// Subject Management Routes (NEW)
// GET /api/subject - Get all subjects
// POST /api/subject - Create subject
app.use('/api/subject', subjectRoutes)

// Classroom Management Routes (NEW)
// GET /api/classroom - Get all classrooms
// POST /api/classroom - Create classroom
app.use('/api/classroom', classroomRoutes)

// Lab Management Routes (NEW)
// GET /api/lab - Get all labs
// POST /api/lab - Create lab
app.use('/api/lab', labRoutes)

// Batch Management Routes (NEW)
// GET /api/batch - Get all batches
// POST /api/batch - Create batch
app.use('/api/batch', batchRoutes)

/**
 * HEALTH CHECK ENDPOINT
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Faculty Attendance Email Automation System API is running',
    timestamp: new Date().toISOString(),
  })
})

/**
 * 404 NOT FOUND HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
  })
})

/**
 * ERROR HANDLING MIDDLEWARE
 */
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err)

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' })
  }

  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message,
  })
})

/**
 * START SERVER
 */
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase()
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Faculty Attendance Email Automation System                    ║
║  Backend API Server                                            ║
╚════════════════════════════════════════════════════════════════╝

📡 Server running on: http://localhost:${PORT}
🌐 CORS enabled for: http://localhost:3001 || http://localhost:3000
📝 Environment: ${process.env.NODE_ENV || 'development'}

Available Endpoints:
  • POST   /api/register        - Faculty registration
  • POST   /api/login           - Faculty login
  • POST   /api/logout          - Faculty logout
  • GET    /api/check-auth      - Check authentication
  • POST   /api/upload          - Upload attendance file
  • POST   /api/preview         - Get student preview
  • POST   /api/send-emails     - Send emails to students
  • GET    /api/health          - Health check

Demo Credentials:
  📧 Email: faculty@sggs.ac.in
  🔑 Password: password123

═════════════════════════════════════════════════════════════════
`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

// Start the server
startServer()

/**
 * Graceful shutdown
 */
console.log(" Test kr rha hu--");
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...')
  db.close((err) => {
    if (err) {
      console.error('❌ Error closing database:', err)
    } else {
      console.log('✅ Database connection closed')
    }
    process.exit(0)
  })
})

module.exports = app
