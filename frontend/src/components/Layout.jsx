import { useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../store/auth'

export default function Layout({ children }) {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 transform transition-transform duration-200 lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b px-4 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              ☰
            </button>
            <h2 className="text-lg lg:text-xl font-semibold">Welcome, {user?.username}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-700 text-sm font-medium">{user?.username}</span>
              <span className="text-gray-400 text-xs capitalize">{user?.role}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}