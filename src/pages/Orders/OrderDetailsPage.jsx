import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Package, Truck, CreditCard, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import OrderService from '@/services/orderService'

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await OrderService.getById(id)
        console.log("ORDER RESPONSE:", data)
console.log("ORDER ITEMS:", data?.items)
        if (!cancelled) setOrder(data)
      } catch {
        if (!cancelled) setError('Could not load this order.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="skeleton h-72 w-full rounded-xl2" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
          <p className="font-medium text-ink/70">{error || 'Order not found.'}</p>
          <Link to="/orders" className="mt-2 text-sm font-medium text-farm-600 hover:underline">Back to my orders</Link>
        </div>
        <Footer />
      </div>
    )
  }

  // AddressResponseDTO's own field names weren't provided (only that
  // OrderResponseDTO.deliveryAddress is of that type) — read defensively
  // here with common fallbacks until you confirm the exact shape.
  const address = order.deliveryAddress
  const addressLine = address?.addressLine ?? address?.line1 ?? address?.street
  const addressName = address?.fullName ?? address?.name
  const addressPhone = address?.phone ?? address?.phoneNumber

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/orders" className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-farm-600">
          <ArrowLeft className="h-4 w-4" /> Back to my orders
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold text-farm-900">{order.orderNumber ?? `Order #${order.id}`}</h1>
              {order.orderedAt && (
                <p className="mt-1 text-sm text-ink/50">Placed on {new Date(order.orderedAt).toLocaleString()}</p>
              )}
              {order.farmerName && (
                <p className="mt-0.5 text-sm text-ink/50">
                  From <Link to={`/farmers/${order.farmerId}`} className="font-medium text-farm-600 hover:underline">{order.farmerName}</Link>
                </p>
              )}
            </div>
            <span className="rounded-full bg-farm-50 px-3 py-1 text-xs font-medium text-farm-700">
              {order.orderStatus}
            </span>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
            {/* Items */}
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-farm-600" />
                <h2 className="font-display text-lg font-semibold text-farm-900">Products</h2>
              </div>
              <div className="mt-4 space-y-4">
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{item.productName}</p>
                      <p className="text-xs text-ink/50">Qty {item.quantity} × ₹{Number(item.unitPrice).toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-semibold text-farm-900">₹{Number(item.subtotal).toFixed(2)}</p>
                  </div>
                ))}
                {(!order.items || order.items.length === 0) && <p className="text-sm text-ink/50">No item details available.</p>}
              </div>

              <div className="mt-4 flex justify-between border-t border-line pt-4 font-display text-lg font-semibold text-farm-900">
                <span>Total</span><span>₹{Number(order.totalAmount ?? 0).toFixed(2)}</span>
              </div>
            </Card>

            {/* Delivery + payment */}
            <div className="space-y-6">
              {address && (
                <Card className="p-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-farm-600" />
                    <h2 className="font-display text-base font-semibold text-farm-900">Delivery address</h2>
                  </div>
                  <div className="mt-3 text-sm text-ink/70">
                    {addressName && <p className="font-medium text-ink">{addressName}</p>}
                    {addressLine && <p>{addressLine}</p>}
                    {(address.city || address.state || address.pincode) && (
                      <p>{[address.city, address.state, address.pincode].filter(Boolean).join(', ')}</p>
                    )}
                    {addressPhone && <p className="mt-1">{addressPhone}</p>}
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-farm-600" />
                  <h2 className="font-display text-base font-semibold text-farm-900">Payment</h2>
                </div>
                <p className="mt-3 text-sm text-ink/70">
                  Status: <span className="font-medium text-farm-700">{order.paymentStatus}</span>
                </p>
              </Card>

              <Card className="flex items-start gap-3 p-6">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-farm-600" />
                <div>
                  <h2 className="font-display text-base font-semibold text-farm-900">Estimated delivery</h2>
                  <p className="mt-1 text-sm text-ink/60">Within 24–48 hours of harvest, once shipped.</p>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Link to="/orders" className="flex-1"><Button variant="outline" className="w-full">View My Orders</Button></Link>
            <Link to="/products" className="flex-1"><Button className="w-full">Continue Shopping</Button></Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
