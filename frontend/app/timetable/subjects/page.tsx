'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const SUBJECT_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#14B8A6']

export default function SubjectsPage() {
  const router = useRouter()
  const [facultyName, setFacultyName] = useState('')
  const [subjects, setSubjects] = useState([])
  const [years, setYears] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    year: '',
    credits: 4,
    lecturesPerWeek: 3,
    practicalsPerWeek: 0,
    requiresLab: false,
    labType: 'Regular',
    color: '#3B82F6',
    teachers: []
  })

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    if (!email) {
      router.push('/')
      return
    }
    setFacultyName(name || '')
    fetchSubjects()
    fetchYears()
    fetchTeachers()
  }, [router])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/subject`)
      setSubjects(response.data.subjects || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
      showNotification('error', 'Failed to fetch subjects')
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

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/teacher`)
      setTeachers(response.data.teachers || [])
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({ type: '', message: '' }), 3000)
  }

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.code || !formData.year) {
        showNotification('error', 'Name, code, and year are required')
        return
      }

      if (editingSubject) {
        await axios.put(`${API_URL}/api/subject/${editingSubject._id}`, formData)
        showNotification('success', 'Subject updated successfully')
      } else {
        await axios.post(`${API_URL}/api/subject`, formData)
        showNotification('success', 'Subject created successfully')
      }

      setShowForm(false)
      setEditingSubject(null)
      resetForm()
      fetchSubjects()
    } catch (error) {
      console.error('Error saving subject:', error)
      showNotification('error', error.response?.data?.message || 'Failed to save subject')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      year: '',
      credits: 4,
      lecturesPerWeek: 3,
      practicalsPerWeek: 0,
      requiresLab: false,
      labType: 'Regular',
      color: '#3B82F6',
      teachers: []
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return

    try {
      await axios.delete(`${API_URL}/api/subject/${id}`)
      showNotification('success', 'Subject deleted successfully')
      fetchSubjects()
    } catch (error) {
      console.error('Error deleting subject:', error)
      showNotification('error', 'Failed to delete subject')
    }
  }

  const handleEdit = (subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      code: subject.code,
      year: subject.year._id,
      credits: subject.credits,
      lecturesPerWeek: subject.lecturesPerWeek,
      practicalsPerWeek: subject.practicalsPerWeek,
      requiresLab: subject.requiresLab,
      labType: subject.labType,
      color: subject.color,
      teachers: subject.teachers?.map(t => t._id) || []
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
                <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
                <p className="text-sm text-gray-500 mt-1">Manage academic subjects and their details</p>
              </div>
              <button
                onClick={() => {
                  setEditingSubject(null)
                  resetForm()
                  setShowForm(true)
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                + New Subject
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
                    {editingSubject ? 'Edit Subject' : 'New Subject'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Data Structures"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Code</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., CS201"
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Teachers (Select at least one)</label>
                      <div className="border border-gray-300 rounded-lg p-3 bg-white max-h-40 overflow-y-auto">
                        {teachers.length === 0 ? (
                          <p className="text-sm text-gray-500">No teachers available. Create teachers first.</p>
                        ) : (
                          <div className="space-y-2">
                            {teachers.map((teacher) => (
                              <label key={teacher._id} className="flex items-center gap-2 cursor-pointer text-gray-900">
                                <input
                                  type="checkbox"
                                  checked={formData.teachers.includes(teacher._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData({
                                        ...formData,
                                        teachers: [...formData.teachers, teacher._id]
                                      })
                                    } else {
                                      setFormData({
                                        ...formData,
                                        teachers: formData.teachers.filter(id => id !== teacher._id)
                                      })
                                    }
                                  }}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm">{teacher.name}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Lectures/Week</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.lecturesPerWeek}
                          onChange={(e) => setFormData({ ...formData, lecturesPerWeek: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Practicals/Week</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.practicalsPerWeek}
                          onChange={(e) => setFormData({ ...formData, practicalsPerWeek: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.requiresLab}
                        onChange={(e) => setFormData({ ...formData, requiresLab: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Requires Lab</span>
                    </label>

                    {formData.requiresLab && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Lab Type</label>
                        <select
                          value={formData.labType}
                          onChange={(e) => setFormData({ ...formData, labType: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Regular">Regular</option>
                          <option value="ML Lab">ML Lab</option>
                          <option value="Special">Special</option>
                        </select>
                      </div>
                    )}
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

            {/* Subjects Grid */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading subjects...</p>
                </div>
              ) : subjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No subjects found. Create one to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <div key={subject._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="h-2 rounded-full mb-3" style={{ backgroundColor: subject.color }} />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.name}</h3>
                      <p className="text-blue-600 font-mono text-sm mb-3">{subject.code}</p>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p><span className="font-semibold">Year:</span> {subject.year?.displayName}</p>
                        <p><span className="font-semibold">Lectures:</span> {subject.lecturesPerWeek}/week</p>
                        <p><span className="font-semibold">Practicals:</span> {subject.practicalsPerWeek}/week</p>
                        {subject.teachers && subject.teachers.length > 0 && (
                          <p><span className="font-semibold">Teachers:</span> {subject.teachers.map(t => t.name).join(', ')}</p>
                        )}
                        {subject.requiresLab && (
                          <p><span className="font-semibold">Lab:</span> {subject.labType}</p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
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
