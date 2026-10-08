import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PackageSearch, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import OrderService from '@/services/orderService'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await OrderService.myOrders()
        if (!cancelled) setOrders(Array.isArray(data) ? data : data?.content ?? data?.items ?? [])
      } catch {
        if (!cancelled) setError('Could not load your orders right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold text-farm-900">My orders</h1>

        {loading && (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-28 w-full" />)}
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 rounded-xl2 border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-farm-50 text-farm-500">
              <PackageSearch className="h-7 w-7" />
            </span>
            <p className="mt-4 font-medium text-ink/70">You haven't placed any orders yet.</p>
            <Link to="/products"><Button className="mt-4">Browse the marketplace</Button></Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
              >
                <Link to={`/orders/${order.id}`}>
                  <Card className="flex flex-col gap-4 p-5 transition-shadow hover:shadow-lift sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-mono text-sm font-medium text-ink">{order.orderNumber ?? `Order #${order.id}`}</p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {order.orderedAt ? new Date(order.orderedAt).toLocaleDateString() : ''} · {order.items?.length ?? 0} item{(order.items?.length ?? 0) === 1 ? '' : 's'}
                        {order.farmerName ? ` · from ${order.farmerName}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-farm-50 px-3 py-1 text-xs font-medium text-farm-700">
                        {order.orderStatus}
                      </span>
                      <span className="font-display text-lg font-semibold text-farm-900">₹{Number(order.totalAmount ?? 0).toFixed(2)}</span>
                      <ChevronRight className="h-4 w-4 text-ink/30" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
