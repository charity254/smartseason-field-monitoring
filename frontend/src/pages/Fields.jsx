import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getFields } from '../api'
import { useAuth } from '../store/auth'

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

export default function Fields() {
  const [fields, setFields] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getFields().then(res => setFields(res.data))
  }, [])

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {user?.role === 'admin' ? 'All Fields' : 'My Fields'}
          </h2>
          <p className="text-gray-500">
            {user?.role === 'admin' ? 'Manage and monitor all crop fields' : 'Your assigned fields'}
          </p>
        </div>
    {user?.role === 'admin' && (
        <button
          onClick={() => navigate('/fields/create')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Create New Field
        </button>
    )}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-6 py-4">Field Name</th>
              <th className="text-left px-6 py-4">Crop Type</th>
              <th className="text-left px-6 py-4">Planting Date</th>
              <th className="text-left px-6 py-4">Stage</th>
              {user?.role === 'admin' && <th className="text-left px-6 py-4">Assigned Agent</th>}
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(field => (
              <tr key={field.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{field.name}</td>
                <td className="px-6 py-4">{field.crop_type}</td>
                <td className="px-6 py-4">{field.planting_date}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageBadge[field.stage]}`}>
                    {field.stage.charAt(0).toUpperCase() + field.stage.slice(1)}
                  </span>
                </td>
                {user?.role === 'admin' && <td className="px-6 py-4">{field.assigned_to_name || 'Unassigned'}</td>}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge[field.status]}`}>
                    {field.status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/fields/${field.id}`)}
                    className="text-green-600 hover:underline font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}