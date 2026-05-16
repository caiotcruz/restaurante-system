import { useState, useEffect } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { Order, RestaurantTable } from '../types'
import api from '../api/client'

export function useDashboard() {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch inicial
  useEffect(() => {
    Promise.all([
      api.get<RestaurantTable[]>('/tables').then((r) => r.data),
      api.get<Order[]>('/orders/active').then((r) => r.data),
    ])
      .then(([t, o]) => { setTables(t); setOrders(o) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // WebSocket — atualiza orders e mesas em tempo real
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        // Escuta atualizações de pedidos vindas da cozinha
        client.subscribe('/topic/kitchen', (msg) => {
          const order: Order = JSON.parse(msg.body)
          setOrders((prev) => {
            const exists = prev.some((o) => o.id === order.id)
            if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
              return prev.filter((o) => o.id !== order.id)
            }
            if (exists) return prev.map((o) => (o.id === order.id ? order : o))
            return [...prev, order]
          })
        })

        // Escuta mudanças de estado das mesas
        client.subscribe('/topic/tables', (msg) => {
          const updatedTable: RestaurantTable = JSON.parse(msg.body)
          setTables((prev) =>
            prev.map((t) => (t.id === updatedTable.id ? updatedTable : t))
          )
        })
      },
      reconnectDelay: 3000,
    })
    client.activate()
    return () => { client.deactivate() }
  }, [])

  const updateTableStatus = async (tableId: number, status: string) => {
    await api.patch(`/tables/${tableId}/status?status=${status}`)
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: status as any } : t))
    )
  }

  // Métricas calculadas
  const metrics = {
    total:       tables.length,
    occupied:    tables.filter((t) => t.status === 'OCCUPIED').length,
    free:        tables.filter((t) => t.status === 'FREE').length,
    activeOrders: orders.length,
    revenue:     orders.reduce((s, o) => s + o.total, 0),
  }

  return { tables, orders, loading, metrics, updateTableStatus }
}