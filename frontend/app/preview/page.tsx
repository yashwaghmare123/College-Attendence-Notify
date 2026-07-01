'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

interface Student {
  name: string
  regNo: string
  attendance: number
  email: string
}

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

export default function PreviewPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [facultyName, setFacultyName] = useState('')
  const [facultyEmail, setFacultyEmail] = useState('')

  // Fetch preview data
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        // Check if file was uploaded
        const fileUploaded = sessionStorage.getItem('fileUploaded')
        if (!fileUploaded) {
          alert('Please upload a file first')
          router.push('/dashboard')
          return
        }

        const name = sessionStorage.getItem('facultyName')
        const email = sessionStorage.getItem('facultyEmail')
        const threshold = sessionStorage.getItem('threshold') || '75'
        const uploadSessionId = sessionStorage.getItem('uploadSessionId')
        
        setFacultyName(name || '')
        setFacultyEmail(email || '')

        const response = await axios.post(
          `${API_URL}/api/preview`,
          { 
            sessionId: uploadSessionId,
            threshold: parseInt(threshold) 
          },
          { withCredentials: true }
        )

        if (response.status === 200) {
          setStudents(response.data.students || [])
        }
      } catch (err: any) {
        console.error('Preview error:', err)
        alert(err.response?.data?.message || 'Failed to load preview')
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [router])

  // Handle send emails
  const handleSendEmails = async () => {
    if (!window.confirm(`Send emails to ${students.length} students?`)) {
      return
    }

    setSending(true)

    try {
      const emailSubject = sessionStorage.getItem('emailSubject') || ''
      const emailMessage = sessionStorage.getItem('emailMessage') || ''
      const appPassword = sessionStorage.getItem('appPassword') || ''
      const facultyEmailInput = sessionStorage.getItem('facultyEmailInput') || ''

      const response = await axios.post(
        `${API_URL}/api/send-emails`,
        {
          students,
          emailSubject,
          emailMessage,
          facultyEmail: facultyEmailInput,
          appPassword,
          facultyName,
        },
        { withCredentials: true }
      )

      if (response.status === 200) {
        // Store results and navigate to results page
        sessionStorage.setItem('emailResults', JSON.stringify(response.data.results))
        sessionStorage.setItem('totalSent', response.data.totalSent.toString())
        sessionStorage.setItem('totalFailed', response.data.totalFailed.toString())
        
        router.push('/results')
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send emails')
      console.error('Send error:', err)
    } finally {
      setSending(false)
    }
  }

  // Handle back
  const handleBack = () => {
    router.push('/dashboard')
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar facultyName={facultyName} />
        <main className="flex-1 flex flex-col ml-64">
          <Navbar facultyName={facultyName} onLogout={handleLogout} />
          <div className="flex-1 flex items-center justify-center pt-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    )
  }

  const avgAttendance = students.length > 0 
    ? (students.reduce((sum, s) => sum + s.attendance, 0) / students.length).toFixed(1)
    : 0

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
                <h1 className="text-3xl font-bold text-gray-900">
                  Email Preview
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Review students who will receive notifications
                </p>
              </div>
              <button
                onClick={handleBack}
                disabled={false}
                className="px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Back
              </button>
            </div>

            {/* SUCCESS ALERT */}
            {students.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                ✅ {students.length} students ready to receive emails
              </div>
            )}

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatsCard label="Total Recipients" value={students.length} icon={<span>👥</span>} />
              <StatsCard label="Average Attendance" value={`${avgAttendance}%`} icon={<span>📊</span>} />
              <StatsCard label="Status" value="Ready" icon={<span>✅</span>} />
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-gray-200" />

            {/* TABLE */}
            {students.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">
                <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
                <p className="text-sm text-gray-500">All students meet the attendance threshold</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student Name</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Reg No</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Attendance</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {students.map((student, index) => (
                          <tr key={index} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{student.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{student.regNo}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                student.attendance < 50
                                  ? 'bg-red-100 text-red-700'
                                  : student.attendance < 75
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                {student.attendance}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl font-medium text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendEmails}
                    disabled={students.length === 0 || sending}
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                      students.length > 0 && !sending
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                    </svg>
                    {sending ? 'Sending...' : 'Send Emails'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
