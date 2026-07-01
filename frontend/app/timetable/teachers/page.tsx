'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

export default function TeachersPage() {
  const router = useRouter()
  const [facultyName, setFacultyName] = useState('')
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [notification, setNotification] = useState({ type: '', message: '' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    department: 'Computer Science',
    subjects: [],
    isLabAssistant: false
  })

  useEffect(() => {
    const email = sessionStorage.getItem('facultyEmail')
    const name = sessionStorage.getItem('facultyName')
    if (!email) {
      router.push('/')
      return
    }
    setFacultyName(name || '')
    fetchTeachers()
    fetchSubjects()
  }, [router])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/teacher`)
      setTeachers(response.data.teachers || [])
    } catch (error) {
      console.error('Error fetching teachers:', error)
      showNotification('error', 'Failed to fetch teachers')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/subject`)
      setSubjects(response.data.subjects || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification({ type: '', message: '' }), 3000)
  }

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.email) {
        showNotification('error', 'Name and email are required')
        return
      }

      if (editingTeacher) {
        await axios.put(`${API_URL}/api/teacher/${editingTeacher._id}`, formData)
        showNotification('success', 'Teacher updated successfully')
      } else {
        await axios.post(`${API_URL}/api/teacher`, formData)
        showNotification('success', 'Teacher created successfully')
      }

      setShowForm(false)
      setEditingTeacher(null)
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        department: 'Computer Science',
        subjects: [],
        isLabAssistant: false
      })
      fetchTeachers()
    } catch (error) {
      console.error('Error saving teacher:', error)
      showNotification('error', error.response?.data?.message || 'Failed to save teacher')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return

    try {
      await axios.delete(`${API_URL}/api/teacher/${id}`)
      showNotification('success', 'Teacher deleted successfully')
      fetchTeachers()
    } catch (error) {
      console.error('Error deleting teacher:', error)
      showNotification('error', 'Failed to delete teacher')
    }
  }

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phoneNumber: teacher.phoneNumber || '',
      department: teacher.department || 'Computer Science',
      subjects: teacher.subjects?.map(s => s._id) || [],
      isLabAssistant: teacher.isLabAssistant || false
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
                <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
                <p className="text-sm text-gray-500 mt-1">Manage faculty teachers and their subjects</p>
              </div>
              <button
                onClick={() => {
                  setEditingTeacher(null)
                  setShowForm(true)
                  setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    department: 'Computer Science',
                    subjects: [],
                    isLabAssistant: false
                  })
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                + New Teacher
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
                    {editingTeacher ? 'Edit Teacher' : 'New Teacher'}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@college.ac.in"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+91-9876543210"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Subjects</label>
                      <select
                        multiple
                        value={formData.subjects}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value)
                          setFormData({ ...formData, subjects: selected })
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject._id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                    </div>

                    <label className="flex items-center gap-2 text-gray-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isLabAssistant}
                        onChange={(e) => setFormData({ ...formData, isLabAssistant: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="font-medium">Lab Assistant</span>
                    </label>
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

            {/* Teachers Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-gray-900 font-semibold text-sm">Name</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-semibold text-sm">Email</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-semibold text-sm">Phone</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-semibold text-sm">Subjects</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-semibold text-sm">Lab Asst</th>
                      <th className="px-6 py-3 text-left text-gray-900 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-gray-900 font-medium">{teacher.name}</td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{teacher.email}</td>
                        <td className="px-6 py-3 text-gray-600 text-sm">{teacher.phoneNumber || '-'}</td>
                        <td className="px-6 py-3 text-gray-600 text-sm">
                          {teacher.subjects?.length || 0} subjects
                        </td>
                        <td className="px-6 py-3">
                          {teacher.isLabAssistant ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">
                              No
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(teacher._id)}
                              className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm rounded transition-colors border border-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading teachers...</p>
                </div>
              ) : teachers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No teachers found. Create one to get started.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
