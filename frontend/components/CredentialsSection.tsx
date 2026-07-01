// components/CredentialsSection.tsx
'use client'

interface CredentialsSectionProps {
  facultyEmail: string
  setFacultyEmail: (value: string) => void
  appPassword: string
  setAppPassword: (value: string) => void
}

export default function CredentialsSection({
  facultyEmail,
  setFacultyEmail,
  appPassword,
  setAppPassword,
}: CredentialsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Faculty Email Credentials</h3>
          <p className="text-sm text-gray-600">Required to send emails from your account</p>
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Faculty Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Faculty Email Address
          </label>
          <input
            type="email"
            value={facultyEmail}
            onChange={(e) => setFacultyEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            placeholder="faculty@sggs.ac.in"
          />
        </div>

        {/* App Password */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            App Password-awtf dync myfo fmnb
          </label>
          <input
            type="password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            placeholder="Enter your app-specific password"
          />
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-red-800 mb-1">Security Notice</p>
          <p className="text-xs text-red-700">
            Your password is used only for sending emails and is NOT stored in our system. Each session requires re-entry for security.
          </p>
        </div>
      </div>

      {/* How to Get App Password */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-gray-700 font-semibold mb-2">
          How to generate App Password for Gmail:
        </p>
        <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
          <li>Enable 2-Step Verification in your Google Account</li>
          <li>Go to Google Account &rarr; Security &rarr; App Passwords</li>
          <li>Select "Mail" and "Windows Computer"</li>
          <li>Copy the generated 16-character password and paste it here</li>
        </ol>
      </div>
    </div>
  )
}
