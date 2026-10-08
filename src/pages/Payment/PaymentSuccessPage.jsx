import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import OrderService from '@/services/orderService'
import PaymentService from '@/services/paymentService'

export default function PaymentSuccessPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    let cancelled = false
    OrderService.getById(orderId).then((data) => { if (!cancelled) setOrder(data) }).catch(() => {})
    PaymentService.getByOrder(orderId).then((data) => { if (!cancelled) setPayment(data) }).catch(() => {})
    return () => { cancelled = true }
  }, [orderId])

  // Prefer the real PaymentResponseDTO.amount; fall back to the order total
  // if the payment record hasn't loaded (or that endpoint isn't ready yet).
  const amount = payment?.amount ?? order?.totalAmount

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-farm-50 text-farm-500">
            <CheckCircle2 className="h-11 w-11" />
          </span>
        </motion.div>

        <h1 className="mt-6 font-display text-3xl font-semibold text-farm-900">Payment Successful</h1>
        <p className="mt-2 text-sm text-ink/60">Your order has been placed and confirmed.</p>

        <Card className="mt-8 w-full p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-ink/50">Order</span>
            <span className="font-mono font-medium text-ink">{order?.orderNumber ?? order?.id ?? orderId}</span>
          </div>
          {amount != null && (
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-ink/50">Amount paid</span>
              <span className="font-semibold text-farm-900">₹{Number(amount).toFixed(2)}</span>
            </div>
          )}
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-ink/50">Order status</span>
            <span className="font-medium text-farm-600">{order?.orderStatus || 'Placed'}</span>
          </div>
        </Card>

        <div className="mt-8 flex w-full gap-3">
          <Link to={`/orders/${orderId}`} className="flex-1">
            <Button variant="outline" className="w-full">View Order</Button>
          </Link>
          <Link to="/products" className="flex-1">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
