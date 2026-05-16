import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDashboard } from '../hooks/useDashboard'
import { type RestaurantTable, type TableStatus, TABLE_STATUS_LABEL, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from '../types'

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const TABLE_STYLE: Record<TableStatus, string> = {
  FREE:         'bg-green-50  border-green-200  text-green-800  hover:border-green-400',
  OCCUPIED:     'bg-blue-50   border-blue-200   text-blue-800',
  WAITING_BILL: 'bg-amber-50  border-amber-300  text-amber-800',
  CLEANING:     'bg-red-50    border-red-200    text-red-800',
}
const TABLE_DOT: Record<TableStatus, string> = {
  FREE: 'bg-green-400', OCCUPIED: 'bg-blue-400', WAITING_BILL: 'bg-amber-400', CLEANING: 'bg-red-400',
}
const STATUS_CYCLE: TableStatus[] = ['FREE', 'OCCUPIED', 'WAITING_BILL', 'CLEANING']

const METRICS = [
  { key: 'occ',     label: 'Ocupadas',    icon: '🪑', color: 'border-l-blue-500' },
  { key: 'free',    label: 'Livres',      icon: '✅', color: 'border-l-green-500' },
  { key: 'orders',  label: 'Pedidos',     icon: '📋', color: 'border-l-amber-500' },
  { key: 'revenue', label: 'Faturamento', icon: '💰', color: 'border-l-indigo-500' },
]

function TableTile({ table, onUpdate }: { table: RestaurantTable; onUpdate: (id: number, s: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-150 ${TABLE_STYLE[table.status]}`}
      >
        <span className="font-bold text-xl">{table.number}</span>
        <div className="flex items-center gap-1 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full ${TABLE_DOT[table.status]}`} />
          <span className="text-xs opacity-70">{table.capacity}p</span>
        </div>
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden w-36">
          <p className="text-xs font-semibold text-gray-400 px-3 py-2 border-b border-gray-100">Alterar status</p>
          {STATUS_CYCLE.filter((s) => s !== table.status).map((s) => (
            <button
              key={s}
              onClick={() => { onUpdate(table.id, s); setOpen(false) }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <span className={`w-2 h-2 rounded-full ${TABLE_DOT[s]}`} />
              {TABLE_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const username = useAuthStore((s) => s.username)
  const { tables, orders, loading, metrics, updateTableStatus } = useDashboard()

  const metricValues: Record<string, string> = {
    occ:     `${metrics.occupied} / ${metrics.total}`,
    free:    metrics.free.toString(),
    orders:  metrics.activeOrders.toString(),
    revenue: fmt(metrics.revenue),
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-bold text-gray-900 leading-none">Gerência</p>
              <p className="text-xs text-gray-400">Visão em tempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{username}</span>
            <button onClick={() => { logout(); navigate('/') }} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Sair →</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {METRICS.map((m) => (
            <div key={m.key} className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${m.color} p-4`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{m.label}</p>
                <span className="text-lg">{m.icon}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{metricValues[m.key]}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Table Map */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Mapa de mesas</h2>
              <p className="text-xs text-gray-400">Clique para alterar status</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {tables.map((t) => (
                  <TableTile key={t.id} table={t} onUpdate={updateTableStatus} />
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
              {(Object.entries(TABLE_STATUS_LABEL) as [TableStatus, string][]).map(([s, label]) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${TABLE_DOT[s]}`} />
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Pedidos ativos</h2>
              <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto max-h-80">
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-10">Nenhum pedido em aberto</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        Mesa {order.tableNumber}
                        <span className="text-gray-400 font-normal ml-1 text-xs">#{order.id}</span>
                      </p>
                      <p className="text-xs text-gray-400">{order.items.length} itens · {fmt(order.total)}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_STYLE[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}