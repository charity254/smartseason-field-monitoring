import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getDashboard } from '../api'
import { useAuth } from '../store/auth'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    getDashboard().then(res => setStats(res.data))
  }, [])

  const cards = [
    { label: 'Total Fields', value: stats?.total_fields, bg: 'bg-blue-500' },
    { label: 'Active Fields', value: stats?.active, bg: 'bg-green-500' },
    { label: 'At Risk Fields', value: stats?.at_risk, bg: 'bg-red-500' },
    ...(user?.role === 'admin' ? [{ label: 'Completed Fields', value: stats?.completed, bg: 'bg-gray-500' }] : []),
  ]

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-1">Dashboard Overview</h2>
      <p className="text-gray-500 mb-6">Field monitoring statistics and summary</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-3xl font-bold mt-1">{card.value ?? '-'}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center text-white text-xl`}>
              📊
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}