// components/RecentUploadsTable.tsx
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function RecentUploadsTable() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/history`, { withCredentials: true })
                if (response.data.success) {
                    setHistory(response.data.history)
                }
            } catch (error) {
                console.error('Error fetching history:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mt-8 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Recent Notifications Status</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Track dispatch status of sent notifications</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="text-slate-800 text-xs font-bold flex items-center gap-1 hover:underline"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-50">
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sent/Total</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-bold italic">Loading history...</td>
                            </tr>
                        ) : history.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-bold italic">No history available yet.</td>
                            </tr>
                        ) : history.map((log, idx) => {
                            const date = new Date(log.timestamp)
                            const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

                            return (
                                <tr key={log.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 font-bold">
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-bold text-slate-700">#{log.id}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider border ${log.email_type === 'ATTENDANCE'
                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                            : 'bg-purple-50 text-purple-600 border-purple-100'
                                            }`}>
                                            {log.email_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-bold text-slate-700">{dateStr} • </p>
                                        <p className="text-[10px] text-slate-400 font-bold">{timeStr}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.emails_failed === 0 ? 'bg-green-600' : 'bg-orange-500'}`} />
                                            <span className={`text-[11px] font-bold ${log.emails_failed === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                                {log.emails_failed === 0 ? 'Sent Successfully' : `Partial (${log.emails_sent} sent)`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-sm font-extrabold text-slate-800">{log.emails_sent} / {log.total_students}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
