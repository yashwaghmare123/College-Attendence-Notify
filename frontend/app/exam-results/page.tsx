// app/exam-results/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import ResultUploadSection from '@/components/ResultUploadSection'
import FieldMappingSection from '@/components/FieldMappingSection'
import ResultEmailDetailsSection from '@/components/ResultEmailDetailsSection'
import CredentialsSection from '@/components/CredentialsSection'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function ExamResultsPage() {
    const router = useRouter()
    const [facultyName, setFacultyName] = useState('')
    const [facultyEmail, setFacultyEmail] = useState('')

    // App state
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [headers, setHeaders] = useState<string[]>([])
    const [uploaded, setUploaded] = useState(false)
    const [resultSessionId, setResultSessionId] = useState('')

    // Mapping state
    const [selectedFields, setSelectedFields] = useState<string[]>([])
    const [emailField, setEmailField] = useState('')

    // Email state
    const [emailSubject, setEmailSubject] = useState('Exam Result Notification')
    const [emailMessage, setEmailMessage] = useState(
        'Dear student,\n\nYour results for the current semester have been processed.\n\nHere are your details:\n'
    )
    const [appPassword, setAppPassword] = useState('')
    const [facultyEmailInput, setFacultyEmailInput] = useState('')

    useEffect(() => {
        const email = sessionStorage.getItem('facultyEmail')
        const name = sessionStorage.getItem('facultyName')
        if (!email || !name) {
            router.push('/')
            return
        }
        setFacultyEmail(email)
        setFacultyName(name)
        setFacultyEmailInput(email)

        // Restore uploaded state from sessionStorage
        const wasUploaded = sessionStorage.getItem('resultFileUploaded')
        if (wasUploaded) {
            setUploaded(true)
        }
        
        // Restore sessionId if available
        const storedResultSessionId = sessionStorage.getItem('resultSessionId')
        if (storedResultSessionId) {
            setResultSessionId(storedResultSessionId)
        }
    }, [router])

    const handleUpload = async (resultType: string) => {
        if (!file) return alert('Please select a file')

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('resultType', resultType)

        try {
            const resp = await axios.post(`${API_URL}/api/results/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            })

            setHeaders(resp.data.headers)
            setUploaded(true)
            sessionStorage.setItem('resultFileUploaded', 'true')
            
            // Store the sessionId if provided
            if (resp.data.sessionId) {
                setResultSessionId(resp.data.sessionId)
                sessionStorage.setItem('resultSessionId', resp.data.sessionId)
            }

            // Auto-suggest message template based on fields
            const suggestedMessage = `Dear student,\n\nYour ${resultType} results have been processed.\n\n` +
                resp.data.headers.slice(0, 5).map((h: string) => `${h}: {${h}}`).join('\n') +
                `\n\nRegards,\n{FacultyName}`
            setEmailMessage(suggestedMessage)
            setSelectedFields(resp.data.headers.slice(0, 5))

            alert('File parsed successfully! Please map the fields.')
        } catch (err: any) {
            alert(err.response?.data?.message || 'Upload failed')
        } finally {
            setLoading(false)
        }
    }

    const handlePreview = () => {
        if (!emailField) return alert('Please select the email column')
        if (selectedFields.length === 0) return alert('Please select at least one field')

        sessionStorage.setItem('selectedFields', JSON.stringify(selectedFields))
        sessionStorage.setItem('emailField', emailField)
        sessionStorage.setItem('emailSubject', emailSubject)
        sessionStorage.setItem('emailMessage', emailMessage)
        sessionStorage.setItem('appPassword', appPassword)
        sessionStorage.setItem('facultyEmailInput', facultyEmailInput)

        router.push('/exam-results/preview')
    }

    const handleLogout = () => {
        sessionStorage.clear()
        router.push('/')
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar facultyName={facultyName} />
            <main className="flex-1 flex flex-col ml-64">
                <Navbar facultyName={facultyName} onLogout={handleLogout} />
                
                <div className="flex-1 overflow-auto pt-16">
                    <div className="px-6 py-6 space-y-6">
                        {/* HEADER */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
                                <p className="text-sm text-gray-500 mt-1">Upload and broadcast results to students</p>
                            </div>
                            <button
                                onClick={handlePreview}
                                disabled={!uploaded}
                                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                                    uploaded
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Preview & Send
                            </button>
                        </div>

                        {/* UPLOAD CARD */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                <h2 className="text-base font-semibold text-gray-900 mb-0">Upload Results File</h2>
                            </div>
                            <ResultUploadSection file={file} setFile={setFile} onUpload={handleUpload} loading={loading} />
                        </div>

                        {/* CONFIGURATION SECTION */}
                        {uploaded && (
                            <>
                                {/* DIVIDER */}
                                <div className="h-px bg-gray-200" />

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* LEFT */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Field Mapping */}
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-2 mb-4">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <h2 className="text-base font-semibold text-gray-900 mb-0">Field Mapping</h2>
                                            </div>
                                            <FieldMappingSection
                                                headers={headers}
                                                selectedFields={selectedFields}
                                                setSelectedFields={setSelectedFields}
                                                emailField={emailField}
                                                setEmailField={setEmailField}
                                            />
                                        </div>

                                        {/* Credentials */}
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-2 mb-4">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <h2 className="text-base font-semibold text-gray-900 mb-0">Credentials</h2>
                                            </div>
                                            <CredentialsSection
                                                facultyEmail={facultyEmailInput}
                                                setFacultyEmail={setFacultyEmailInput}
                                                appPassword={appPassword}
                                                setAppPassword={setAppPassword}
                                            />
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div>
                                        {/* Email Details */}
                                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-2 mb-4">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <h2 className="text-base font-semibold text-gray-900 mb-0">Email</h2>
                                            </div>
                                            <ResultEmailDetailsSection
                                                emailSubject={emailSubject}
                                                setEmailSubject={setEmailSubject}
                                                emailMessage={emailMessage}
                                                setEmailMessage={setEmailMessage}
                                                selectedFields={selectedFields}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
