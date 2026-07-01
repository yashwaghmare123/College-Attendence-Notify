// components/ResultUploadSection.tsx
'use client'

import { useState } from 'react'

interface ResultUploadSectionProps {
    file: File | null
    setFile: (file: File | null) => void
    onUpload: (type: string) => void
    loading: boolean
}

export default function ResultUploadSection({
    file,
    setFile,
    onUpload,
    loading,
}: ResultUploadSectionProps) {
    const [resultType, setResultType] = useState('overall')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">Upload Exam Results</h3>
                    <p className="text-sm text-gray-600">Select overall or subject-wise result file</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => setResultType('overall')}
                    className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${resultType === 'overall'
                            ? 'bg-green-600 text-white shadow-md scale-105'
                            : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Overall Result
                </button>
                <button
                    onClick={() => setResultType('subject')}
                    className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${resultType === 'subject'
                            ? 'bg-green-600 text-white shadow-md scale-105'
                            : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.168.477-4.5 1.253" />
                    </svg>
                    Subject Result
                </button>
            </div>

            <div className="mb-6">
                <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-500 transition cursor-pointer group">
                    <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-input-results"
                        disabled={loading}
                    />
                    <label htmlFor="file-input-results" className="cursor-pointer">
                        {file ? (
                            <div>
                                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8 16.5a1 1 0 01-1-1V9h-.5a1 1 0 010-2H7V5.5a1 1 0 112 0v1.5h.5a1 1 0 010 2H9v6.5a1 1 0 01-1 1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-green-600 font-semibold">{file.name}</p>
                                <p className="text-green-500 text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        ) : (
                            <div>
                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-green-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="text-gray-600 font-semibold">Drag and drop results file here or browse</p>
                                <p className="text-gray-500 text-sm mt-1">Supported formats: CSV, XLSX</p>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <button
                onClick={() => onUpload(resultType)}
                disabled={!file || loading}
                className={`w-full py-4 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${file && !loading
                        ? 'bg-green-600 hover:bg-green-700 active:scale-95 shadow-lg'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
            >
                {loading ? (
                    <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Parsing Data...</>
                ) : (
                    <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> Start Parsing</>
                )}
            </button>
        </div>
    )
}
