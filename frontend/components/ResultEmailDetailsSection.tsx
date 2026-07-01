// components/ResultEmailDetailsSection.tsx
'use client'

interface ResultEmailDetailsSectionProps {
    emailSubject: string
    setEmailSubject: (value: string) => void
    emailMessage: string
    setEmailMessage: (value: string) => void
    selectedFields: string[]
}

export default function ResultEmailDetailsSection({
    emailSubject,
    setEmailSubject,
    emailMessage,
    setEmailMessage,
    selectedFields
}: ResultEmailDetailsSectionProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Email Details</h3>
                    <p className="text-sm text-gray-600">Customize results notification</p>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Subject</label>
                <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="e.g., Semester Results Notification"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Message</label>
                <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition font-mono text-sm leading-relaxed"
                    placeholder="Write your email template here..."
                />
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">Placeholders Reference:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    {selectedFields.map(field => (
                        <div key={field} className="flex items-center gap-2">
                            <code className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-[10px] font-mono">
                                {`{${field}}`}
                            </code>
                            <span className="text-[10px] text-gray-600 truncate">Value from '{field}'</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 border-t border-purple-200 pt-2 mt-2 md:col-span-2">
                        <code className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-[10px] font-mono">
                            {`{FacultyName}`}
                        </code>
                        <span className="text-[10px] text-gray-600">Your department/name</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
