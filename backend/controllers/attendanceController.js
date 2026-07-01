// controllers/attendanceController.js
// Handles attendance file upload and processing

const crypto = require('crypto')
const { parseAttendanceFile, parseAttendanceFileAll, filterStudentsByThreshold } = require('../utils/fileParser')

// Store parsed data in memory for the current session
let sessionData = {}

/**
 * Generate a unique session ID
 */
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Upload attendance file
 */
const uploadFile = async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const { threshold } = req.body
    const thresholdValue = parseInt(threshold) || 75

    // Validate threshold
    if (thresholdValue < 0 || thresholdValue > 100) {
      return res.status(400).json({ message: 'Threshold must be between 0 and 100' })
    }

    console.log(`📂 Processing file: ${req.file.filename}`)

    // Parse the file and get ALL students (unfiltered)
    const allStudents = await parseAttendanceFileAll(req.file.path)

    // Generate a unique session ID for this upload
    const sessionId = generateSessionId()
    sessionData[sessionId] = {
      allStudents: allStudents,  // Store ALL students unfiltered
      threshold: thresholdValue,
      uploadedAt: new Date(),
    }

    const belowThresholdCount = allStudents.filter(s => s.attendance < thresholdValue).length
    console.log(`✅ File processed: ${belowThresholdCount} students with low attendance`)
    console.log(`💾 Stored in session: ${sessionId}`)
    console.log(`📊 Total sessions: ${Object.keys(sessionData).length}`)

    res.status(200).json({
      success: true,
      message: `File uploaded successfully. Found ${belowThresholdCount} students with attendance below ${thresholdValue}%`,
      studentCount: belowThresholdCount,
      sessionId: sessionId,
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    res.status(400).json({ message: error.message })
  }
}

/**
 * Get preview of students who will receive emails
 */
const getPreview = (req, res) => {
  try {
    const { sessionId, threshold } = req.body
    const currentThreshold = threshold ? parseInt(threshold) : undefined

    console.log(`🔍 Preview requested. Session ID: ${sessionId}, Current Threshold: ${currentThreshold}`)
    console.log(`📊 Available sessions:`, Object.keys(sessionData))
    
    const data = sessionData[sessionId]

    if (!data || !data.allStudents) {
      console.log(`❌ No data found for session: ${sessionId}`)
      return res.status(400).json({ message: 'No students data found. Please upload a file first.' })
    }

    // Re-filter based on current threshold if provided, otherwise use stored threshold
    const thresholdToUse = currentThreshold !== undefined ? currentThreshold : data.threshold
    const filteredStudents = filterStudentsByThreshold(data.allStudents, thresholdToUse)

    console.log(`✅ Found ${filteredStudents.length} students for preview (threshold: ${thresholdToUse}%)`)
    res.status(200).json({
      success: true,
      students: filteredStudents,
      threshold: thresholdToUse,
      count: filteredStudents.length,
    })
  } catch (error) {
    console.error('❌ Preview error:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  uploadFile,
  getPreview,
}
