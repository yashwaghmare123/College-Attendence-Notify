// app/attendance/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import UploadSection from '@/components/UploadSection'
import ThresholdSection from '@/components/ThresholdSection'
import EmailDetailsSection from '@/components/EmailDetailsSection'
import CredentialsSection from '@/components/CredentialsSection'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function AttendancePage() {
    const router = useRouter()
    const [facultyName, setFacultyName] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [threshold, setThreshold] = useState(75)
    const [emailSubject, setEmailSubject] = useState('Attendance Shortage Notification')
    const [emailMessage, setEmailMessage] = useState(
        'Dear {StudentName},\n\nYour attendance is {Attendance}%, which is below the required minimum.\n\nPlease improve your attendance to avoid academic penalties.\n\nRegards,\n{FacultyName}'
    )
    const [appPassword, setAppPassword] = useState('')
    const [facultyEmailInput, setFacultyEmailInput] = useState('')
    const [uploadedEmail, setUploadedEmail] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const email = sessionStorage.getItem('facultyEmail')
        const name = sessionStorage.getItem('facultyName')
        if (!email) {
            router.push('/')
            return
        }
        setFacultyName(name || '')
        setFacultyEmailInput(email)
    }, [router])

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file')
            return
        }

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('threshold', threshold.toString())

        try {
            const response = await axios.post(`${API_URL}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            })

            if (response.status === 200) {
                setUploadedEmail(true)
                alert('File uploaded successfully!')
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'File upload failed')
        } finally {
            setLoading(false)
        }
    }

    const handlePreviewRecipients = () => {
        if (!uploadedEmail) {
            alert('Please upload a file first')
            return
        }
        sessionStorage.setItem('threshold', threshold.toString())
        sessionStorage.setItem('emailSubject', emailSubject)
        sessionStorage.setItem('emailMessage', emailMessage)
        sessionStorage.setItem('facultyEmailInput', facultyEmailInput)
        sessionStorage.setItem('appPassword', appPassword)
        router.push('/preview')
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
                                <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                                <p className="text-sm text-gray-500 mt-1">Upload and configure attendance notifications</p>
                            </div>
                            <button
                                onClick={handlePreviewRecipients}
                                disabled={!uploadedEmail || loading}
                                className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                                    uploadedEmail && !loading
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

                        {/* SUCCESS ALERT */}
                        {uploadedEmail && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                                ✅ File uploaded successfully. Ready to proceed.
                            </div>
                        )}

                        {/* DIVIDER */}
                        <div className="h-px bg-gray-200" />

                        {/* GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* LEFT */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                        </svg>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">Upload File</h2>
                                    </div>
                                    <UploadSection file={file} setFile={setFile} onUpload={handleFileUpload} loading={loading} />
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">Threshold</h2>
                                    </div>
                                    <ThresholdSection threshold={threshold} setThreshold={setThreshold} />
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">Email</h2>
                                    </div>
                                    <EmailDetailsSection emailSubject={emailSubject} setEmailSubject={setEmailSubject} emailMessage={emailMessage} setEmailMessage={setEmailMessage} />
                                </div>

                                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        <h2 className="text-base font-semibold text-gray-900 mb-4">Credentials</h2>
                                    </div>
                                    <CredentialsSection facultyEmail={facultyEmailInput} setFacultyEmail={setFacultyEmailInput} appPassword={appPassword} setAppPassword={setAppPassword} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
