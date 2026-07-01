import type { Metadata } from 'next'
import { ReactNode } from 'react'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Faculty Attendance Email Automation',
  description: 'Automate attendance tracking and student notifications',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
