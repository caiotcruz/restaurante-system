import { useState, useEffect } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { Order } from '../types'
import api from '../api/client'

export function useOrderStatus(tableId: number | null) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tableId) return
    api
      .get<Order[]>(`/orders/table/${tableId}`)
      .then((r) => setOrders(r.data.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED')))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [tableId])

  useEffect(() => {
    if (!tableId) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe(`/topic/orders/${tableId}`, (msg) => {
          const updated: Order = JSON.parse(msg.body)
          setOrders((prev) => {
            const exists = prev.some((o) => o.id === updated.id)
            if (exists) {
              return prev.map((o) => (o.id === updated.id ? updated : o))
            }
            return [...prev, updated]
          })
        })
      },
      onDisconnect: () => console.log('[WS] Desconectado da mesa', tableId),
      reconnectDelay: 3000,
    })

    client.activate()
    return () => { client.deactivate() }
  }, [tableId])

  return { orders, loading }
}