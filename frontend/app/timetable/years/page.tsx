'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function YearsPage() {
  const router = useRouter()
  const [facultyName, setFacultyName] = useState('')
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingYear, setEditingYear] = useState(null)
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [formData, setFormData] = useState({
    name: '',
    yearNumber: 0,
    startTime: '09:00',
    endTime: '16:00',
    breakStartTime: '12:00',
    breakEndTime: '13:00'
  })

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    if (!email) {
      router.push('/')
      return
    }
    setFacultyName(name || '')
    fetchYears()
  }, [router])

  const fetchYears = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/year`)
      setYears(response.data.years || [])
    } catch (error) {
      console.error('Error fetching years:', error)
      showNotification('error', 'Failed to fetch years')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({ type: '', message: '' }), 3000)
  }

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.yearNumber) {
        showNotification('error', 'Name and year number are required')
        return
      }

      if (editingYear) {
        await axios.put(`${API_URL}/api/year/${editingYear._id}`, formData)
        showNotification('success', 'Year updated successfully')
      } else {
        await axios.post(`${API_URL}/api/year`, formData)
        showNotification('success', 'Year created successfully')
      }

      setShowForm(false)
      setEditingYear(null)
      setFormData({
        name: '',
        yearNumber: 0,
        startTime: '09:00',
        endTime: '16:00',
        breakStartTime: '12:00',
        breakEndTime: '13:00'
      })
      fetchYears()
    } catch (error) {
      console.error('Error saving year:', error)
      showNotification('error', error.response?.data?.message || 'Failed to save year')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this year?')) return

    try {
      await axios.delete(`${API_URL}/api/year/${id}`)
      showNotification('success', 'Year deleted successfully')
      fetchYears()
    } catch (error) {
      console.error('Error deleting year:', error)
      showNotification('error', 'Failed to delete year')
    }
  }

  const handleEdit = (year) => {
    setEditingYear(year)
    setFormData({
      name: year.name,
      yearNumber: year.yearNumber,
      startTime: year.startTime,
      endTime: year.endTime,
      breakStartTime: year.breakStartTime,
      breakEndTime: year.breakEndTime
    })
    setShowForm(true)
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Academic Years</h1>
                <p className="text-sm text-gray-500 mt-1">Manage academic years and their schedules</p>
              </div>
              <button
                onClick={() => {
                  setEditingYear(null)
                  setShowForm(true)
                  setFormData({
                    name: '',
                    yearNumber: 0,
                    startTime: '09:00',
                    endTime: '16:00',
                    breakStartTime: '12:00',
                    breakEndTime: '13:00'
                  })
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                + New Year
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

            {/* Form Modal */}
            {showForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full my-8 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    {editingYear ? 'Edit Year' : 'New Year'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Year Name</label>
                      <select
                        value={formData.name}
                        onChange={(e) => {
                          const selected = e.target.value
                          setFormData({
                            ...formData,
                            name: selected,
                            yearNumber: selected === 'SY' ? 2 : selected === 'TY' ? 3 : 4
                          })
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select Year --</option>
                        <option value="SY">SY (Second Year)</option>
                        <option value="TY">TY (Third Year)</option>
                        <option value="Final Year">Final Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">End Time</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Break Start Time</label>
                      <input
                        type="time"
                        value={formData.breakStartTime}
                        onChange={(e) => setFormData({ ...formData, breakStartTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Break End Time</label>
                      <input
                        type="time"
                        value={formData.breakEndTime}
                        onChange={(e) => setFormData({ ...formData, breakEndTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Years Grid */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading years...</p>
                </div>
              ) : years.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No years found. Create one to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {years.map((year) => (
                    <div key={year._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{year.displayName}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p><span className="font-semibold">Code:</span> {year.name}</p>
                        <p><span className="font-semibold">Year No:</span> {year.yearNumber}</p>
                        <p><span className="font-semibold">Start:</span> {year.startTime}</p>
                        <p><span className="font-semibold">End:</span> {year.endTime}</p>
                        <p><span className="font-semibold">Break:</span> {year.breakStartTime} - {year.breakEndTime}</p>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(year)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(year._id)}
                          className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium border border-red-200"
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
        </div>
      </main>
    </div>
  )
}
