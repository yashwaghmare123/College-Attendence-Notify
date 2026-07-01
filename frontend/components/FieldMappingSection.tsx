// components/FieldMappingSection.tsx
'use client'

interface FieldMappingSectionProps {
    headers: string[]
    selectedFields: string[]
    setSelectedFields: (fields: string[]) => void
    emailField: string
    setEmailField: (field: string) => void
}

export default function FieldMappingSection({
    headers,
    selectedFields,
    setSelectedFields,
    emailField,
    setEmailField,
}: FieldMappingSectionProps) {
    const toggleField = (header: string) => {
        if (selectedFields.includes(header)) {
            setSelectedFields(selectedFields.filter(f => f !== header))
        } else {
            setSelectedFields([...selectedFields, header])
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Field Mapping</h3>
                    <p className="text-sm text-gray-600">Select columns to include in the email</p>
                </div>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    1. Select student email column (Required)
                </label>
                <select
                    value={emailField}
                    onChange={(e) => setEmailField(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-medium"
                >
                    <option value="">-- Choose Email Column --</option>
                    {headers.map(h => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                    2. Choose fields for placeholder data
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {headers.map(header => (
                        <div
                            key={header}
                            onClick={() => toggleField(header)}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedFields.includes(header)
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                    : 'border-gray-200 hover:border-indigo-300'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${selectedFields.includes(header) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                                }`}>
                                {selectedFields.includes(header) && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm font-medium truncate">{header}</span>
                        </div>
                    ))}
                </div>
            </div>

            {selectedFields.length > 0 && (
                <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <p className="text-xs font-semibold text-indigo-800 mb-2">Generated Placeholders:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedFields.map(field => (
                            <code key={field} className="bg-white border border-indigo-200 text-indigo-700 px-2 py-1 rounded text-[10px] font-mono shadow-sm">
                                {`{${field}}`}
                            </code>
                        ))}
                        <code className="bg-white border border-indigo-200 text-indigo-700 px-2 py-1 rounded text-[10px] font-mono shadow-sm">
                            {`{FacultyName}`}
                        </code>
                    </div>
                </div>
            )}
        </div>
    )
}
