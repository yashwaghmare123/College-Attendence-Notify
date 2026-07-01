'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function ProfilePage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [facultyName, setFacultyName] = useState('')
  const [facultyEmail, setFacultyEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [department, setDepartment] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Mount check to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')

    if (!email || !name) {
      router.push('/')
      return
    }

    setFacultyEmail(email)
    setFacultyName(name)
    setNewName(name)
    setNewEmail(email)
    
    // Fetch existing profile data
    fetchProfile(email)
  }, [router])

  const fetchProfile = async (email: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/profile/get`, {
        params: { email },
        withCredentials: true
      })
      
      if (response.status === 200) {
        const { name, email: respEmail, phoneNumber, department, profilePhoto } = response.data
        setNewName(name)
        setNewEmail(respEmail)
        setPhoneNumber(phoneNumber || '')
        setDepartment(department || '')
        
        // If profile photo exists, set preview
        if (profilePhoto) {
          setPhotoPreview(`${API_URL}/uploads/${profilePhoto}`)
        }
      }
    } catch (err) {
      console.log('Could not fetch profile (this is okay on first visit)', err)
    }
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', facultyEmail)
      formData.append('newName', newName)
      formData.append('newEmail', newEmail)
      formData.append('phoneNumber', phoneNumber)
      formData.append('department', department)
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto)
      }

      const response = await axios.post(
        `${API_URL}/api/profile/update`,
        formData,
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      if (response.status === 200) {
        sessionStorage.setItem('facultyName', newName)
        sessionStorage.setItem('facultyEmail', newEmail)
        setFacultyName(newName)
        setFacultyEmail(newEmail)
        setSuccess('Profile updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile')
      console.error('Profile update error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  // Don't render until client is mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white border-r border-gray-200" />
        <main className="flex-1 flex flex-col">
          <div className="h-16 bg-white border-b border-gray-200" />
          <div className="flex-1 px-6 py-6">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
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
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your account information and preferences</p>
            </div>

            {/* SUCCESS/ERROR ALERTS */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                ✅ {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                ❌ {error}
              </div>
            )}

            {/* DIVIDER */}
            <div className="h-px bg-gray-200" />

            {/* MAIN FORM */}
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT: PHOTO UPLOAD */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Profile Photo</h2>
                    
                    {/* PHOTO PREVIEW */}
                    <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden bg-gray-50">
                      {photoPreview || facultyName ? (
                        <img 
                          src={photoPreview || `https://ui-avatars.com/api/?name=${facultyName}&size=200&background=0D8ABC&color=fff`} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="text-xs text-gray-500">No photo</p>
                        </div>
                      )}
                    </div>

                    {/* FILE INPUT */}
                    <label className="w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                      <span className="block w-full px-4 py-2.5 rounded-xl font-medium text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all cursor-pointer text-center">
                        Choose Photo
                      </span>
                    </label>

                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: FORM FIELDS */}
              <div className="lg:col-span-2 space-y-6">
                {/* NAME FIELD */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Full Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  />
                </div>

                {/* EMAIL FIELD */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Email Address</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  />
                </div>

                {/* PHONE FIELD */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  />
                </div>

                {/* DEPARTMENT FIELD */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Enter your department"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none transition-all text-sm"
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => router.back()}
                    type="button"
                    className="px-5 py-2.5 rounded-xl font-medium text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${
                      !loading
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
