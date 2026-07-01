# Faculty Attendance Email Automation System

A complete web application for college faculty to automate attendance tracking and send automated email notifications to students with low attendance.

## 📋 Project Overview

This is an academic project built with:
- **Frontend:** Next.js 14 with TypeScript and Tailwind CSS
- **Backend:** Node.js with Express.js
- **Database:** SQLite3
- **Email Service:** Gmail SMTP with Nodemailer

## 🎯 Key Features

✅ **Faculty Authentication** - Secure login system
✅ **File Management** - Upload CSV/XLSX attendance files
✅ **Smart Filtering** - Auto-identify students below attendance threshold
✅ **Email Notifications** - Automated warning emails with personalization
✅ **Activity Logging** - Track all email sending activities
✅ **Responsive UI** - Works on all devices
✅ **Session Security** - No password storage

## 📁 Project Structure

```
collageminiproject/
├── frontend/                    # Next.js Application
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Login page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── preview/           # Preview recipients
│   │   └── results/           # Email results
│   ├── components/            # React components
│   │   ├── Navbar.tsx
│   │   ├── UploadSection.tsx
│   │   ├── ThresholdSection.tsx
│   │   ├── EmailDetailsSection.tsx
│   │   └── CredentialsSection.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── README.md
│
└── backend/                     # Express.js API Server
    ├── server.js              # Main server file
    ├── database.js            # SQLite setup
    ├── controllers/           # Business logic
    │   ├── authController.js
    │   ├── attendanceController.js
    │   └── emailController.js
    ├── routes/                # API endpoints
    │   ├── authRoutes.js
    │   ├── attendanceRoutes.js
    │   └── emailRoutes.js
    ├── utils/                 # Utilities
    │   ├── fileParser.js
    │   └── emailService.js
    ├── uploads/              # Temporary file storage
    ├── package.json
    └── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Git
- Gmail account with App Password (for email sending)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3001`

### Demo Credentials

```
Email: faculty@sggs.ac.in
Password: password123
```

## 📋 Application Flow

1. **Login** → Faculty enters credentials
2. **Upload** → Faculty uploads attendance CSV/XLSX file
3. **Configure** → Set threshold, email template, credentials
4. **Preview** → Review students who will receive emails
5. **Send** → Send automated warning emails
6. **Results** → View sending status and statistics

## 📊 File Format Requirements

### CSV Example
```csv
Reg_No,Name,Attendance
REG001,John Doe,60
REG002,Jane Smith,70
REG003,Bob Johnson,45
```

### XLSX
Use columns: Reg_No, Name, Attendance

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
SESSION_SECRET=your-secret-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📧 Email Configuration

### For Gmail Users:

