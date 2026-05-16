import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MesaState {
  tableId: number | null
  tableNumber: number | null
  setTable: (tableId: number, tableNumber: number) => void
  clear: () => void
}

export const useMesaStore = create<MesaState>()(
  persist(
    (set) => ({
      tableId: null,
      tableNumber: null,
      setTable: (tableId, tableNumber) => set({ tableId, tableNumber }),
      clear: () => set({ tableId: null, tableNumber: null }),
    }),
    { name: 'mesa-storage' }
  )
)