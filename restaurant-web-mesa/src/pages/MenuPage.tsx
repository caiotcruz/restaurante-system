import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import type { MenuItem } from '../types'
import { useCartStore } from '../store/cartStore'
import { useMesaStore } from '../store/mesaStore'

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function ItemCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  const qty = useCartStore(s => s.items.find(i => i.menuItemId === item.id)?.quantity ?? 0)
  const update = useCartStore(s => s.updateQuantity)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 fade-in">
      {/* Icon placeholder */}
      <div className="w-16 h-16 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 text-2xl">
        {item.category.name === 'Bebidas' ? '🥤' :
         item.category.name === 'Sobremesas' ? '🍮' :
         item.category.name === 'Entradas' ? '🥗' : '🍽️'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 leading-tight">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-amber-600 font-bold">{fmt(item.price)}</span>
            <span className="text-xs text-gray-400 ml-1.5">· {item.prepTimeMinutes}min</span>
          </div>

          {qty === 0 ? (
            <button
              onClick={onAdd}
              className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg flex items-center justify-center transition-colors shadow-sm"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => update(item.id, qty - 1)}
                className="w-7 h-7 rounded-full border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold flex items-center justify-center transition-colors"
              >
                −
              </button>
              <span className="w-4 text-center font-bold text-gray-900">{qty}</span>
              <button
                onClick={onAdd}
                className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const navigate = useNavigate()
  const tableNumber = useMesaStore((s) => s.tableNumber)
  const { addItem, count, total } = useCartStore()
  const [cat, setCat] = useState('Todos')

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: () => api.get<MenuItem[]>('/menu').then((r) => r.data),
  })

  const categories = ['Todos', ...Array.from(new Set(items.map((i) => i.category.name)))]
  const filtered = cat === 'Todos' ? items : items.filter((i) => i.category.name === cat)
  const cartCount = count()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-lg">🍽️</div>
            <div>
              <p className="font-bold text-gray-900 leading-none">Cardápio</p>
              <p className="text-xs text-gray-400">Mesa {tableNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/status')}
              className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Meus pedidos
            </button>
            <button
              onClick={() => navigate('/cart')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                cartCount > 0
                  ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
                  : 'bg-gray-100 text-gray-400 cursor-default'
              }`}
            >
              🛒
              {cartCount > 0 && (
                <span className="bg-white text-amber-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Category tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10">
        <div className="flex gap-1 px-4 py-2 overflow-x-auto scrollbar-hide max-w-xl mx-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                cat === c ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 py-4 px-4 max-w-xl mx-auto w-full">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-2">🍽️</p>
            <p>Nenhum item nesta categoria</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onAdd={() => addItem({ menuItemId: item.id, name: item.name, price: item.price })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div className="sticky bottom-0 p-4 bg-gradient-to-t from-gray-50 to-transparent">
          <button
            onClick={() => navigate('/cart')}
            className="w-full max-w-xl mx-auto flex items-center justify-between bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-3.5 rounded-2xl shadow-lg transition-all"
          >
            <span className="bg-amber-600 text-white text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
            <span>Ver carrinho</span>
            <span className="font-bold">{(typeof total === 'function' ? total() : 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </button>
        </div>
      )}
    </div>
  )
}