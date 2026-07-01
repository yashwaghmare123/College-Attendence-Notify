'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const FACILITY_OPTIONS = ['Projector', 'Whiteboard', 'Smart Board', 'AC', 'WiFi']

export default function ClassroomsPage() {
  const router = useRouter()
  const [facultyName, setFacultyName] = useState('')
  const [classrooms, setClassrooms] = useState([])
  const [years, setYears] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingClassroom, setEditingClassroom] = useState(null)
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [formData, setFormData] = useState({
    name: '',
    capacity: 30,
    year: '',
    building: 'Main',
    floor: 1,
    facilities: ['Projector', 'Whiteboard', 'AC', 'WiFi']
  })

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    if (!email) {
      router.push('/')
      return
    }
    setFacultyName(name || '')
    fetchClassrooms()
    fetchYears()
  }, [router])

  const fetchClassrooms = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/classroom`)
      setClassrooms(response.data.classrooms || [])
    } catch (error) {
      console.error('Error fetching classrooms:', error)
      showNotification('error', 'Failed to load classrooms')
    } finally {
      setLoading(false)
    }
  }

  const fetchYears = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/year`)
      setYears(response.data.years || [])
    } catch (error) {
      console.error('Error fetching years:', error)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({ type: '', message: '' }), 3000)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.year) {
      showNotification('error', 'Name and year are required')
      return
    }

    try {
      if (editingClassroom) {
        await axios.put(`${API_URL}/api/classroom/${editingClassroom._id}`, formData)
        showNotification('success', 'Classroom updated successfully')
      } else {
        await axios.post(`${API_URL}/api/classroom`, formData)
        showNotification('success', 'Classroom created successfully')
      }
      setShowForm(false)
      resetForm()
      fetchClassrooms()
    } catch (error) {
      console.error('Error saving classroom:', error)
      showNotification('error', error.response?.data?.message || 'Failed to save classroom')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      capacity: 30,
      year: '',
      building: 'Main',
      floor: 1,
      facilities: ['Projector', 'Whiteboard', 'AC', 'WiFi']
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this classroom?')) return

    try {
      await axios.delete(`${API_URL}/api/classroom/${id}`)
      showNotification('success', 'Classroom deleted successfully')
      fetchClassrooms()
    } catch (error) {
      console.error('Error deleting classroom:', error)
      showNotification('error', 'Failed to delete classroom')
    }
  }

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom)
    setFormData({
      name: classroom.name,
      capacity: classroom.capacity,
      year: classroom.year._id,
      building: classroom.building || 'Main',
      floor: classroom.floor || 1,
      facilities: classroom.facilities || ['Projector', 'Whiteboard', 'AC', 'WiFi']
    })
    setShowForm(true)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/')
  }

  const toggleFacility = (facility) => {
    const currentFacilities = formData.facilities || []
    if (currentFacilities.includes(facility)) {
      setFormData({
        ...formData,
        facilities: currentFacilities.filter(f => f !== facility)
      })
    } else {
      setFormData({
        ...formData,
        facilities: [...currentFacilities, facility]
      })
    }
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
                <h1 className="text-2xl font-bold text-gray-900">Classrooms</h1>
                <p className="text-sm text-gray-500 mt-1">Manage lecture halls and classroom facilities</p>
              </div>
              <button
                onClick={() => {
                  setEditingClassroom(null)
                  resetForm()
                  setShowForm(true)
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                + New Classroom
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
                    {editingClassroom ? 'Edit Classroom' : 'New Classroom'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Classroom Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., A-101"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Year</label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select Year --</option>
                        {years.map((year) => (
                          <option key={year._id} value={year._id}>
                            {year.displayName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Capacity</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Floor</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.floor}
                          onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Building</label>
                      <input
                        type="text"
                        value={formData.building}
                        onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                        placeholder="e.g., Main, Block A"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Facilities</label>
                      <div className="space-y-2">
                        {FACILITY_OPTIONS.map((facility) => (
                          <label key={facility} className="flex items-center gap-2 text-gray-900 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={(formData.facilities || []).includes(facility)}
                              onChange={() => toggleFacility(facility)}
                              className="w-4 h-4"
                            />
                            <span>{facility}</span>
                          </label>
                        ))}
                      </div>
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

            {/* Classrooms Grid */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading classrooms...</p>
                </div>
              ) : classrooms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No classrooms found. Create one to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classrooms.map((classroom) => (
                    <div key={classroom._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{classroom.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p><span className="font-semibold">Year:</span> {classroom.year?.displayName}</p>
                        <p><span className="font-semibold">Capacity:</span> {classroom.capacity} students</p>
                        <p><span className="font-semibold">Location:</span> {classroom.building}, Floor {classroom.floor}</p>
                        {classroom.facilities && classroom.facilities.length > 0 && (
                          <p><span className="font-semibold">Facilities:</span> {classroom.facilities.join(', ')}</p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(classroom)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(classroom._id)}
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
