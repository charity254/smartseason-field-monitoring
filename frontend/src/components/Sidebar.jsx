import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { logout } from '../api'

export default function Sidebar() {
  const { user, removeUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (e) {}
    removeUser()
    navigate('/login')
  }

  return (
    <div className="w-64 min-h-screen bg-green-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">SmartSeason</h1>
        <p className="text-green-300 text-sm">Field Monitoring</p>
      </div>

      <nav className="flex-1 px-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${isActive ? 'bg-green-700' : 'hover:bg-green-800'}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/fields"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${isActive ? 'bg-green-700' : 'hover:bg-green-800'}`
          }
        >
          {user?.role === 'admin' ? 'Fields' : 'My Fields'}
        </NavLink>
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-green-800"
        >
          Logout
        </button>
      </div>
    </div>
  )
}