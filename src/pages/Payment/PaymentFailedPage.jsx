import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function PaymentFailedPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-20 text-center">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle className="h-11 w-11" />
          </span>
        </motion.div>

        <h1 className="mt-6 font-display text-3xl font-semibold text-farm-900">Payment Failed</h1>
        <p className="mt-2 text-sm text-ink/60">Something went wrong while processing your payment. Your order hasn't been lost.</p>

        <Card className="mt-8 w-full p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-ink/50">Order ID</span>
            <span className="font-mono font-medium text-ink">{orderId}</span>
          </div>
        </Card>

        <div className="mt-8 flex w-full flex-col gap-3">
          <Button className="w-full" onClick={() => navigate(`/payment/${orderId}`)}>
            Retry Payment
          </Button>
          <div className="flex gap-3">
            <Link to={`/orders/${orderId}`} className="flex-1">
              <Button variant="outline" className="w-full">Back to Order</Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button variant="ghost" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
