// app/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [facultyName, setFacultyName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const email = sessionStorage.getItem('facultyEmail')
        const name = sessionStorage.getItem('facultyName')

        if (!email || !name) {
            router.push('/')
            return
        }

        setFacultyName(name)
        setLoading(false)
    }, [router])

    if (loading) {
        return (
            <div className="h-screen bg-slate-950 flex items-center justify-center font-bold">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-white text-lg tracking-widest uppercase">Initializing Portal...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <Sidebar facultyName={facultyName} />
            <main className="ml-64 flex-1 min-h-screen">
                {children}
            </main>
        </div>
    )
}
