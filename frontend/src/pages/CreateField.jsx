import { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../store/auth'
import { createField, getFields } from '../api'
import axios from 'axios'

export default function CreateField() {
  const [form, setForm] = useState({
    name: '',
    crop_type: '',
    planting_date: '',
    stage: 'planted',
    assigned_to: '',
  })
  const [agents, setAgents] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()
  if (user?.role !== 'admin') return <Navigate to="/fields" />

  useEffect(() => {
    const token = localStorage.getItem('token')
    axios.get('http://127.0.0.1:8000/api/users/', {
      headers: { Authorization: `Token ${token}` }
    }).then(res => setAgents(res.data)).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    try {
      await createField(form)
      navigate('/fields')
    } catch (e) {
      setError('Failed to create field. Please check all fields.')
    }
  }

  return (
    <Layout>
      <button onClick={() => navigate('/fields')} className="text-gray-500 mb-4 hover:underline">← Back</button>
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Create New Field</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Field Name</label>
          <input
            type="text"
            placeholder="Enter field name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Crop Type</label>
          <input
            type="text"
            placeholder="Enter crop type"
            value={form.crop_type}
            onChange={(e) => setForm({ ...form, crop_type: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Planting Date</label>
          <input
            type="date"
            value={form.planting_date}
            onChange={(e) => setForm({ ...form, planting_date: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Stage</label>
          <select
            value={form.stage}
            onChange={(e) => setForm({ ...form, stage: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="planted">Planted</option>
            <option value="growing">Growing</option>
            <option value="ready">Ready</option>
            <option value="harvested">Harvested</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Assign to Agent</label>
          <select
            value={form.assigned_to}
            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="">Select an agent</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.username}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium">
            Create Field
          </button>
          <button onClick={() => navigate('/fields')} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium">
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  )
}