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
}

export interface Order {
  id: number
  tableId: number
  tableNumber: number
  status: OrderStatus
  items: OrderItemDto[]
  total: number
  createdAt: string
}

export interface RestaurantTable {
  id: number
  number: number
  capacity: number
  status: TableStatus
}

export const TABLE_STATUS_LABEL: Record<TableStatus, string> = {
  FREE:         'Livre',
  OCCUPIED:     'Ocupada',
  WAITING_BILL: 'Fechando conta',
  CLEANING:     'Limpeza',
}

export const TABLE_STATUS_STYLE: Record<TableStatus, string> = {
  FREE:         'bg-green-50 border-green-200 text-green-800',
  OCCUPIED:     'bg-blue-50 border-blue-200 text-blue-800',
  WAITING_BILL: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  CLEANING:     'bg-red-50 border-red-200 text-red-700',
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING:   'Aguardando',
  RECEIVED:  'Recebido',
  PREPARING: 'Em preparo',
  READY:     'Pronto',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
}

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING:   'bg-gray-100 text-gray-600',
  RECEIVED:  'bg-blue-100 text-blue-700',
  PREPARING: 'bg-orange-100 text-orange-700',
  READY:     'bg-green-100 text-green-700',
  DELIVERED: 'bg-gray-100 text-gray-400',
  CANCELLED: 'bg-red-100 text-red-600',
}