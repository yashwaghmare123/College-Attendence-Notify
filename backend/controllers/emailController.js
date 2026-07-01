// controllers/emailController.js
// Handles email sending operations

const { sendAttendanceEmails } = require('../utils/emailService')
const { logEmailActivity } = require('../database')

/**
 * Send emails to students with low attendance
 */
const sendEmails = async (req, res) => {
  try {
    const {
      students,
      emailSubject,
      emailMessage,
      facultyEmail,
      appPassword,
      facultyName,
    } = req.body

    // Validate inputs
    if (!students || students.length === 0) {
      return res.status(400).json({ message: 'No students to send emails to' })
    }

    if (!emailSubject || !emailMessage) {
      return res.status(400).json({ message: 'Email subject and message are required' })
    }

    if (!facultyEmail || !appPassword) {
      return res.status(400).json({ message: 'Faculty email and password are required' })
    }

    console.log(`📧 Sending emails to ${students.length} students...`)

    // Send emails
    const emailResult = await sendAttendanceEmails({
      facultyEmail,
      appPassword,
      recipients: students,
      subject: emailSubject,
      message: emailMessage,
      facultyName,
    })

    if (!emailResult.success) {
      return res.status(400).json({ message: emailResult.message })
    }

    // Log activity to database
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

    console.log(`✅ Email sending complete`)

    res.status(200).json({
      success: true,
      message: `Emails sent: ${emailResult.totalSent}, Failed: ${emailResult.totalFailed}`,
      totalSent: emailResult.totalSent,
      totalFailed: emailResult.totalFailed,
      results: emailResult.results,
    })
  } catch (error) {
    console.error('❌ Email sending error:', error)
    res.status(500).json({ message: 'Failed to send emails', error: error.message })
  }
}

module.exports = {
  sendEmails,
}
