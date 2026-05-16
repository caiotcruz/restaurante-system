import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useMesaStore } from './store/mesaStore'
import SelectTablePage from './pages/SelectTablePage'
import MenuPage from './pages/MenuPage'
import CartPage from './pages/CartPage'
import OrderStatusPage from './pages/OrderStatusPage'

function MesaRoute({ children }: { children: React.ReactNode }) {
  const tableId = useMesaStore((s) => s.tableId)
  return tableId ? <>{children}</> : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SelectTablePage />} />
        <Route path="/menu" element={<MesaRoute><MenuPage /></MesaRoute>} />
        <Route path="/cart" element={<MesaRoute><CartPage /></MesaRoute>} />
        <Route path="/status" element={<MesaRoute><OrderStatusPage /></MesaRoute>} />
      </Routes>
    </BrowserRouter>
  )
}