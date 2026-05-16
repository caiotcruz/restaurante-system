import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMesaStore } from '../store/mesaStore'
import { useCartStore } from '../store/cartStore'
import api from '../api/client'

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function CartPage() {
  const navigate = useNavigate()
  const { tableId, tableNumber } = useMesaStore()
  const { items, removeItem, updateQuantity, updateObservations, clearCart, total } = useCartStore()
  const [obs, setObs] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    if (!tableId || items.length === 0) return
    setLoading(true); setError('')
    try {
      await api.post('/orders', {
        tableId,
        observations: obs || null,
        items: items.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity, observations: i.observations || null })),
      })
      clearCart()
      navigate('/status')
    } catch {
      setError('Falha ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-4xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-900">Carrinho vazio</h2>
        <p className="text-gray-400 mt-1 mb-6 text-sm">Adicione itens do cardápio</p>
        <button onClick={() => navigate('/menu')} className="bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl">
          Ver cardápio
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate('/menu')} className="text-amber-500 font-semibold text-sm">← Voltar</button>
        <div>
          <p className="font-bold text-gray-900 leading-none">Seu pedido</p>
          <p className="text-xs text-gray-400">Mesa {tableNumber}</p>
        </div>
      </header>

      <div className="max-w-xl mx-auto p-4 space-y-3">
        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {items.map((item) => (
            <div key={item.menuItemId} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-amber-600 font-bold text-sm mt-0.5">{fmt(item.price * item.quantity)}</p>
                </div>
                <button onClick={() => removeItem(item.menuItemId)} className="text-gray-300 hover:text-red-400 text-xl leading-none transition-colors">×</button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2 py-1">
                  <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="w-7 h-7 rounded-lg hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center transition-colors">−</button>
                  <span className="w-5 text-center font-bold text-gray-900">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center transition-colors">+</button>
                </div>
              </div>
              <input
                value={item.observations}
                onChange={(e) => updateObservations(item.menuItemId, e.target.value)}
                placeholder="Obs: sem cebola, bem passado..."
                className="mt-2 w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-300 placeholder-gray-300"
              />
            </div>
          ))}
        </div>

        {/* Obs geral */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Observações gerais</p>
          <textarea
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            placeholder="Alguma alergia ou preferência?"
            rows={2}
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-300 resize-none placeholder-gray-300"
          />
        </div>

        {/* Total */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-sm">{items.reduce((s, i) => s + i.quantity, 0)} itens</span>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900">{fmt(total())}</p>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-sm"
        >
          {loading ? 'Enviando...' : '🍳 Enviar para a cozinha'}
        </button>
      </div>
    </div>
  )
}