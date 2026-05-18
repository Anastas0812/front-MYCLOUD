import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StoragePage from './pages/StoragePage'
import AdminPage from './pages/AdminPage'
import { useAppSelector } from './store/hooks'
import type { ReactNode } from 'react'


//если не залогинен, отправляем логиниться
function PrivateRoute({ children } : { children: ReactNode}) {
  const { isAuthenticated } = useAppSelector(state => state.user)
  return isAuthenticated ? children : <Navigate to="/login" />
}

// маршрут админа
function AdminRoute({ children } : { children: ReactNode}) {
  const { isAdmin } = useAppSelector(state => state.user)
  return isAdmin ? children : <Navigate to="/storage" />
}


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/storage" element={
          <PrivateRoute>
            <StoragePage />
          </PrivateRoute>
        } />

        <Route path="/storage/:userId" element={
          <AdminRoute>
            <StoragePage />
          </AdminRoute>
          } />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>  
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
