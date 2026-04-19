import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getDashboard } from '../api'
import { useAuth } from '../store/auth'
import { BarChart3, Activity, AlertTriangle, CheckCircle } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const STATUS_COLORS = ['#22c55e', '#ef4444', '#6b7280']
const STAGE_COLORS = { planted: '#60a5fa', growing: '#22c55e', ready: '#f97316', harvested: '#6b7280' }

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

  const statusData = [
    { name: 'Active', value: data?.active || 0 },
    { name: 'At Risk', value: data?.at_risk || 0 },
    { name: 'Completed', value: data?.completed || 0 },
  ]

  const stageData = [
    { name: 'Planted', value: data?.planted || 0, fill: '#60a5fa' },
    { name: 'Growing', value: data?.growing || 0, fill: '#22c55e' },
    { name: 'Ready', value: data?.ready || 0, fill: '#f97316' },
    { name: 'Harvested', value: data?.harvested || 0, fill: '#6b7280' },
  ]

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-1">Dashboard Overview</h2>
      <p className="text-gray-500 mb-6">Field monitoring statistics and summary</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-1">Fields by Stage</h3>
            <p className="text-gray-500 text-sm mb-6">How many fields are at each growth stage</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stageData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold mb-1">Field Status Breakdown</h3>
            <p className="text-gray-500 text-sm mb-6">Distribution of fields by current status</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </Layout>
  )
}