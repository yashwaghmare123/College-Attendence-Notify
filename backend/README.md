# Faculty Attendance Email Automation System Backend

Backend API server for the Faculty Attendance Email Automation System built with Node.js and Express.

## Features

✅ **Faculty Authentication** - Secure login with session management
✅ **File Upload** - Support for CSV and XLSX attendance files
✅ **Student Filtering** - Automatically identify students below attendance threshold
✅ **Email Notification** - Automated email sending using Gmail SMTP
✅ **Activity Logging** - Track all email sending activities in SQLite database

## Project Structure

```
backend/
├── server.js                 # Main Express server
├── database.js              # SQLite database setup
├── package.json             # Dependencies
├── controllers/             # Business logic handlers
│   ├── authController.js    # Authentication logic
│   ├── attendanceController.js  # File upload logic
│   └── emailController.js   # Email sending logic
├── routes/                  # API routes
│   ├── authRoutes.js       # /api/login, /api/logout
│   ├── attendanceRoutes.js # /api/upload, /api/preview
│   └── emailRoutes.js      # /api/send-emails
├── utils/                   # Utility functions
│   ├── fileParser.js       # CSV/XLSX parsing
│   └── emailService.js     # Nodemailer setup
└── uploads/                # Temporary file storage
```

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create .env File

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
SESSION_SECRET=your-secret-key-change-in-production
```

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Login
```
POST /api/login
Content-Type: application/json

{
  "email": "faculty@sggs.ac.in",
  "password": "password123"
}

Response:
{
  "success": true,
  "email": "faculty@sggs.ac.in",
  "name": "Head Of Department",
  "message": "Login successful"
}
```

#### Logout
```
POST /api/logout

Response:
{
  "success": true,
  "message": "Logout successful"
}
```

### Attendance

#### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Fields:
- file: (CSV or XLSX file)
- threshold: 75 (attendance percentage)

Response:
{
  "success": true,
  "message": "File uploaded successfully...",
  "studentCount": 5
}
```

#### Get Preview
```
POST /api/preview

Response:
{
  "success": true,
  "students": [
    {
      "regNo": "REG001",
      "name": "John Doe",
      "attendance": 60,
      "email": "REG001@sggs.ac.in"
    },
    ...
  ],
  "threshold": 75,
  "count": 5
}
```

### Email Sending

#### Send Emails
```
POST /api/send-emails
Content-Type: application/json

{
  "students": [...],
  "emailSubject": "Attendance Shortage Notification",
  "emailMessage": "Dear {StudentName}...",
  "facultyEmail": "faculty@gmail.com",
  "appPassword": "xxxx xxxx xxxx xxxx",
  "facultyName": "Head Of Department"
}

Response:
{
  "success": true,
  "message": "Emails sent: 5, Failed: 0",
  "totalSent": 5,
  "totalFailed": 0,
  "results": [...]
}
```

## Database

### SQLite Database Structure

#### faculty_users Table
```sql
CREATE TABLE faculty_users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### email_logs Table
```sql
CREATE TABLE email_logs (
  id INTEGER PRIMARY KEY,
  faculty_email TEXT NOT NULL,
  faculty_name TEXT NOT NULL,
  total_students INTEGER,
  emails_sent INTEGER,
  emails_failed INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## File Format Requirements

### CSV Format
```csv
Reg_No,Name,Attendance
REG001,John Doe,60
REG002,Jane Smith,70
REG003,Bob Johnson,50
```

### XLSX Format
Use columns: Reg_No, Name, Attendance

## Demo Credentials

**Email:** faculty@sggs.ac.in  
**Password:** password123

These are automatically created on first run.

## Email Configuration (Gmail)

### For Gmail Users with 2FA:

1. Go to [Google Account Security Settings](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to App Passwords
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character app password
6. Use this password in the application (NOT your regular Gmail password)

### Security Note

**The app password is NOT stored in the system.** It's only used during the current session to send emails and is discarded afterwards.

## Ports

- **Backend:** Port 5000 (configurable via PORT env variable)
- **Frontend:** Port 3000 (must match CORS settings)

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| multer | ^1.4.5 | File upload handling |
| xlsx | ^0.18.5 | Excel file parsing |
| csv-parser | ^3.0.0 | CSV file parsing |
| nodemailer | ^6.9.3 | Email sending |
| bcrypt | ^5.1.0 | Password hashing |
| express-session | ^1.17.3 | Session management |
| sqlite3 | ^5.1.6 | SQLite database |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^16.3.1 | Environment variables |

## Troubleshooting

### File Upload Issues
- Check file format (must be CSV or XLSX)
- Ensure file size < 10MB
- Verify column headers match expected format

### Email Sending Failures
- Use app-specific password (not regular Gmail password)
- Enable 2FA on Gmail account
- Check internet connection
- Verify recipient email format

### Database Issues
- Delete `faculty_attendance.db` to reset
- Check write permissions in `backend/` directory
- Try clearing `uploads/` folder

## Development Notes

- Sessions are stored in-memory (suitable for development; use external stores for production)
- File uploads are temporarily stored in `uploads/` folder and deleted after processing
- All errors are logged to console
- CORS is configured for localhost development

## Security Recommendations for Production

1. Use HTTPS
2. Store sessions in Redis or similar
3. Use secure session secret
4. Implement rate limiting
5. Add request validation
6. Use environment variables for sensitive config
7. Implement JWT tokens instead of sessions
8. Add logging and monitoring
9. Use database connection pooling
10. Implement backup strategies

## License

Academic Project - Shri G.S. Institute of Technology & Science

## Support

For issues or questions, please refer to the main README.md in the project root.
