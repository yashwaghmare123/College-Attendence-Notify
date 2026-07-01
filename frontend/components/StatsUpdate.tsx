// components/StatsUpdate.tsx
'use client'

import React from 'react'

export default function StatsUpdate() {
    return (
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-sm max-w-sm ml-auto">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status Update</h4>
                <p className="text-xs font-bold text-slate-700">Next sync in 45 minutes</p>
            </div>
        </div>
    )
}
