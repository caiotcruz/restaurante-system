import { useState, useEffect } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import type { Order } from '../types'
import api from '../api/client'

export function useKitchenOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Busca pedidos ativos ao montar
  useEffect(() => {
    api.get<Order[]>('/orders/active')
      .then((r) => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // WebSocket — escuta novos pedidos e atualizações
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        console.log('[WS] Cozinha conectada')
        client.subscribe('/topic/kitchen', (msg) => {
          const order: Order = JSON.parse(msg.body)

          // Toca um alerta sonoro para novos pedidos
          if (soundEnabled && (order.status === 'PENDING' || order.status === 'RECEIVED')) {
            const ctx = new AudioContext()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = 880
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
            osc.start()
            osc.stop(ctx.currentTime + 0.4)
          }

          setOrders((prev) => {
            const exists = prev.some((o) => o.id === order.id)
            if (exists) {
              if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
                return prev.filter((o) => o.id !== order.id)
              }
              return prev.map((o) => (o.id === order.id ? order : o))
            }
            return [...prev, order]
          })
        })
      },
      reconnectDelay: 3000,
    })
    client.activate()
    return () => { client.deactivate() }
  }, [soundEnabled])

  const updateStatus = async (orderId: number, newStatus: string) => {
    await api.patch(`/orders/${orderId}/status`, { status: newStatus })
    // o WebSocket vai atualizar o estado automaticamente via /topic/kitchen
  }

  return { orders, loading, updateStatus, soundEnabled, setSoundEnabled }
}