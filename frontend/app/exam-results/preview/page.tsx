// app/exam-results/preview/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
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

export default function ResultPreviewPage() {
    const router = useRouter()
    const [students, setStudents] = useState<any[]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [facultyName, setFacultyName] = useState('')

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                // Check if file was uploaded
                const fileUploaded = sessionStorage.getItem('resultFileUploaded')
                if (!fileUploaded) {
                    alert('Please upload a file first')
                    router.push('/exam-results')
                    return
                }

                const name = sessionStorage.getItem('facultyName') || ''
                setFacultyName(name)

                const selectedFields = JSON.parse(sessionStorage.getItem('selectedFields') || '[]')
                const emailField = sessionStorage.getItem('emailField') || ''
                const resultSessionId = sessionStorage.getItem('resultSessionId') || ''

                setHeaders(selectedFields)

                const response = await axios.post(
                    `${API_URL}/api/results/preview`,
                    { 
                        sessionId: resultSessionId,
                        selectedFields, 
                        emailField 
                    },
                    { withCredentials: true }
                )

                setStudents(response.data.students || [])
            } catch (err: any) {
                alert('Failed to load preview data')
                router.push('/exam-results')
            } finally {
                setLoading(false)
            }
        }
        fetchPreview()
    }, [router])

    const handleSend = async () => {
        if (!window.confirm(`Send results to ${students.length} students?`)) return

        setSending(true)
        try {
            const emailSubject = sessionStorage.getItem('emailSubject') || ''
            const emailMessage = sessionStorage.getItem('emailMessage') || ''
            const appPassword = sessionStorage.getItem('appPassword') || ''
            const facultyEmailInput = sessionStorage.getItem('facultyEmailInput') || ''

            const response = await axios.post(
                `${API_URL}/api/results/send-emails`,
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

            sessionStorage.setItem('emailResults', JSON.stringify(response.data.results))
            sessionStorage.setItem('totalSent', response.data.totalSent.toString())
            sessionStorage.setItem('totalFailed', response.data.totalFailed.toString())

            router.push('/exam-results/results')
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to send emails')
        } finally {
            setSending(false)
        }
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
                                    Results Preview
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Review students who will receive results
                                </p>
                            </div>
                            <button
                                onClick={() => router.back()}
                                className="px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all bg-gray-200 hover:bg-gray-300 text-gray-700"
                            >
                                Back
                            </button>
                        </div>

                        {/* SUCCESS ALERT */}
                        {students.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                                ✅ {students.length} students ready to receive results
                            </div>
                        )}

                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <StatsCard label="Total Recipients" value={students.length} icon={<span>👥</span>} />
                            <StatsCard label="Fields" value={headers.length} icon={<span>📄</span>} />
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
                                <p className="text-sm text-gray-500">No students to receive results</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                                                    {headers.map(h => (
                                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {students.map((s, i) => (
                                                    <tr key={i} className="hover:bg-blue-50 transition-colors">
                                                        <td className="px-6 py-4 text-sm text-blue-600 font-medium">{s.email}</td>
                                                        {headers.map(h => (
                                                            <td key={h} className="px-6 py-4 text-sm text-gray-600">
                                                                {s[h]}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => router.back()}
                                        className="px-5 py-2.5 rounded-xl font-medium text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={sending}
                                        className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                                            !sending
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                                        </svg>
                                        {sending ? 'Sending...' : 'Confirm & Send'}
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
