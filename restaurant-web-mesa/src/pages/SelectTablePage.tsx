import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import type { RestaurantTable } from '../types'
import { useMesaStore } from '../store/mesaStore'

const STATUS_STYLE: Record<string, string> = {
  FREE:         'bg-white border-2 border-amber-400 hover:border-amber-500 hover:shadow-md cursor-pointer',
  OCCUPIED:     'bg-gray-100 border-2 border-gray-200 opacity-60 cursor-not-allowed',
  WAITING_BILL: 'bg-yellow-50 border-2 border-yellow-300 opacity-60 cursor-not-allowed',
  CLEANING:     'bg-red-50 border-2 border-red-200 opacity-60 cursor-not-allowed',
}
const STATUS_LABEL: Record<string, string> = {
  FREE: 'Disponível', OCCUPIED: 'Ocupada', WAITING_BILL: 'Conta', CLEANING: 'Limpeza',
}
const STATUS_DOT: Record<string, string> = {
  FREE: 'bg-green-400', OCCUPIED: 'bg-blue-400', WAITING_BILL: 'bg-yellow-400', CLEANING: 'bg-red-400',
}

function Skeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-2xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  )
}

export default function SelectTablePage() {
  const navigate = useNavigate()
  const setTable = useMesaStore((s) => s.setTable)

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ['tables'],
    queryFn: () => api.get<RestaurantTable[]>('/tables').then((r) => r.data),
  })

  const handleSelect = (table: RestaurantTable) => {
    if (table.status !== 'FREE') return
    setTable(table.id, table.number)
    navigate('/menu')
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-5">
      {/* Logo / Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 shadow-lg mb-4">
          <span className="text-3xl">🍽️</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bem-vindo!</h1>
        <p className="text-gray-500 mt-1">Toque na sua mesa para começar</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-6 w-full max-w-sm">
        {isLoading ? <Skeleton /> : (
          <div className="grid grid-cols-3 gap-3">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleSelect(table)}
                disabled={table.status !== 'FREE'}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-150 ${STATUS_STYLE[table.status]}`}
              >
                <span className="text-2xl font-bold text-gray-800">{table.number}</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[table.status]}`} />
                  <span className="text-xs text-gray-500">{STATUS_LABEL[table.status]}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        <p className="text-center text-xs text-gray-400 mt-5">
          Mesas em cinza já estão em uso
        </p>
      </div>
    </div>
  )
}