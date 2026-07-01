// utils/fileParser.js
// Utility functions to parse CSV and XLSX files

const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')

/**
 * Parse CSV file and extract student data
 * @param {string} filePath - Path to CSV file
 * @returns {Promise<Array>} Array of parsed student data
 */
const parseCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const csvParser = require('csv-parser')
      const results = []

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          results.push(row)
        })
        .on('end', () => {
          resolve(results)
        })
        .on('error', (err) => {
          reject(err)
        })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Parse XLSX file and extract student data
 * @param {string} filePath - Path to XLSX file
 * @returns {Promise<Array>} Array of parsed student data
 */
const parseXLSXFile = (filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const workbook = xlsx.readFile(filePath)
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json(sheet)
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Extract all student data (unfiltered)
 * @param {Array} rawData - Raw data from file
 * @returns {Array} All normalized student data
 */
const extractAllStudentData = (rawData) => {
  try {
    const students = []

    rawData.forEach((row) => {
      // Map possible column names (case-insensitive)
      const regNo =
        row['Reg_No'] ||
        row['Registration No'] ||
        row['REG_NO'] ||
        row['Reg No'] ||
        row['reg_no'] ||
        row['registration_no']

      const name =
        row['Name'] ||
        row['Student Name'] ||
        row['Student_Name'] ||
        row['STUDENT_NAME'] ||
        row['name']

      const attendance =
        parseFloat(row['Attendance']) ||
        parseFloat(row['Attendance %']) ||
        parseFloat(row['attendance']) ||
        parseFloat(row['Attendance_Percentage'])

      // Validate data
      if (regNo && name && attendance !== undefined && !isNaN(attendance)) {
        students.push({
          regNo: String(regNo).trim(),
          name: String(name).trim(),
          attendance: Math.round(attendance),
          email: `${String(regNo).trim().toUpperCase()}@sggs.ac.in`,
        })
      }
    })

    return students
  } catch (error) {
    throw new Error('Failed to extract student data: ' + error.message)
  }
}

/**
 * Filter students below threshold
 * @param {Array} students - Array of students
 * @param {number} threshold - Attendance threshold
 * @returns {Array} Students with attendance below threshold
 */
const filterStudentsByThreshold = (students, threshold) => {
  return students.filter((student) => student.attendance < threshold)
}

/**
 * Extract and validate attendance student data
 * @param {Array} rawData - Raw data from file
 * @param {number} threshold - Attendance threshold
 * @returns {Array} Filtered and normalized student data below threshold
 */
const extractStudentData = (rawData, threshold) => {
  try {
    const allStudents = extractAllStudentData(rawData)
    return filterStudentsByThreshold(allStudents, threshold)
  } catch (error) {
    throw new Error('Failed to extract student data: ' + error.message)
  }
}

/**
 * Parse attendance file and return all students (unfiltered)
 * @param {string} filePath - Path to the file
 * @returns {Promise<Array>} Array of all students
 */
const parseAttendanceFileAll = async (filePath) => {
  try {
    // Determine file type
    const ext = path.extname(filePath).toLowerCase()
    let rawData = []

    if (ext === '.csv') {
      rawData = await parseCSVFile(filePath)
    } else if (ext === '.xlsx' || ext === '.xls') {
      rawData = await parseXLSXFile(filePath)
    } else {
      throw new Error('Unsupported file format. Please upload a CSV or XLSX file.')
    }

    return extractAllStudentData(rawData)
  } catch (error) {
    throw error
  }
}

/**
 * Parse attendance file (supports both CSV and XLSX)
 * @param {string} filePath - Path to the file
 * @param {number} threshold - Attendance threshold
 * @returns {Promise<Array>} Array of students with low attendance
 */
const parseAttendanceFile = async (filePath, threshold = 75) => {
  try {
    // Determine file type
    const ext = path.extname(filePath).toLowerCase()
    let rawData = []

    if (ext === '.csv') {
      rawData = await parseCSVFile(filePath)
    } else if (ext === '.xlsx' || ext === '.xls') {
      rawData = await parseXLSXFile(filePath)
    } else {
      throw new Error('Unsupported file format. Please use CSV or XLSX.')
    }

    // Extract and filter students
    const students = extractStudentData(rawData, threshold)

    // Clean up uploaded file
    setTimeout(() => {
      try {
        fs.unlinkSync(filePath)
        console.log('✅ Temporary file cleaned up')
      } catch (err) {
        console.log('⚠️  Could not delete temporary file')
      }
    }, 5000)

    return students
  } catch (error) {
    console.error('❌ File parsing error:', error)
    throw error
  }
}

/**
 * Parse generic file (CSV or XLSX) - Returns headers and rows for exam results
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} Object with headers array and rows array
 */
const parseGenericFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase()
    let data = []
    let headers = []

    if (ext === '.csv') {
      data = await parseCSVFile(filePath)
    } else if (ext === '.xlsx' || ext === '.xls') {
      data = await parseXLSXFile(filePath)
    } else {
      throw new Error('Unsupported file format. Please upload a CSV or XLSX file.')
    }

    if (data.length === 0) {
      throw new Error('File is empty. Please upload a file with data.')
    }

    // Extract headers from first row
    headers = Object.keys(data[0])

    // Clean up uploaded file
    setTimeout(() => {
      try {
        fs.unlinkSync(filePath)
        console.log('✅ Temporary file cleaned up')
      } catch (err) {
        console.log('⚠️  Could not delete temporary file')
      }
    }, 5000)

    return {
      headers: headers,
      rows: data,
    }
  } catch (error) {
    console.error('❌ File parsing error:', error)
    throw error
  }
}

module.exports = {
  parseCSVFile,
  parseXLSXFile,
  extractStudentData,
  extractAllStudentData,
  filterStudentsByThreshold,
  parseAttendanceFile,
  parseAttendanceFileAll,
  parseGenericFile,
}
