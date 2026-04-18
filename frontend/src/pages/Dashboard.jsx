import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getDashboard } from '../api'
import { useAuth } from '../store/auth'
import { BarChart3, Activity, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    getDashboard().then(res => setData(res.data))
  }, [])

  const cards = [
    { label: 'Total Fields', value: data?.total_fields, icon: BarChart3, color: 'bg-blue-500' },
    { label: 'Active Fields', value: data?.active, icon: Activity, color: 'bg-green-500' },
    { label: 'At Risk Fields', value: data?.at_risk, icon: AlertTriangle, color: 'bg-red-500' },
    ...(user?.role === 'admin' ? [{ label: 'Completed Fields', value: data?.completed, icon: CheckCircle, color: 'bg-gray-500' }] : []),
  ]

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-1">Dashboard Overview</h2>
      <p className="text-gray-500 mb-6">Field monitoring statistics and summary</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <p className="text-3xl font-bold mt-1">{card.value ?? '-'}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-white`}>
                <Icon size={24} />
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}