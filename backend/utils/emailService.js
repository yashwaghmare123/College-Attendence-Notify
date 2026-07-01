// utils/emailService.js
// Email sending service using Nodemailer

const nodemailer = require('nodemailer')

/**
 * Send warning emails to students with low attendance
 * @param {Object} config - Email configuration
 * @param {string} config.facultyEmail - Faculty email address
 * @param {string} config.appPassword - App password for email
 * @param {Array} config.recipients - Array of student objects
 * @param {string} config.subject - Email subject
 * @param {string} config.message - Email message template
 * @param {string} config.facultyName - Faculty name for signature
 * @returns {Promise<Object>} Results object with sent/failed counts
 */
const sendAttendanceEmails = async (config) => {
  const { facultyEmail, appPassword, recipients, subject, message, facultyName } = config

  try {
    // Validate inputs
    if (!facultyEmail || !appPassword || !recipients || recipients.length === 0) {
      throw new Error('Invalid configuration provided')
    }

    // Create transporter with Gmail SMTP
    // Note: Using app-specific password for Gmail accounts with 2FA enabled
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: facultyEmail,
        pass: appPassword, // App password, not regular password
      },
    })

    // Verify connection
    await transporter.verify()
    console.log('✅ Email service connected')

    const results = []
    let successCount = 0
    let failureCount = 0

    // Send emails to each student
    for (const student of recipients) {
      try {
        // Replace placeholders in message
        const personalizedMessage = message
          .replace(/{StudentName}/g, student.name)
          .replace(/{Attendance}/g, student.attendance)
          .replace(/{FacultyName}/g, facultyName)

        // Send email
        const mailOptions = {
          from: facultyEmail,
          to: student.email,
          subject: subject,
          text: personalizedMessage,
          html: `<pre>${personalizedMessage}</pre>`,
        }

        const response = await transporter.sendMail(mailOptions)

        results.push({
          studentName: student.name,
          email: student.email,
          status: 'success',
          message: 'Email sent successfully',
        })

        successCount++
        console.log(`✅ Email sent to ${student.email}`)
      } catch (error) {
        results.push({
          studentName: student.name,
          email: student.email,
          status: 'failed',
          message: error.message,
        })

        failureCount++
        console.error(`❌ Failed to send email to ${student.email}: ${error.message}`)
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(
      `📧 Email sending complete: ${successCount} sent, ${failureCount} failed`
    )

    return {
      success: true,
      totalSent: successCount,
      totalFailed: failureCount,
      results: results,
    }
  } catch (error) {
    console.error('❌ Email service error:', error.message)
    return {
      success: false,
      message: error.message,
      results: [],
    }
  }
}

/**
 * Test email configuration
 * @param {string} email - Email address to test
 * @param {string} password - App password
 * @returns {Promise<boolean>} True if connection successful
 */
const testEmailConfiguration = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    })

    await transporter.verify()
    console.log('✅ Email configuration verified')
    return true
  } catch (error) {
    console.error('❌ Email configuration failed:', error.message)
    throw error
  }
}

/**
 * Send generic emails (for exam results, announcements, etc.)
 * @param {Object} config - Email configuration
 * @param {string} config.facultyEmail - Faculty email address
 * @param {string} config.appPassword - App password for email
 * @param {Array} config.recipients - Array of recipient objects (must have 'email' and 'name' fields)
 * @param {string} config.subject - Email subject
 * @param {string} config.message - Email message template
 * @param {string} config.facultyName - Faculty name for signature
 * @returns {Promise<Object>} Results object with sent/failed counts
 */
const sendGenericEmails = async (config) => {
  const { facultyEmail, appPassword, recipients, subject, message, facultyName } = config

  try {
    // Validate inputs
    if (!facultyEmail || !appPassword || !recipients || recipients.length === 0) {
      throw new Error('Invalid configuration provided')
    }

    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: facultyEmail,
        pass: appPassword,
      },
    })

    // Verify connection
    await transporter.verify()
    console.log('✅ Email service connected')

    const results = []
    let successCount = 0
    let failureCount = 0

    // Send emails to each recipient
    for (const recipient of recipients) {
      try {
        // Get name - try different possible fields
        const recipientName = recipient.name || recipient.Name || recipient.studentName || 'Student'
        const recipientEmail = recipient.email || recipient.Email || recipient.studentEmail

        if (!recipientEmail) {
          throw new Error('Recipient email is required')
        }

        // Replace placeholders in message
        let personalizedMessage = message
          .replace(/{StudentName}/g, recipientName)
          .replace(/{Name}/g, recipientName)
          .replace(/{FacultyName}/g, facultyName || 'Faculty')
          .replace(/{Email}/g, recipientEmail)

        // Replace any other custom fields from recipient
        Object.keys(recipient).forEach((key) => {
          const placeholder = `{${key}}`
          personalizedMessage = personalizedMessage.replace(
            new RegExp(placeholder, 'g'),
            recipient[key]
          )
        })

        // Send email
        const mailOptions = {
          from: facultyEmail,
          to: recipientEmail,
          subject: subject,
          text: personalizedMessage,
          html: `<pre>${personalizedMessage}</pre>`,
        }

        await transporter.sendMail(mailOptions)

        results.push({
          studentName: recipientName,
          email: recipientEmail,
          status: 'success',
          message: 'Email sent successfully',
        })

        successCount++
        console.log(`✅ Email sent to ${recipientEmail}`)
      } catch (error) {
        const recipientEmail = recipient.email || recipient.Email || 'unknown'
        const recipientName = recipient.name || recipient.Name || 'Unknown'

        results.push({
          studentName: recipientName,
          email: recipientEmail,
          status: 'failed',
          message: error.message,
        })

        failureCount++
        console.error(`❌ Failed to send email to ${recipientEmail}: ${error.message}`)
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log(
      `📧 Email sending complete: ${successCount} sent, ${failureCount} failed`
    )

    return {
      success: true,
      totalSent: successCount,
      totalFailed: failureCount,
      results: results,
    }
  } catch (error) {
    console.error('❌ Email service error:', error.message)
    return {
      success: false,
      message: error.message,
      results: [],
    }
  }
}

module.exports = {
  sendAttendanceEmails,
  sendGenericEmails,
  testEmailConfiguration,
}
