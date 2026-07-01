// app/exam-results/results/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

interface EmailResult {
  email: string
  status: 'success' | 'failed'
  message: string
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

export default function ExamResultsSummaryPage() {
    const router = useRouter()
    const [results, setResults] = useState<EmailResult[]>([])
    const [totalSent, setTotalSent] = useState(0)
    const [totalFailed, setTotalFailed] = useState(0)
    const [facultyName, setFacultyName] = useState('')

    useEffect(() => {
        setFacultyName(sessionStorage.getItem('facultyName') || '')
        setResults(JSON.parse(sessionStorage.getItem('emailResults') || '[]'))
        setTotalSent(parseInt(sessionStorage.getItem('totalSent') || '0'))
        setTotalFailed(parseInt(sessionStorage.getItem('totalFailed') || '0'))
    }, [])

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
                                <h1 className="text-3xl font-bold text-gray-900">Results Sent</h1>
                                <p className="text-sm text-gray-500 mt-1">Campaign delivery summary and status</p>
                            </div>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="px-5 py-2.5 rounded-xl font-medium text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                            >
                                Done
                            </button>
                        </div>

                        {/* SUCCESS ALERT */}
                        {totalSent > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                                ✅ {totalSent} out of {results.length} results were sent successfully
                            </div>
                        )}

                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard label="Total Processed" value={results.length} icon={<span>📊</span>} />
                            <StatsCard label="Successfully Sent" value={totalSent} icon={<span>✅</span>} />
                            <StatsCard label="Failed" value={totalFailed} icon={<span>❌</span>} />
                            <StatsCard label="Success Rate" value={`${results.length > 0 ? Math.round((totalSent / results.length) * 100) : 0}%`} icon={<span>📈</span>} />
                        </div>

                        {/* DIVIDER */}
                        <div className="h-px bg-gray-200" />

                        {/* TABLE */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Recipient</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {results.map((r, i) => (
                                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{r.email}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {r.status === 'success' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            Sent
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            Failed
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{r.message}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ACTION BUTTON */}
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
