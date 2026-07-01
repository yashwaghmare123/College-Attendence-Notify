// components/Navbar.tsx
'use client'

import { useState } from 'react'

interface NavbarProps {
  facultyName: string
  onLogout: () => void
}

export default function Navbar({ facultyName, onLogout }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <nav className="fixed top-0 left-64 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="flex items-center justify-between h-14 px-6">
        
        {/* LEFT - Search Bar */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
            />
            <svg
              className="absolute right-2.5 top-1.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* RIGHT - Notifications & User */}
        <div className="flex items-center gap-3 ml-6">
          
          {/* Notification Icon */}
          <button className="relative p-1.5 text-gray-600 hover:bg-gray-100 rounded transition">
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.5 1.5H9.5A4 4 0 005.5 5.5v3a6 6 0 00-3 5.196V17a2 2 0 002 2h12a2 2 0 002-2v-3.304a6 6 0 00-3-5.196v-3a4 4 0 00-4-4z" />
            </svg>
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-300" />

          {/* User Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded transition"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                {facultyName?.charAt(0) || 'F'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-gray-900">{facultyName}</p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
                <div className="px-3 py-2 border-b border-gray-200 text-xs">
                  <p className="font-medium text-gray-900">{facultyName}</p>
                  <p className="text-gray-500">Faculty</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    onLogout()
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