1. Enable 2-Step Verification in Google Account
2. Go to App Passwords (myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Use in the application

**Note:** Passwords are NOT stored in the system

## 🛠️ API Endpoints

### Authentication
- `POST /api/login` - Faculty login
- `POST /api/logout` - Faculty logout
- `GET /api/check-auth` - Check authentication status

### Attendance
- `POST /api/upload` - Upload attendance file
- `POST /api/preview` - Get students preview

### Email
- `POST /api/send-emails` - Send emails to students

### Health
- `GET /api/health` - Server health check

## 💾 Database Schema

### faculty_users
```sql
id (INTEGER PRIMARY KEY)
name (TEXT)
email (TEXT UNIQUE)
password_hash (TEXT)
created_at (DATETIME)
```

### email_logs
```sql
id (INTEGER PRIMARY KEY)
faculty_email (TEXT)
faculty_name (TEXT)
total_students (INTEGER)
emails_sent (INTEGER)
emails_failed (INTEGER)
timestamp (DATETIME)
```

## 🎨 UI Features

### Login Page
- Clean, centered card layout
- Demo credentials display
- Error message handling
- Responsive design

### Dashboard Page
- Upload section with drag-drop
- Threshold slider (0-100)
- Email customization area
- Credentials input with security warning
- Action buttons

### Preview Page
- Statistics cards
- Student list table
- Email address display
- Attendance percentage badges
- Send confirmation

### Results Page
- Success message banner
- Success/failure statistics
- Detailed results table
- Status badges
- Success rate display

## 🔐 Security Features

✅ Password hashing with bcrypt
✅ Session-based authentication
✅ No password storage (ephemeral)
✅ CORS protection
✅ File type validation
✅ Input sanitization
✅ Rate limiting ready

## 🧪 Testing the System

1. Start both frontend and backend
2. Login with demo credentials
3. Download sample CSV from instructions
4. Upload the file with 75% threshold
5. Review recipients
6. Configure Gmail app password
7. Send test emails

## 📚 Key Technologies

| Technology | Purpose |
|-----------|---------|
| Next.js | Frontend framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| React Hooks | State management |
| Axios | HTTP client |
| Express.js | Backend server |
| Multer | File uploads |
| XLSX | Excel parsing |
| CSV-Parser | CSV parsing |
| Nodemailer | Email sending |
| SQLite3 | Database |
| Bcrypt | Password hashing |

## 🚀 Deployment

### Vercel (Frontend)
```bash
# Push to GitHub and connect to Vercel
# Set environment variables
# Auto-deploys on push
```

### Railway/Heroku (Backend)
```bash
# Deploy Express server
# Set environment variables
# Configure database
```

## 📝 Code Comments

All code includes extensive comments explaining:
- Function purposes
- Parameter descriptions
- Return values
- Error handling
- Business logic

Making it easy to understand for:
- College projects
- Technical interviews
- Learning purposes
- Maintenance

## 🐛 Troubleshooting

### Frontend won't load
```bash
npm install
npm run dev
# Check NEXT_PUBLIC_API_URL in .env.local
```

### Backend won't start
```bash
npm install
npm run dev
# Check PORT availability
# Verify database permissions
```

### Emails not sending
- Use app password (not regular password)
- Enable 2FA on Gmail
- Check internet connection
- Verify email format

### Database errors
```bash
# Delete faculty_attendance.db to reset
# Check write permissions
# Verify SQLite installation
```

## 📖 Documentation

Each directory contains a detailed README.md:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)

## 👨‍💻 Code Quality

- **TypeScript:** All components properly typed
- **Comments:** Extensive inline documentation
- **Structure:** Clear separation of concerns
- **Naming:** Descriptive variable/function names
- **Error Handling:** Comprehensive try-catch blocks
- **Validation:** Input validation at every step

## 📄 License

Academic Project - Shri G.S. Institute of Technology & Science

## 🤝 Contributing

This is an academic project. Feel free to:
- Study the code
- Use as reference
- Modify for learning
- Submit improvements

## 📞 Support

For issues or questions:
1. Check backend README.md
2. Check frontend README.md
3. Review code comments
4. Check console logs
5. Verify configuration

## 🎓 Viva Questions (Common)

1. **How does file upload work?**
   - Multer middleware handles uploads
   - Files stored temporarily in uploads/
   - Parsed with xlsx or csv-parser
   - Deleted after processing

2. **How are students filtered?**
   - File parsed to extract attendance
   - Compared against threshold
   - Students below threshold selected
   - Email generated automatically

3. **How are emails sent?**
   - Using Nodemailer with Gmail SMTP
   - App-specific password required
   - Personalized with placeholders
   - Rate-limited to avoid blocking

4. **How is data secured?**
   - Passwords hashed with bcrypt
   - Sessions stored server-side
   - No login credentials stored
   - CORS protection enabled

5. **How do sessions work?**
   - Express-session middleware
   - Unique session ID per login
   - Valid for 24 hours
   - Cleared on logout

## ✨ Features Explained

### Email Personalization
```
Dear {StudentName},
Your attendance is {Attendance}%, which is below the required minimum.
Please improve your attendance to avoid academic penalties.
Regards,
{FacultyName}
```

### Attendance Filtering
- File parsed line by line
- Registration number extracted
- Student name extracted
- Attendance % compared to threshold
- Only matching students selected

### Email Generation
- Email format: `RegNo@sggs.ac.in`
- Subject customizable
- Message customizable
- Placeholders auto-replaced
- Sent via faculty's Gmail

---

**Built with ❤️ for Academic Learning**

Last Updated: March 2025
