# Faculty Attendance Email Automation System - Frontend

Modern, responsive Next.js frontend for the Faculty Attendance Email Automation System.

## Features

✅ **Responsive Design** - Works on desktop, tablet, and mobile devices
✅ **Tailwind CSS** - Modern, utility-first styling
✅ **TypeScript** - Type-safe React components
✅ **Authentication** - Faculty login system
✅ **File Upload** - CSV/XLSX file support
✅ **Email Preview** - Review students before sending
✅ **Real-time Feedback** - Loading states and error handling

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Runtime:** Node.js

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Login page
│   ├── dashboard/               
│   │   └── page.tsx            # Dashboard page
│   ├── preview/
│   │   └── page.tsx            # Preview recipients page
│   └── results/
│       └── page.tsx            # Email results page
├── components/                   # React components
│   ├── Navbar.tsx              # Navigation bar
│   ├── UploadSection.tsx        # File upload
│   ├── ThresholdSection.tsx     # Threshold input
│   ├── EmailDetailsSection.tsx  # Email templates
│   └── CredentialsSection.tsx   # Email credentials
├── styles/
│   └── globals.css             # Global styles
├── lib/                         # Utilities
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind config
├── next.config.js              # Next.js config
└── .env.local                  # Environment variables
```

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create .env.local File

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### 4. Build for Production

```bash
npm run build
npm start
```

## Pages Overview

### 1. Login Page (`/`)
- Faculty email input
- Password input
- Centered card layout with branding
- Demo credentials display
- Validation and error handling

### 2. Dashboard Page (`/dashboard`)
- **Upload Attendance Section**
  - CSV/XLSX file input
  - File validation
  - Upload status

- **Attendance Threshold Section**
  - Number input (0-100)
  - Visual slider
  - Real-time threshold display

- **Email Details Section**
  - Subject input
  - Message template textarea
  - Placeholder help text
  - Placeholder examples

- **Faculty Email Credentials Section**
  - Email address input
  - App password input
  - Security warning
  - Gmail setup guide

- **Action Buttons**
  - Preview Recipients
  - Send Emails

### 3. Preview Recipients Page (`/preview`)
- Displays list of students who will receive emails
- Stats cards (total, low attendance, ready to send)
- Detailed table with columns:
  - Student Name
  - Registration Number
  - Attendance %
  - Email address
- Back and Send buttons

### 4. Email Results Page (`/results`)
- Success message
- Stats cards:
  - Total Students
  - Emails Sent
  - Failed Emails
  - Success Rate
- Detailed results table with status badges
- Back to Dashboard button

## Components

### Navbar
Navigation component with:
- Logo and title
- Faculty name display
- Logout button

### UploadSection
File upload component with:
- Drag-and-drop area
- File validation
- Progress indication
- File size display

### ThresholdSection
Attendance threshold selector with:
- Number input (0-100)
- Visual range slider
- Current value display
- Help text

### EmailDetailsSection
Email template customizer with:
- Subject input
- Message textarea
- Placeholder guide
- Template help

### CredentialsSection
Email credentials form with:
- Email address input
- App password input
- Security warnings
- Gmail 2FA setup guide

## API Integration

All API calls use Axios with configuration:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

axios.post(`${API_URL}/api/endpoint`, data, {
  withCredentials: true // Include session cookies
})
```

## Styling

### Tailwind CSS Classes Used
- Responsive grids: `grid-cols-1 lg:grid-cols-2`
- Color schemes: `bg-blue-600`, `text-gray-700`
- Spacing: `mb-6`, `p-8`
- Transitions: `transition-all`, `hover:bg-blue-700`
- Animations: `animate-spin`

### Global Styles
- Custom CSS variables
- Smooth scrollbar styling
- Form elements styling
- Button utility classes

## State Management

Uses React Hooks:
- `useState` - Component state
- `useEffect` - Side effects
- `useRouter` - Navigation
- `useCallback` - Optimized callbacks

## Session Management

Faculty data is stored in `sessionStorage`:
- `facultyEmail` - Login email
- `facultyName` - Faculty name
- `threshold` - Attendance threshold
- `emailSubject` - Email subject
- `emailMessage` - Email body
- `appPassword` - Gmail app password
- `emailResults` - Sending results

## Form Validation

- Email format validation
- File type checking (CSV/XLSX)
- Threshold range validation (0-100)
- Required field checks
- File size limits

## Error Handling

- API error messages displayed to user
- Form validation feedback
- Network error alerts
- Try-catch blocks for async operations

## Loading States

- Spinner animations
- Disabled buttons during operations
- Loading text updates
- Progress indicators

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Full-width inputs
- Stacked buttons
- Horizontal scrolling tables

### Tablet (768px - 1024px)
- Two-column grid where appropriate
- Medium padding
- Touch-friendly buttons

### Desktop (> 1024px)
- Full multi-column layouts
- Optimal spacing
- Hover effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Debugging
- Use React Developer Tools browser extension
- Check browser console for errors
- Use `console.log()` for state inspection
- Network tab for API calls

### Performance
- NextJS automatic code splitting
- Image optimization
- CSS minification
- Asset caching

### TypeScript
- All components are fully typed
- Strict mode enabled
- Interfaces defined for props

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on push

### Self-hosted
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| NEXT_PUBLIC_API_URL | Yes | http://localhost:5000 | Backend API URL |

## Troubleshooting

### CORS Errors
- Check backend CORS configuration
- Verify API URL in .env.local
- Ensure backend is running

### File Upload Issues
- Check browser console for errors
- Verify file format (CSV or XLSX)
- Check file size < 10MB

### Session Lost
- Check browser sessionStorage settings
- Verify backend session configuration
- Check browser cookies

### Styling Issues
- Clear .next build folder
- Restart dev server
- Check Tailwind config

## Security Notes

- Passwords are NOT stored (session-based)
- Email credentials used only for current session
- SessionStorage used for temporary data
- CORS restricts requests to allowed origins

## Best Practices

1. Always validate user input
2. Clear sensitive data on logout
3. Use HTTPS in production
4. Keep dependencies updated
5. Test across multiple browsers
6. Monitor API response times

## License

Academic Project - Shri G.S. Institute of Technology & Science

## Support

For issues or questions, see the main README.md in the project root.
