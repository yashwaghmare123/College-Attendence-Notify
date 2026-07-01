// components/UploadCard.tsx
'use client'

import React, { useRef } from 'react'

interface UploadCardProps {
    title: string
    description: string
    type: 'attendance' | 'exam'
    onFileSelect: (file: File) => void
}

export default function UploadCard({ title, description, type, onFileSelect }: UploadCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile) onFileSelect(droppedFile)
    }

    const iconBg = type === 'attendance' ? 'bg-blue-100' : 'bg-purple-100'
    const iconColor = type === 'attendance' ? 'text-blue-600' : 'text-purple-600'
    const icon = type === 'attendance' ? (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ) : (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    )

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center`}>
                    <span className="w-6 h-6">{icon}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Format: .XLSX</span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">{description}</p>

            <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center py-10 hover:border-blue-400 hover:bg-blue-50/10 transition-all cursor-pointer group"
            >
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-50 transition-colors mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                </div>
                <p className="text-xs font-bold text-slate-400">
                    Drag and drop file here or <span className="text-blue-600 hover:underline">browse</span>
                </p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
                    className="hidden"
                    accept=".xlsx,.xls,.csv"
                />
            </div>
        </div>
    )
}
