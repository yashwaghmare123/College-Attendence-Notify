'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function TimetableManagementPage() {
  const router = useRouter()
  const [facultyName, setFacultyName] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [timetables, setTimetables] = useState([])
  const [years, setYears] = useState([])
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedDivision, setSelectedDivision] = useState('')
  const [generatingTimetable, setGeneratingTimetable] = useState(false)
  const [notification, setNotification] = useState({ type: '', message: '' })

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    if (!email) {
      router.push('/')
      return
    }
    setFacultyName(name || '')
    fetchYears()
    fetchTimetables()
  }, [router])

  const fetchYears = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/year`)
      setYears(response.data.years || [])
    } catch (error) {
      console.error('Error fetching years:', error)
    }
  }

  const fetchDivisions = async (yearId) => {
    try {
      const response = await axios.get(`${API_URL}/api/division?yearId=${yearId}`)
      setDivisions(response.data.divisions || [])
      setSelectedDivision('')
    } catch (error) {
      console.error('Error fetching divisions:', error)
      setDivisions([])
    }
  }

  const fetchTimetables = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/timetable`)
      setTimetables(response.data.timetables || [])
    } catch (error) {
      console.error('Error fetching timetables:', error)
      showNotification('error', 'Failed to fetch timetables')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({ type: '', message: '' }), 3000)
  }

  const handleAutoCreateClassrooms = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/classroom/auto-generate`, {
        yearId: selectedYear
      })
      showNotification('success', `${response.data.count} sample classrooms created! Now try generating the timetable again.`)
    } catch (error) {
      console.error('Error auto-generating classrooms:', error)
      const errorMessage = error.response?.data?.message || 'Failed to create classrooms'
      showNotification('error', errorMessage)
      router.push('/timetable/classrooms')
    }
  }

  const handleGenerateTimetable = async () => {
    if (!selectedYear) {
      showNotification('error', 'Please select a year')
      return
    }

    try {
      setGeneratingTimetable(true)
      const response = await axios.post(`${API_URL}/api/timetable/generate`, {
        yearId: selectedYear,
        divisionId: selectedDivision,
        semester: 1,
        name: `Generated Timetable`
      })

      showNotification('success', 'Timetable generated successfully!')
      fetchTimetables()
      setSelectedYear('')
      setSelectedDivision('')
    } catch (error) {
      console.error('Error generating timetable:', error)
      const errorData = error.response?.data
      const errorMessage = errorData?.message || error.message || 'Failed to generate timetable'
      
      // If classrooms are missing, offer to auto-generate them
      if (errorData?.suggestAutoCreate) {
        const autoCreateConfirm = confirm(
          `${errorMessage}\n\nWould you like to auto-generate sample classrooms for this year?`
        )
        if (autoCreateConfirm) {
          await handleAutoCreateClassrooms()
        }
      } else {
        showNotification('error', errorMessage)
      }
    } finally {
      setGeneratingTimetable(false)
    }
  }

  const handleViewTimetable = (id) => {
    router.push(`/timetable/${id}`)
  }

  const handleDeleteTimetable = async (id) => {
    if (!confirm('Are you sure you want to delete this timetable?')) return

    try {
      await axios.delete(`${API_URL}/api/timetable/${id}`)
      showNotification('success', 'Timetable deleted successfully')
      fetchTimetables()
    } catch (error) {
      console.error('Error deleting timetable:', error)
      showNotification('error', 'Failed to delete timetable')
    }
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Timetable Management</h1>
                <p className="text-sm text-gray-500 mt-1">Generate and manage academic timetables</p>
              </div>
            </div>

            {/* Notification */}
            {notification.message && (
              <div
                className={`p-4 rounded-lg ${
                  notification.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <p className="font-medium">{notification.message}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === 'generate'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Generate New
              </button>
              <button
                onClick={() => router.push('/timetable/years')}
                className="px-4 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Years
              </button>
              <button
                onClick={() => router.push('/timetable/teachers')}
                className="px-4 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Teachers
              </button>
              <button
                onClick={() => router.push('/timetable/subjects')}
                className="px-4 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Subjects
              </button>
              <button
                onClick={() => router.push('/timetable/labs')}
                className="px-4 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Labs
              </button>
              <button
                onClick={() => router.push('/timetable/classrooms')}
                className="px-4 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Classrooms
              </button>
              <button
                onClick={() => router.push('/timetable/divisions')}
                className="px-4 py-3 font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Divisions
              </button>
            </div>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Timetables</h2>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-gray-500">Loading timetables...</div>
                    </div>
                  ) : timetables.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-center">
                      <div>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500">No timetables generated yet. Create one to get started.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {timetables.map((timetable) => (
                        <div
                          key={timetable._id}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{timetable.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">Year: {timetable.year?.displayName}</p>
                            </div>
                            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-semibold">
                              {timetable.entries?.length || 0}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">Entries: {timetable.entries?.length || 0}</p>
                          <div className="flex gap-2 pt-4 border-t border-blue-200">
                            <button
                              onClick={() => handleViewTimetable(timetable._id)}
                              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDeleteTimetable(timetable._id)}
                              className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors text-sm border border-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Generate New Timetable</h2>
                <div className="max-w-2xl space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Select Academic Year <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value)
                        if (e.target.value) {
                          fetchDivisions(e.target.value)
                        } else {
                          setDivisions([])
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">-- Select a year --</option>
                      {years.map((year) => (
                        <option key={year._id} value={year._id}>
                          {year.displayName}
                        </option>
                      ))}
                    </select>
                    {!selectedYear && (
                      <p className="text-sm text-gray-500 mt-2">
                        Create academic years first in the Years tab
                      </p>
                    )}
                  </div>

                  {selectedYear && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Select Division <span className="text-red-600">*</span>
                      </label>
                      {divisions.length === 0 ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            No divisions found for this year. They will be auto-generated during timetable creation.
                          </p>
                        </div>
                      ) : (
                        <select
                          value={selectedDivision}
                          onChange={(e) => setSelectedDivision(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        >
                          <option value="">-- Select a division --</option>
                          {divisions.map((division) => (
                            <option key={division._id} value={division._id}>
                              Division {division.name} (Capacity: {division.capacity})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Before generating a timetable, ensure you have:
                    </p>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
                      <li>✓ Created academic years</li>
                      <li>✓ Created divisions (A, B) or they'll be auto-generated</li>
                      <li>✓ Created classrooms for the year (automatic option available if missing)</li>
                      <li>✓ Added teachers and assigned subjects</li>
                      <li>✓ Created subjects with lecture/practical requirements</li>
                      <li>✓ Setup laboratories for practical sessions</li>
                    </ul>
                    <p className="text-xs text-blue-700 mt-3 pt-3 border-t border-blue-200">
                      💡 <strong>Tip:</strong> Manage divisions and classrooms in the <button onClick={() => router.push('/timetable/divisions')} className="text-blue-600 hover:underline font-semibold">Divisions</button> and <button onClick={() => router.push('/timetable/classrooms')} className="text-blue-600 hover:underline font-semibold">Classrooms</button> tabs.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateTimetable}
                    disabled={!selectedYear || generatingTimetable}
                    className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {generatingTimetable ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating Timetable...
                      </span>
                    ) : (
                      'Generate Timetable'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
