import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

import RequireAuth       from './components/layout/RequireAuth'
import AppLayout         from './components/layout/AppLayout'

import LoginPage         from './pages/LoginPage'
import SignupPage        from './pages/SignupPage'
import DashboardPage     from './pages/DashboardPage'
import ProductsPage      from './pages/ProductsPage'
import CreateProductPage from './pages/CreateProductPage'
import ProductDetailPage from './pages/ProductDetailPage'
import SettingsPage      from './pages/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* public */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* protected */}
          <Route element={<RequireAuth />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"       element={<DashboardPage />} />
              <Route path="/products"        element={<ProductsPage />} />
              <Route path="/products/new"    element={<CreateProductPage />} />
              <Route path="/products/:id"    element={<ProductDetailPage />} />
              <Route path="/settings"        element={<SettingsPage />} />
            </Route>
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#181c23',
            color: '#e2e6f0',
            border: '1px solid #232832',
            fontSize: '13px',
            fontFamily: 'Geist, sans-serif',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#181c23' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#181c23' } },
        }}
      />
    </AuthProvider>
  )
}
