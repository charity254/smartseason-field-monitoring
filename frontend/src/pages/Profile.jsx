import { useAuth } from '../store/auth'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Layout>
      <button onClick={() => navigate(-1)} className="text-gray-500 mb-4 hover:underline">← Back</button>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.username}</h2>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Username</p>
            <p className="font-semibold mt-1">{user?.username}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold mt-1">{user?.email || 'No email set'}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-sm">Role</p>
            <p className="font-semibold mt-1 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}