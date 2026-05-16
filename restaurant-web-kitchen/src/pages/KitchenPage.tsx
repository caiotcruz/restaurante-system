import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useKitchenOrders } from '../hooks/useKitchenOrders'
import { type Order, NEXT_LABEL, NEXT_STATUS } from '../types'

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  return m < 1 ? 'agora' : `${m}min`
}

const COL_STYLE: Record<string, { header: string; badge: string; btn: string }> = {
  new:  { header: 'bg-blue-600',   badge: 'bg-blue-100 text-blue-700',   btn: 'bg-blue-500 hover:bg-blue-600' },
  prep: { header: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', btn: 'bg-orange-500 hover:bg-orange-600' },
  done: { header: 'bg-green-600',  badge: 'bg-green-100 text-green-700',  btn: 'bg-green-500 hover:bg-green-600' },
}

function OrderCard({ order, onUpdate, colKey }: { order: Order; onUpdate: (id: number, s: string) => void; colKey: string }) {
  const next = NEXT_STATUS[order.status]
  const elapsed = timeAgo(order.createdAt)
  const isUrgent = order.status === 'PENDING' && Date.now() - new Date(order.createdAt).getTime() > 5 * 60000
  const style = COL_STYLE[colKey]

  return (
    <div className={`bg-zinc-800 rounded-xl border ${isUrgent ? 'border-red-500' : 'border-zinc-700'} p-3 fade-in`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">Mesa {order?.tableNumber ?? order.tableNumber}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>#{order.id}</span>
        </div>
        <span className={`text-xs font-medium ${isUrgent ? 'text-red-400' : 'text-zinc-400'}`}>
          {isUrgent ? '⚠ ' : '⏱ '}{elapsed}
        </span>
      </div>

      <div className="space-y-1 mb-3">
        {order.items.map((item) => (
          <div key={item.id} className="flex gap-2 items-start">
            <span className="inline-flex items-center justify-center min-w-[22px] h-5 bg-zinc-700 text-zinc-300 text-xs font-bold rounded px-1">
              {item.quantity}×
            </span>
            <div>
              <p className="text-sm text-zinc-100 leading-tight">{item.menuItemName}</p>
              {item.observations && (
                <p className="text-xs text-amber-400 italic">→ {item.observations}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {order.observations && (
        <p className="text-xs text-zinc-400 italic bg-zinc-900 rounded-lg px-2.5 py-1.5 mb-2">
          📝 {order.observations}
        </p>
      )}

      {next && (
        <button
          onClick={() => onUpdate(order.id, next)}
          className={`w-full text-white text-xs font-bold py-2 rounded-lg transition-colors ${style.btn}`}
        >
          {NEXT_LABEL[order.status]}
        </button>
      )}
    </div>
  )
}

const COLUMNS = [
  { key: 'new',  label: '🆕 Novos',     statuses: ['PENDING', 'RECEIVED'] },
  { key: 'prep', label: '🍳 Preparando', statuses: ['PREPARING'] },
  { key: 'done', label: '✅ Prontos',    statuses: ['READY'] },
] as const

export default function KitchenPage() {
  const navigate = useNavigate()
  const logout = useAuthStore((s) => s.logout)
  const username = useAuthStore((s) => s.username)
  const { orders, loading, updateStatus, soundEnabled, setSoundEnabled } = useKitchenOrders()
  const active = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED')

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-5 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍳</span>
            <div>
              <p className="text-white font-bold leading-none">Cozinha</p>
              <p className="text-zinc-400 text-xs">{active.length} pedido{active.length !== 1 ? 's' : ''} ativo{active.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${soundEnabled ? 'border-amber-500 text-amber-400' : 'border-zinc-700 text-zinc-500'}`}
            >
              {soundEnabled ? '🔔 Som' : '🔕 Mudo'}
            </button>
            <span className="text-zinc-500 text-sm">{username}</span>
            <button onClick={() => { logout(); navigate('/') }} className="text-zinc-500 hover:text-white text-sm transition-colors">
              Sair →
            </button>
          </div>
        </div>
      </header>

      {/* Columns */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-3 overflow-hidden">
          {COLUMNS.map((col) => {
            const colOrders = orders.filter((o) => (col.statuses as readonly string[]).includes(o.status))
            const style = COL_STYLE[col.key]
            return (
              <div key={col.key} className="flex flex-col border-r border-zinc-800 last:border-r-0 overflow-hidden">
                <div className={`${style.header} px-4 py-2.5 flex-shrink-0 flex items-center justify-between`}>
                  <span className="text-white font-bold text-sm">{col.label}</span>
                  <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {colOrders.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {colOrders.length === 0 ? (
                    <p className="text-zinc-600 text-sm text-center py-8">Vazio</p>
                  ) : (
                    colOrders.map((o) => (
                      <OrderCard key={o.id} order={o} onUpdate={updateStatus} colKey={col.key} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}