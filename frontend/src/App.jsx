import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Fields from './pages/Fields'
import FieldDetail from './pages/FieldDetail'
import CreateField from './pages/CreateField'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/fields" element={<PrivateRoute><Fields /></PrivateRoute>} />
      <Route path="/fields/:id" element={<PrivateRoute><FieldDetail /></PrivateRoute>} />
      <Route path="/fields/create" element={<PrivateRoute><CreateField /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}
