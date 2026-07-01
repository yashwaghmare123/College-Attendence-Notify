// components/DashboardHeader.tsx
'use client'

import React from 'react'

export default function DashboardHeader({ title }: { title: string }) {
    return (
        <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-slate-800 transition-all shadow-md group">
                <svg
                    className="w-5 h-5 group-hover:animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                Trigger Notifications
            </button>
        </header>
    )
}
