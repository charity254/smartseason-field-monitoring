import Sidebar from './Sidebar'
import { useAuth } from '../store/auth'

export default function Layout({ children }) {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Welcome, {user?.username}</h2>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-700 text-sm font-medium">{user?.username}</span>
              <span className="text-gray-400 text-xs capitalize">{user?.role}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}