import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Smartphone, CreditCard, Banknote, ArrowLeft, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import OrderService from '@/services/orderService'
import PaymentService from '@/services/paymentService'

// ⚠️ PaymentMethod enum values are ASSUMED — your PaymentCreateRequestDTO
// declares `private PaymentMethod paymentMethod;` but the enum's actual
// constants weren't provided. UPI / CARD / COD are a guess matching your
// original spec's payment method list. If your real enum uses different
// names (e.g. CASH_ON_DELIVERY, CREDIT_CARD), update the `value` fields
// below to match exactly, or this will fail deserialization server-side.
const methods = [
  { value: 'UPI', label: 'UPI', icon: Smartphone, desc: 'Pay via any UPI app' },
  { value: 'CARD', label: 'Card', icon: CreditCard, desc: 'Debit or credit card' },
  { value: 'COD', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when it arrives' },
]

export default function PaymentPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [method, setMethod] = useState('UPI')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await OrderService.getById(orderId)
        if (!cancelled) setOrder(data)
      } catch {
        if (!cancelled) setError('Could not load this order.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [orderId])

 const handlePay = async () => {
  setPaying(true)

  try {
    const payment = await PaymentService.create({
      orderId: Number(orderId),
      paymentMethod: method,
    })

    toast.success('Payment successful!')

    navigate(`/payment/success/${orderId}`)
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      'Payment failed. Please try again.'

    toast.error(msg)

    navigate(`/payment/failed/${orderId}`)
  } finally {
    setPaying(false)
  }
}
  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="skeleton h-64 w-full rounded-xl2" />
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
          <Link to="/orders" className="mt-2 text-sm font-medium text-farm-600 hover:underline">
            Go to my orders
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link to="/checkout" className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-farm-600">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between border-b border-line pb-5">
              <div>
                <p className="text-xs text-ink/50">Order</p>
                <p className="font-mono text-sm font-medium text-ink">{order.orderNumber ?? order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink/50">Amount to pay</p>
                <p className="font-display text-2xl font-semibold text-farm-900">₹{Number(order.totalAmount ?? 0).toFixed(2)}</p>
              </div>
            </div>

            <h2 className="mt-6 font-display text-lg font-semibold text-farm-900">Choose a payment method</h2>
            <div className="mt-4 space-y-3">
              {methods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMethod(m.value)}
                  className={`flex w-full items-center gap-4 rounded-xl2 border p-4 text-left transition-colors ${
                    method === m.value ? 'border-farm-500 bg-farm-50' : 'border-line hover:border-farm-300'
                  }`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-farm-600 shadow-soft">
                    <m.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{m.label}</p>
                    <p className="text-xs text-ink/50">{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <Button size="lg" className="mt-8 w-full" loading={paying} onClick={handlePay}>
              Pay Now
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/40">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure payment
            </p>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
