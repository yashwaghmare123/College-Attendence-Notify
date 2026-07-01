// components/BroadcastCallout.tsx
'use client'

import React from 'react'

export default function BroadcastCallout({ onTrigger }: { onTrigger: () => void }) {
    return (
        <div className="bg-slate-800 rounded-3xl p-10 text-white mt-12 relative overflow-hidden shadow-2xl flex items-center min-h-[220px]">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-700/30 -skew-x-12 translate-x-32" />

            <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Ready to broadcast results?</h2>
                <p className="text-slate-400 font-medium mb-8 text-lg leading-relaxed">
                    All data for the current semester has been parsed and verified. You can now notify
                    students via SMS and Email regarding their attendance and internal marks.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onTrigger}
                        className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold flex items-center gap-3 hover:bg-slate-100 transition-all shadow-lg active:scale-95 text-base"
                    >
                        <svg className="w-5 h-5 transform rotate-12" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                        Trigger Notifications
                    </button>

                    <button className="bg-slate-700/50 text-white border border-slate-600 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-700 transition-all text-base">
                        Preview Student View
                    </button>
                </div>
            </div>
        </div>
    )
}
