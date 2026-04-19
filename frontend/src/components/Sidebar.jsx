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
    <div className="w-64 h-screen bg-green-900 text-white flex flex-col sticky top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold">SmartSeason</h1>
        <p className="text-green-300 text-sm">Field Monitoring</p>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
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

        {user?.role === 'admin' && (
          <NavLink
            to="/agents"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${isActive ? 'bg-green-700' : 'hover:bg-green-800'}`
            }
          >
            Agents
          </NavLink>
        )}

        {user?.role === 'agent' && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${isActive ? 'bg-green-700' : 'hover:bg-green-800'}`
            }
          >
            My Profile
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-green-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  )
}