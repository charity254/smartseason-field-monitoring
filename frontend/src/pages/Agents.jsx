import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getAgents, createAgent, updateAgent, deactivateAgent } from '../api'

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingAgent, setEditingAgent] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '', location: '' })
  const [error, setError] = useState('')

  const fetchAgents = () => getAgents().then(res => setAgents(res.data))

  useEffect(() => { fetchAgents() }, [])

  const handleSubmit = async () => {
    setError('')
    try {
      if (editingAgent) {
        await updateAgent(editingAgent.id, form)
      } else {
        await createAgent(form)
      }
      setShowForm(false)
      setEditingAgent(null)
      setForm({ username: '', email: '', password: '', phone: '', location: '' })
      fetchAgents()
    } catch (e) {
      setError('Failed to save agent. Please check all fields.')
    }
  }

  const handleEdit = (agent) => {
    setEditingAgent(agent)
    setForm({ username: agent.username, email: agent.email, phone: agent.phone, location: agent.location, password: '' })
    setShowForm(true)
  }

  const handleDeactivate = async (id) => {
    try {
      await deactivateAgent(id)
      fetchAgents()
    } catch (e) {
      console.error('Deactivate error:', e)
    }
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Agent Management</h2>
          <p className="text-gray-500">Manage all field agents</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingAgent(null); setForm({ username: '', email: '', password: '', phone: '', location: '' }) }}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Add Agent
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingAgent ? 'Edit Agent' : 'New Agent'}</h3>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="grid grid-cols-2 gap-4">
            {!editingAgent && (
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            {!editingAgent && (
              <div>
                <label className="block text-sm font-medium mb-1">Temporary Password</label>
                <input
                type="password"
                placeholder="Enter temporary password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium">
              {editingAgent ? 'Save Changes' : 'Create Agent'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingAgent(null) }} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 text-left">Agent</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Phone</th>
              <th className="px-6 py-4 text-left">Location</th>
              <th className="px-6 py-4 text-left">Total Fields</th>
              <th className="px-6 py-4 text-left">Active</th>
              <th className="px-6 py-4 text-left">At Risk</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {agents.map(agent => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      {agent.username[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{agent.username}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{agent.email || 'No email'}</td>
                <td className="px-6 py-4 text-gray-500">{agent.phone || 'No phone'}</td>
                <td className="px-6 py-4 text-gray-500">{agent.location || 'No location'}</td>
                <td className="px-6 py-4 font-semibold">{agent.total_fields}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {agent.active_fields}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    {agent.at_risk_fields}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${agent.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {agent.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(agent)} className="text-blue-600 hover:underline font-medium">
                      Edit
                    </button>
                    <button onClick={() => handleDeactivate(agent.id)} className={`font-medium ${agent.is_active ? 'text-red-500 hover:underline' : 'text-green-600 hover:underline'}`}>
                      {agent.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}