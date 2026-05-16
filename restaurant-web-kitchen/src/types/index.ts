export type OrderStatus =
  | 'PENDING'
  | 'RECEIVED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'

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

export const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING:   'PREPARING',
  RECEIVED:  'PREPARING',
  PREPARING: 'READY',
  READY:     'DELIVERED',
}

export const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  PENDING:   '🍳 Iniciar preparo',
  RECEIVED:  '🍳 Iniciar preparo',
  PREPARING: '✅ Marcar como pronto',
  READY:     '🛎️ Confirmar entrega',
}

export const STATUS_BG: Record<string, string> = {
  PENDING:   'bg-gray-50 border-gray-200',
  RECEIVED:  'bg-blue-50 border-blue-200',
  PREPARING: 'bg-orange-50 border-orange-200',
  READY:     'bg-green-50 border-green-300',
}