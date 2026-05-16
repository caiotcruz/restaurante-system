import { create } from 'zustand'

export interface CartItem {
  menuItemId: number
  name: string
  price: number
  quantity: number
  observations: string
}

interface CartState {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'observations'>) => void
  removeItem: (menuItemId: number) => void
  updateQuantity: (menuItemId: number, qty: number) => void
  updateObservations: (menuItemId: number, obs: string) => void
  clearCart: () => void
  total: () => number
  count: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.menuItemId === item.menuItemId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItemId === item.menuItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { ...item, quantity: 1, observations: '' }] }
    }),

  removeItem: (menuItemId) =>
    set((state) => ({ items: state.items.filter((i) => i.menuItemId !== menuItemId) })),

  updateQuantity: (menuItemId, qty) =>
    set((state) => ({
      items:
        qty <= 0
          ? state.items.filter((i) => i.menuItemId !== menuItemId)
          : state.items.map((i) =>
              i.menuItemId === menuItemId ? { ...i, quantity: qty } : i
            ),
    })),

  updateObservations: (menuItemId, obs) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, observations: obs } : i
      ),
    })),

  clearCart: () => set({ items: [] }),

  total: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  count: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}))