import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../store/auth'
import { getFields, getFieldUpdates, addFieldUpdate } from '../api'

const stageBadge = {
  planted: 'bg-blue-100 text-blue-700',
  growing: 'bg-green-100 text-green-700',
  ready: 'bg-orange-100 text-orange-700',
  harvested: 'bg-gray-100 text-gray-700',
}

const statusBadge = {
  active: 'bg-green-100 text-green-700',
  at_risk: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-700',
}

export default function FieldDetail() {
  const { id } = useParams()
  const [field, setField] = useState(null)
  const [updates, setUpdates] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [stage, setStage] = useState('growing')
  const [notes, setNotes] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getFields().then(res => {
      const found = res.data.find(f => f.id === parseInt(id))
      setField(found)
    })
    getFieldUpdates(id).then(res => setUpdates(res.data))
  }, [id])

  const handleSubmit = async () => {
    await addFieldUpdate(id, { stage, notes })
    setShowForm(false)
    setNotes('')
    getFieldUpdates(id).then(res => setUpdates(res.data))
    getFields().then(res => {
      const found = res.data.find(f => f.id === parseInt(id))
      setField(found)
    })
  }

  if (!field) return <Layout><p>Loading...</p></Layout>

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{field.name}</h2>
            <p className="text-gray-500">{field.crop_type}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge[field.status]}`}>
            {field.status.replace('_', ' ').charAt(0).toUpperCase() + field.status.replace('_', ' ').slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Planting Date</p>
            <p className="font-semibold mt-1">{field.planting_date}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Current Stage</p>
            <span className={`px-3 py-1 rounded-full text-xs font-medium mt-1 inline-block ${stageBadge[field.stage]}`}>
              {field.stage.charAt(0).toUpperCase() + field.stage.slice(1)}
            </span>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Assigned Agent</p>
            <p className="font-semibold mt-1">{field.assigned_to_name || 'Unassigned'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Field Updates</h3>
        {user?.role === 'agent' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            + Add Update
          </button>
        )}
        </div>

        {showForm && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h4 className="font-semibold mb-4">New Update</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready">Ready</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes/Observations</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter observations about the field..."
                className="w-full border rounded-lg px-4 py-2 h-32"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium">
                Submit Update
              </button>
              <button onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {updates.map(update => (
            <div key={update.id} className="border rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold">{update.agent_name}</p>
                  <p className="text-gray-400 text-sm">{new Date(update.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageBadge[update.stage]}`}>
                  {update.stage.charAt(0).toUpperCase() + update.stage.slice(1)}
                </span>
              </div>
              <p className="text-gray-600">{update.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}