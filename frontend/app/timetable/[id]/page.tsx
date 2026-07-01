'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const SUBJECT_COLORS = {
  'Mathematics': '#3B82F6',
  'Physics': '#8B5CF6',
  'Chemistry': '#EC4899',
  'Computer Science': '#10B981',
  'English': '#F59E0B',
  'History': '#EF4444',
  'Geography': '#06B6D4',
  'Biology': '#14B8A6'
}

export default function TimetableDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const timetableId = params.id

  const [facultyName, setFacultyName] = useState('')
  const [timetable, setTimetable] = useState(null)
  const [divisions, setDivisions] = useState([])
  const [selectedDivision, setSelectedDivision] = useState('')
  const [viewType, setViewType] = useState('week') // 'week' or 'grid'
  const [loading, setLoading] = useState(true)
  const [editingEntry, setEditingEntry] = useState(null)
  const [notification, setNotification] = useState({ type: '', message: '' })

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    if (!email) {
      router.push('/')
      return
    }
    setFacultyName(name || '')
    fetchTimetable()
  }, [timetableId, router])

  const fetchTimetable = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/timetable/${timetableId}`)
      const tt = response.data.timetable
      
      console.log('📋 TIMETABLE FETCHED:')
      console.log('   Total Entries:', tt.entries?.length || 0)
      if (tt.entries && tt.entries.length > 0) {
        console.log('   First Entry:', JSON.stringify(tt.entries[0], null, 2))
        console.log('   Subject Data:', tt.entries[0].subject)
        console.log('   Teacher Data:', tt.entries[0].teacher)
      }
      
      setTimetable(tt)

      // Extract unique divisions
      if (tt.entries && tt.entries.length > 0) {
        const uniqueDivisions = [...new Set(tt.entries.map(e => {
          const divId = e.division?._id || e.division
          return divId
        }))]as string[]
        setDivisions(uniqueDivisions)
        if (uniqueDivisions.length > 0) {
          setSelectedDivision(uniqueDivisions[0])
        }
      } else {
        console.log('   ⚠️ No entries found in timetable!')
      }
    } catch (error) {
      console.error('Error fetching timetable:', error)
      showNotification('error', 'Failed to load timetable')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({ type: '', message: '' }), 3000)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  const getSubjectName = (entry) => {
    if (entry.subject?.name) return entry.subject.name
    if (entry.subject?.code) return entry.subject.code
    if (typeof entry.subject === 'string') {
      const foundSubject = timetable.entries.find(e => e.subject?._id === entry.subject)?.subject
      return foundSubject?.name || foundSubject?.code || 'Subject'
    }
    return 'Subject'
  }

  const getTeacherName = (entry) => {
    if (entry.teacher?.name) return entry.teacher.name
    if (typeof entry.teacher === 'string') {
      const foundTeacher = timetable.entries.find(e => e.teacher?._id === entry.teacher)?.teacher
      return foundTeacher?.name || 'Teacher'
    }
    return 'Teacher'
  }

  const getEntryColor = (entry) => {
    const subjectName = getSubjectName(entry)
    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#14B8A6', '#6366F1', '#F97316']
    let hash = 0
    for (let i = 0; i < subjectName.length; i++) {
      hash = ((hash << 5) - hash) + subjectName.charCodeAt(i)
      hash = hash & hash
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const renderWeekView = () => {
    if (!timetable) return null

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const hours = Array.from({ length: 8 }, (_, i) => i + 9)

    // Filter entries for selected division
    const divisionEntries = timetable.entries.filter(
      e => {
        const entryDivId = e.division?._id || e.division
        return entryDivId === selectedDivision || entryDivId?.toString() === selectedDivision?.toString()
      }
    )

    return (
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm bg-white">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-gray-900 font-semibold border-r border-gray-200">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-left text-gray-900 font-semibold border-r border-gray-200">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-gray-900 font-semibold bg-gray-50 border-r border-gray-200 text-sm">
                    {`${hour}:00 - ${hour + 1}:00`}
                  </td>
                  {days.map((day) => {
                    const entry = divisionEntries.find(
                      e => e.day === day && parseInt(e.startTime.split(':')[0]) === hour
                    )
                    return (
                      <td
                        key={`${day}-${hour}`}
                        className="px-4 py-3 border-r border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => entry && setEditingEntry(entry)}
                      >
                        {entry && (
                          <div
                            className="p-2 rounded text-white text-xs font-medium shadow-md"
                            style={{ backgroundColor: getEntryColor(entry) }}
                          >
                            <div className="font-semibold">{entry.subject?.name || 'N/A'}</div>
                            <div className="text-xs opacity-90">{entry.teacher?.name}</div>
                            <div className="text-xs opacity-90">{entry.room}</div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderGridView = () => {
    if (!timetable) return null

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const timeSlots = [
      { start: 9, end: 10 },
      { start: 10, end: 11 },
      { start: 11, end: 12 },
      { start: 12, end: 13 },
      { start: 14, end: 15 },
      { start: 15, end: 16 },
      { start: 16, end: 17 },
      { start: 17, end: 18 }
    ]

    // Filter entries for selected division
    const divisionEntries = timetable.entries.filter(
      e => {
        const entryDivId = e.division?._id || e.division
        return entryDivId === selectedDivision || entryDivId?.toString() === selectedDivision?.toString()
      }
    )

    return (
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-xs bg-white">
            <thead>
              <tr className="bg-blue-100 border-b-2 border-gray-300">
                <th className="px-3 py-2 text-center text-gray-900 font-bold border-r border-gray-200 w-20">Time</th>
                {days.map((day) => (
                  <th key={day} className="px-3 py-2 text-center text-gray-900 font-bold border-r border-gray-200 min-w-32 bg-gradient-to-b from-blue-100 to-blue-50">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-yellow-50 transition-colors">
                  <td className="px-3 py-2 text-center text-gray-900 font-semibold bg-gray-50 border-r border-gray-200 text-xs">
                    {slot.start}:00<br/>-<br/>{slot.end}:00
                  </td>
                  {days.map((day) => {
                    const entry = divisionEntries.find(
                      e => e.day === day && parseInt(e.startTime.split(':')[0]) === slot.start
                    )
                    return (
                      <td
                        key={`${day}-${slot.start}`}
                        className="px-2 py-1 border-r border-gray-200 text-center align-middle min-h-24 hover:bg-blue-50 cursor-pointer"
                        onClick={() => entry && setEditingEntry(entry)}
                      >
                        {entry && (
                          <div className="space-y-1">
                            <div
                              className="p-2 rounded text-white text-xs font-bold shadow-md"
                              style={{ backgroundColor: getEntryColor(entry) }}
                            >
                              <div className="line-clamp-2">{getSubjectName(entry)}</div>
                            </div>
                            <div className="text-xs text-gray-700 font-medium">{entry.room}</div>
                            <div className="text-xs text-gray-600 italic">{getTeacherName(entry)}</div>
                            {entry.type === 'Practical' && <div className="text-xs text-purple-600 font-semibold">{entry.batch || 'Lab'}</div>}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderProfessionalView = () => {
    if (!timetable) return null

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const hours = Array.from({ length: 8 }, (_, i) => i + 9)

    // Get all unique divisions
    const allDivisions = [...new Set(timetable.entries.map(e => e.division?._id || e.division))].filter(Boolean)

    console.log('PROFESSIONAL VIEW DEBUG:')
    console.log('All Divisions:', allDivisions)
    console.log('Sample Entry:', timetable.entries[0])

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white border border-gray-300 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Professional Timetable</h2>
          <p className="text-sm text-gray-600">
            {timetable.year?.displayName} • Semester {timetable.semester}
          </p>
          <p className="text-xs text-gray-500 mt-2">All Divisions • Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Main Timetable */}
        <div className="bg-white border border-gray-400 rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-gray-200 border-b-2 border-gray-400">
                  <th className="border border-gray-400 px-3 py-2 text-center font-bold text-gray-900 w-16">Day</th>
                  <th className="border border-gray-400 px-3 py-2 text-center font-bold text-gray-900 w-12">Div</th>
                  {hours.map((hour) => (
                    <th key={hour} className="border border-gray-400 px-2 py-2 text-center font-bold text-gray-900 bg-blue-100 min-w-24">
                      {`${hour}:00-${hour + 1}:00`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day, dayIdx) => {
                  return allDivisions.map((divId, divIdx) => {
                    const divisionEntries = timetable.entries.filter(e => {
                      const entryDivId = e.division?._id || e.division
                      return (entryDivId === divId || entryDivId?.toString() === divId?.toString()) && e.day === day
                    })

                    const divisionObj = timetable.entries.find(e => {
                      const entryDivId = e.division?._id || e.division
                      return entryDivId === divId || entryDivId?.toString() === divId?.toString()
                    })?.division

                    const divisionName = divisionObj?.name || 'N/A'

                    return (
                      <tr key={`${day}-${divId}`} className="border-b border-gray-300 hover:bg-blue-50">
                        {divIdx === 0 && (
                          <td className="border border-gray-400 px-3 py-2 font-bold text-gray-900 bg-gray-100 text-center align-top" rowSpan={allDivisions.length}>
                            {day}
                          </td>
                        )}
                        <td className="border border-gray-400 px-3 py-2 font-bold text-gray-900 bg-gray-100 text-center">
                          {divisionName}
                        </td>
                        {hours.map((hour) => {
                          const entry = divisionEntries.find(
                            e => parseInt(e.startTime.split(':')[0]) === hour
                          )
                          return (
                            <td
                              key={`${day}-${divId}-${hour}`}
                              className="border border-gray-400 px-2 py-2 text-center align-middle min-h-20 hover:bg-yellow-50 cursor-pointer"
                            >
                              {entry ? (
                                <div className="text-xs leading-tight space-y-0.5">
                                  <div className="font-bold text-gray-900 text-sm">
                                    {getSubjectName(entry)}
                                  </div>
                                  <div className="text-gray-700 font-semibold text-xs">{entry.room}</div>
                                  <div className="text-gray-600 text-xs italic">{getTeacherName(entry)}</div>
                                </div>
                              ) : (
                                <span className="text-gray-300">--</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Details */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">Subject Details</h3>
            <div className="space-y-3">
              {[...new Set(timetable.entries.map(e => {
                const subId = e.subject?._id || e.subject
                return subId
              }))].map((subId, idx) => {
                const entry = timetable.entries.find(e => {
                  const eSubId = e.subject?._id || e.subject
                  return eSubId === subId || eSubId?.toString() === subId?.toString()
                })
                const subject = entry?.subject
                const entries = timetable.entries.filter(e => {
                  const eSubId = e.subject?._id || e.subject
                  return eSubId === subId || eSubId?.toString() === subId?.toString()
                })
                if (!subject) return null
                return (
                  <div key={subId as string} className="border-l-4 border-blue-600 pl-4 py-2 text-sm">
                    <div className="font-bold text-gray-900">
                      {subject.code || 'N/A'}: {subject.name || 'Subject'}
                    </div>
                    <div className="text-gray-600 mt-1">
                      Teachers: {[...new Set(entries.map(e => getTeacherName(e)))].filter(Boolean).join(', ') || 'N/A'}
                    </div>
                    <div className="text-gray-600">
                      Lectures: {entries.length}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Teacher Details */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">Teacher Schedule</h3>
            <div className="space-y-3">
              {[...new Set(timetable.entries.map(e => {
                const teacherId = e.teacher?._id || e.teacher
                return teacherId
              }))].map((teacherId, idx) => {
                const entry = timetable.entries.find(e => {
                  const eTeacherId = e.teacher?._id || e.teacher
                  return eTeacherId === teacherId || eTeacherId?.toString() === teacherId?.toString()
                })
                const teacher = entry?.teacher
                const entries = timetable.entries.filter(e => {
                  const eTeacherId = e.teacher?._id || e.teacher
                  return eTeacherId === teacherId || eTeacherId?.toString() === teacherId?.toString()
                })
                if (!teacher) return null
                return (
                  <div key={teacherId as string} className="border-l-4 border-green-600 pl-4 py-2 text-sm">
                    <div className="font-bold text-gray-900">{teacher.name || 'Teacher'}</div>
                    <div className="text-gray-600 mt-1">
                      Subjects: {[...new Set(entries.map(e => getSubjectName(e)))].filter(Boolean).join(', ') || 'N/A'}
                    </div>
                    <div className="text-gray-600">
                      Classes: {entries.length}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar facultyName={facultyName} />
        <main className="flex-1 flex flex-col ml-64">
          <Navbar facultyName={facultyName} onLogout={handleLogout} />
          <div className="flex-1 flex items-center justify-center pt-16">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 font-medium">Loading timetable...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!timetable) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar facultyName={facultyName} />
        <main className="flex-1 flex flex-col ml-64">
          <Navbar facultyName={facultyName} onLogout={handleLogout} />
          <div className="flex-1 flex items-center justify-center pt-16">
            <p className="text-gray-600 font-medium text-lg">Timetable not found</p>
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{timetable.name}</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {timetable.year?.displayName} • Semester {timetable.semester} • {timetable.entries?.length} classes
                </p>
              </div>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors"
              >
                ← Back
              </button>
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

            {/* Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-wrap gap-6 items-end">
                {viewType !== 'professional' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Select Division
                    </label>
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      {divisions.map((divId, idx) => {
                        const divName = timetable.entries.find(e => {
                          const entryDivId = e.division?._id || e.division
                          return entryDivId === divId || entryDivId?.toString() === divId?.toString()
                        })?.division?.name;
                        return (
                          <option key={divId} value={divId}>
                            {divName || `Division ${idx + 1}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => setViewType('week')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewType === 'week'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📅 Week View
                  </button>
                  <button
                    onClick={() => setViewType('grid')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewType === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔲 Grid View
                  </button>
                  <button
                    onClick={() => setViewType('professional')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      viewType === 'professional'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    📋 Professional
                  </button>
                </div>
              </div>
            </div>

            {/* Timetable View */}
            <div className={viewType === 'professional' ? '' : 'bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'}>
              <div className={viewType === 'professional' ? '' : 'p-6'}>
                {viewType === 'week' ? renderWeekView() : viewType === 'grid' ? renderGridView() : renderProfessionalView()}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md w-full shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Class Details</h2>
              <div className="space-y-3 text-gray-700 mb-6">
                <div className="flex justify-between">
                  <span className="font-semibold">Subject:</span>
                  <span>{editingEntry.subject?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Teacher:</span>
                  <span>{editingEntry.teacher?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Day:</span>
                  <span>{editingEntry.day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Time:</span>
                  <span>{editingEntry.startTime} - {editingEntry.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Room:</span>
                  <span>{editingEntry.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Type:</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {editingEntry.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
