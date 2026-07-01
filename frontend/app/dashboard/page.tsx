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

// 🔥 PREMIUM STATS CARD
function StatsCard({ icon, label, value }: any) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()

  const [facultyName, setFacultyName] = useState('')
  const [facultyEmail, setFacultyEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [threshold, setThreshold] = useState(75)
  const [emailSubject, setEmailSubject] = useState('Attendance Shortage Notification')
  const [emailMessage, setEmailMessage] = useState(
    'Dear {StudentName},\n\nYour attendance is {Attendance}%...\n\nRegards,\n{FacultyName}'
  )
  const [appPassword, setAppPassword] = useState('')
  const [facultyEmailInput, setFacultyEmailInput] = useState('')
  const [uploadedEmail, setUploadedEmail] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    const uploadedFile = sessionStorage.getItem('fileUploaded')
    const storedSessionId = sessionStorage.getItem('uploadSessionId')

    if (!email || !name) {
      router.push('/')
      return
    }

    setFacultyEmail(email)
    setFacultyName(name)
    setFacultyEmailInput(email)

    if (uploadedFile === 'true') setUploadedEmail(true)
    if (storedSessionId) setSessionId(storedSessionId)
  }, [router])

  const handleFileUpload = async () => {
    if (!file) return alert('Select file')

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('threshold', threshold.toString())

    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData)

      if (res.status === 200) {
        setUploadedEmail(true)
        sessionStorage.setItem('fileUploaded', 'true')

        if (res.data.sessionId) {
          setSessionId(res.data.sessionId)
          sessionStorage.setItem('uploadSessionId', res.data.sessionId)
        }
      }
    } catch {
      alert('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewRecipients = () => {
    if (!uploadedEmail) return alert('Upload first')

    sessionStorage.setItem('threshold', threshold.toString())
    sessionStorage.setItem('emailSubject', emailSubject)
    sessionStorage.setItem('emailMessage', emailMessage)
    sessionStorage.setItem('facultyEmailInput', facultyEmailInput)
    sessionStorage.setItem('appPassword', appPassword)
    sessionStorage.setItem('uploadSessionId', sessionId)

    router.push('/preview')
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* SIDEBAR */}
      <Sidebar facultyName={facultyName} />

      {/* MAIN */}
      <main className="flex-1 flex flex-col ml-">
        
        {/* TOPBAR */}
        <Navbar facultyName={facultyName} onLogout={handleLogout} />

        {/* CONTENT */}
        <div className="flex-1 overflow-auto pt-16">
          <div className="px-6 py-6 space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Attendance Dashboard
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Upload, configure, and notify students efficiently
                </p>
              </div>

              <button
                onClick={handlePreviewRecipients}
                disabled={!uploadedEmail || loading}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
                  uploadedEmail && !loading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Preview
              </button>
            </div>

            {/* SUCCESS */}
            {uploadedEmail && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                ✅ File uploaded successfully. Ready to proceed.
              </div>
            )}

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard label="Total Students" value="0" icon={<span>👨‍🎓</span>} />
              <StatsCard label="Defaulters" value="0" icon={<span>⚠️</span>} />
              <StatsCard label="Emails Sent" value="0" icon={<span>📧</span>} />
              <StatsCard label="Avg Attendance" value="0%" icon={<span>📊</span>} />
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200" />

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Upload File
                  </h2>
                  <UploadSection
                    file={file}
                    setFile={setFile}
                    onUpload={handleFileUpload}
                    loading={loading}
                  />
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Threshold
                  </h2>
                  <ThresholdSection
                    threshold={threshold}
                    setThreshold={setThreshold}
                  />
                </div>

              </div>

              {/* RIGHT */}
              <div className="space-y-6">

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Email Configuration
                  </h2>
                  <EmailDetailsSection
                    emailSubject={emailSubject}
                    setEmailSubject={setEmailSubject}
                    emailMessage={emailMessage}
                    setEmailMessage={setEmailMessage}
                  />
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">
                    Credentials
                  </h2>
                  <CredentialsSection
                    facultyEmail={facultyEmailInput}
                    setFacultyEmail={setFacultyEmailInput}
                    appPassword={appPassword}
                    setAppPassword={setAppPassword}
                  />
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}