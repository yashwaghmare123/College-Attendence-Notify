'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function LabsPage() {
  const router = useRouter()
  const [facultyName, setFacultyName] = useState('')
  const [labs, setLabs] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingLab, setEditingLab] = useState(null)
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    capacity: 30,
    type: 'Regular',
    systems: 30,
    building: 'Main',
    floor: 2
  })

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    if (!email) {
      router.push('/')
      return
    }
    setFacultyName(name || '')
    fetchLabs()
  }, [router])

  const fetchLabs = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/lab`)
      setLabs(response.data.labs || [])
    } catch (error) {
      console.error('Error fetching labs:', error)
      showNotification('error', 'Failed to fetch labs')
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
      if (!formData.name || !formData.code) {
        showNotification('error', 'Name and code are required')
        return
      }

      if (editingLab) {
        await axios.put(`${API_URL}/api/lab/${editingLab._id}`, formData)
        showNotification('success', 'Lab updated successfully')
      } else {
        await axios.post(`${API_URL}/api/lab`, formData)
        showNotification('success', 'Lab created successfully')
      }

      setShowForm(false)
      setEditingLab(null)
      resetForm()
      fetchLabs()
    } catch (error) {
      console.error('Error saving lab:', error)
      showNotification('error', error.response?.data?.message || 'Failed to save lab')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      capacity: 30,
      type: 'Regular',
      systems: 30,
      building: 'Main',
      floor: 2
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lab?')) return

    try {
      await axios.delete(`${API_URL}/api/lab/${id}`)
      showNotification('success', 'Lab deleted successfully')
      fetchLabs()
    } catch (error) {
      console.error('Error deleting lab:', error)
      showNotification('error', 'Failed to delete lab')
    }
  }

  const handleEdit = (lab) => {
    setEditingLab(lab)
    setFormData({
      name: lab.name,
      code: lab.code,
      capacity: lab.capacity,
      type: lab.type,
      systems: lab.systems,
      building: lab.building,
      floor: lab.floor
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
                <h1 className="text-2xl font-bold text-gray-900">Labs</h1>
                <p className="text-sm text-gray-500 mt-1">Manage laboratory facilities</p>
              </div>
              <button
                onClick={() => {
                  setEditingLab(null)
                  resetForm()
                  setShowForm(true)
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                + New Lab
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
                    {editingLab ? 'Edit Lab' : 'New Lab'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Lab Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Main Lab"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Code</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., LAB-01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Regular">Regular</option>
                        <option value="ML Lab">ML Lab</option>
                        <option value="Special">Special</option>
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
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Systems</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.systems}
                          onChange={(e) => setFormData({ ...formData, systems: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Building</label>
                        <input
                          type="text"
                          value={formData.building}
                          onChange={(e) => setFormData({ ...formData, building: e.target.value })}
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

            {/* Labs Grid */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading labs...</p>
                </div>
              ) : labs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No labs found. Create one to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {labs.map((lab) => (
                    <div key={lab._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{lab.name}</h3>
                      <p className="text-blue-600 font-mono text-sm mb-3">{lab.code}</p>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p><span className="font-semibold">Type:</span> {lab.type}</p>
                        <p><span className="font-semibold">Capacity:</span> {lab.capacity} students</p>
                        <p><span className="font-semibold">Systems:</span> {lab.systems}</p>
                        <p><span className="font-semibold">Location:</span> {lab.building}, Floor {lab.floor}</p>
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(lab)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(lab._id)}
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
