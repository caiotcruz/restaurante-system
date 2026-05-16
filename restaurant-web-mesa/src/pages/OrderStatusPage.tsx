import { useNavigate } from 'react-router-dom'
import { useMesaStore } from '../store/mesaStore'
import { useOrderStatus } from '../hooks/useOrderStatus'
import { type Order, ORDER_STEPS, type OrderStatus, STATUS_COLOR, STATUS_LABEL } from '../types'

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtTime = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

const STEP_ICON: Record<OrderStatus, string> = {
  PENDING: '⏳', RECEIVED: '📋', PREPARING: '🍳', READY: '✅', DELIVERED: '🎉', CANCELLED: '❌',
}

function Timeline({ status }: { status: OrderStatus }) {
  const cur = ORDER_STEPS.indexOf(status)
  return (
    <div className="flex items-center mt-3 mb-1">
      {ORDER_STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
            i < cur  ? 'bg-amber-500 text-white' :
            i === cur ? 'bg-amber-500 text-white ring-4 ring-amber-100' :
                        'bg-gray-100 text-gray-400'
          }`}>
            {i <= cur ? '✓' : i + 1}
          </div>
          {i < ORDER_STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 ${i < cur ? 'bg-amber-400' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  const isReady = order.status === 'READY'
  return (
    <div className={`bg-white rounded-2xl border p-4 fade-in ${isReady ? 'border-green-300 shadow-md' : 'border-gray-100'}`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-400 font-medium">Pedido #{order.id} · {fmtTime(order.createdAt)}</p>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status]}`}>
          {STEP_ICON[order.status]} {STATUS_LABEL[order.status]}
        </span>
      </div>

      <Timeline status={order.status} />

      <div className="mt-3 space-y-1 pt-3 border-t border-gray-50">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.quantity}× {item.menuItemName}</span>
            <span className="text-gray-500">{fmt(item.subtotal)}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-50 mt-1">
          <span>Total</span><span>{fmt(order.total)}</span>
        </div>
      </div>

      {isReady && (
        <div className="mt-3 bg-green-50 border border-green-100 text-green-700 text-sm font-semibold text-center py-2.5 rounded-xl">
          🎉 Seu pedido está pronto! O garçom já vem.
        </div>
      )}
    </div>
  )
}

export default function OrderStatusPage() {
  const navigate = useNavigate()
  const { tableId, tableNumber } = useMesaStore()
  const { orders, loading } = useOrderStatus(tableId)
  const active = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/menu')} className="text-amber-500 font-semibold text-sm">← Cardápio</button>
        <div>
          <p className="font-bold text-gray-900 leading-none">Meus pedidos</p>
          <p className="text-xs text-gray-400">Mesa {tableNumber} · atualização automática</p>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : active.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">🍽️</p>
            <p className="font-bold text-gray-900">Nenhum pedido ativo</p>
            <p className="text-gray-400 text-sm mt-1 mb-6">Faça seu pedido pelo cardápio</p>
            <button onClick={() => navigate('/menu')} className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl">
              Ver cardápio
            </button>
          </div>
        ) : (
          <>
            {active.map((o) => <OrderCard key={o.id} order={o} />)}
            <button
              onClick={() => navigate('/menu')}
              className="w-full border-2 border-amber-400 text-amber-600 font-semibold py-3 rounded-2xl hover:bg-amber-50 transition-colors"
            >
              + Adicionar mais itens
            </button>
          </>
        )}
      </div>
    </div>
  )
}