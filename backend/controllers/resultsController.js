// controllers/resultsController.js
// Handles exam results file upload and generic email processing

const crypto = require('crypto')
const { parseGenericFile } = require('../utils/fileParser')
const { sendGenericEmails } = require('../utils/emailService')
const { logEmailActivity } = require('../database')

// Store parsed data in memory
let sessionData = {}

/**
 * Generate a unique session ID
 */
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Upload exam results file
 */
const uploadResults = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        const { resultType } = req.body
        console.log(`📂 Processing exam results file: ${req.file.filename} (${resultType})`)

        const { headers, rows } = await parseGenericFile(req.file.path)

        const sessionId = generateSessionId()
        sessionData[sessionId] = {
            headers,
            rows,
            resultType,
            uploadedAt: new Date(),
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded and parsed successfully',
            headers,
            rowCount: rows.length,
            resultType,
            sessionId
        })
    } catch (error) {
        console.error('❌ Results upload error:', error)
        res.status(400).json({ message: error.message })
    }
}

/**
 * Get preview with mapping
 */
const getResultsPreview = (req, res) => {
    try {
        const { sessionId } = req.body
        const data = sessionData[sessionId]

        if (!data || !data.rows) {
            return res.status(400).json({ message: 'No data found. Please upload a file first.' })
        }

        const { selectedFields, emailField } = req.body

        if (!emailField) {
            return res.status(400).json({ message: 'Email field mapping is required' })
        }

        // Map rows to include only selected fields and normalized email/name
        const previewData = data.rows.map(row => {
            const mappedRow = {}
            selectedFields.forEach(field => {
                mappedRow[field] = row[field]
            })

            // Ensure email and name are present for the service
            let emailValue = String(row[emailField]).trim()
            
            // Add @sggs.ac.in suffix if it's a registration number (no @ symbol)
            if (!emailValue.includes('@')) {
                emailValue = `${emailValue.toUpperCase()}@sggs.ac.in`
            }
            
            mappedRow.email = emailValue
            
            // Try to find a name field if not selected
            if (!mappedRow.name) {
                const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name'))
                if (nameKey) mappedRow.name = row[nameKey]
            }

            return mappedRow
        })

        res.status(200).json({
            success: true,
            students: previewData,
            headers: selectedFields,
            count: previewData.length
        })
    } catch (error) {
        console.error('❌ Results preview error:', error)
        res.status(500).json({ message: error.message })
    }
}

/**
 * Send results emails
 */
const sendResults = async (req, res) => {
    try {
        const {
            students,
            emailSubject,
            emailMessage,
            facultyEmail,
            appPassword,
            facultyName,
        } = req.body

        if (!students || students.length === 0) {
            return res.status(400).json({ message: 'No recipients data provided' })
        }

        console.log(`📧 Sending exam results to ${students.length} students...`)

        // Ensure all emails have @sggs.ac.in suffix if they're registration numbers
        const normalizedStudents = students.map(student => ({
            ...student,
            email: !String(student.email).includes('@') 
                ? `${String(student.email).trim().toUpperCase()}@sggs.ac.in`
                : student.email
        }))

        const emailResult = await sendGenericEmails({
            facultyEmail,
            appPassword,
            recipients: normalizedStudents,
            subject: emailSubject,
            message: emailMessage,
            facultyName,
        })

        if (!emailResult.success) {
            return res.status(400).json({ message: emailResult.message })
        }

        // Log activity
        try {
            await logEmailActivity({
                faculty_email: facultyEmail,
                faculty_name: facultyName,
                total_students: students.length,
                emails_sent: emailResult.totalSent,
                emails_failed: emailResult.totalFailed,
            })
        } catch (logErr) {
            console.warn('⚠️ Failed to log email activity:', logErr.message)
            // Don't fail the main request if logging fails
        }

        res.status(200).json({
            success: true,
            message: `Emails sent: ${emailResult.totalSent}, Failed: ${emailResult.totalFailed}`,
            totalSent: emailResult.totalSent,
            totalFailed: emailResult.totalFailed,
            results: emailResult.results,
        })
    } catch (error) {
        console.error('❌ Results email error:', error)
        res.status(500).json({ message: 'Failed to send emails', error: error.message })
    }
}

module.exports = {
    uploadResults,
    getResultsPreview,
    sendResults
}
