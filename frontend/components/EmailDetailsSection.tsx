// components/EmailDetailsSection.tsx
'use client'

interface EmailDetailsSectionProps {
  emailSubject: string
  setEmailSubject: (value: string) => void
  emailMessage: string
  setEmailMessage: (value: string) => void
}

export default function EmailDetailsSection({
  emailSubject,
  setEmailSubject,
  emailMessage,
  setEmailMessage,
}: EmailDetailsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Email Details</h3>
          <p className="text-sm text-gray-600">Customize notification message</p>
        </div>
      </div>

      {/* Email Subject */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Subject
        </label>
        <input
          type="text"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Enter email subject"
        />
      </div>

      {/* Email Message */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email Message
        </label>
        <textarea
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition font-mono text-sm"
          placeholder="Enter email message"
        />
      </div>

      {/* Placeholders Help Text */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">Available Placeholders:</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-mono">
              {'{StudentName}'}
            </code>
            <span className="text-xs text-gray-600">- Replace with student's full name</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-mono">
              {'{Attendance}'}
            </code>
            <span className="text-xs text-gray-600">- Replace with attendance percentage</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-mono">
              {'{FacultyName}'}
            </code>
            <span className="text-xs text-gray-600">- Replace with faculty member's name</span>
          </div>
        </div>
      </div>
    </div>
  )
}
