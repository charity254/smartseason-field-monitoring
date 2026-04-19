import { useState, useEffect } from 'react'
import { getRecentUpdates } from '../api'

const stageBadge = {
  planted: 'bg-blue-100 text-blue-700',
  growing: 'bg-green-100 text-green-700',
  ready: 'bg-orange-100 text-orange-700',
  harvested: 'bg-gray-100 text-gray-700',
}

export default function RecentUpdates() {
  const [updates, setUpdates] = useState([])

  useEffect(() => {
    getRecentUpdates().then(res => setUpdates(res.data))
  }, [])

  if (updates.length === 0) return <p className="text-gray-400 text-sm">No recent updates.</p>

  return (
    <div className="space-y-3">
      {updates.map(update => (
        <div key={update.id} className="flex justify-between items-start border rounded-lg p-4">
          <div>
            <p className="font-medium text-sm">{update.field_name}</p>
            <p className="text-gray-400 text-xs mt-1">{new Date(update.created_at).toLocaleString()}</p>
            {update.notes && <p className="text-gray-600 text-sm mt-1">{update.notes}</p>}
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageBadge[update.stage]}`}>
            {update.stage.charAt(0).toUpperCase() + update.stage.slice(1)}
          </span>
        </div>
      ))}
    </div>
  )
}