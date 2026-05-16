export interface Category {
  id: number
  name: string
  displayOrder: number
}

export interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  imageUrl?: string
  prepTimeMinutes: number
  available: boolean
  category: Category
}

export type OrderStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'

export type TableStatus = 'FREE' | 'OCCUPIED' | 'WAITING_BILL' | 'CLEANING'

export interface OrderItemDto {
  id: number
  menuItemName: string
  quantity: number
  unitPrice: number
  subtotal: number
  observations?: string
}

export interface Order {
  id: number
  tableId: number
  tableNumber: number
  status: OrderStatus
  items: OrderItemDto[]
  total: number
  observations?: string
  createdAt: string
}

export interface RestaurantTable {
  id: number
  number: number
  capacity: number
  status: TableStatus
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   'Aguardando',
  RECEIVED:  'Recebido',
  PREPARING: 'Em preparo',
  READY:     'Pronto! 🎉',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export const STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING:   'bg-gray-100 text-gray-600',
  RECEIVED:  'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  READY:     'bg-green-100 text-green-700',
  DELIVERED: 'bg-gray-100 text-gray-400',
  CANCELLED: 'bg-red-100 text-red-700',
}

export const ORDER_STEPS: OrderStatus[] = [
  'PENDING', 'RECEIVED', 'PREPARING', 'READY', 'DELIVERED',
]