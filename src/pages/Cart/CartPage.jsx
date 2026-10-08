import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, Tag, ArrowRight, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useCart } from '@/contexts/CartContext'

const DELIVERY_FEE = 40
const FREE_DELIVERY_THRESHOLD = 500

export default function CartPage() {
  const { items, loading, subtotal, updateItem, removeItem } = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const navigate = useNavigate()

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const total = subtotal + delivery - discount

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'FRESH10') {
      setCouponApplied(true)
      toast.success('Coupon applied — 10% off')
    } else {
      toast.error('Invalid coupon code')
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display text-3xl font-semibold text-farm-900">Your cart</h1>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-28 w-full" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-farm-50 text-farm-500">
              <ShoppingBag className="h-7 w-7" />
            </span>
            <p className="mt-4 font-medium text-ink/70">Your cart is empty.</p>
            <Link to="/products">
              <Button className="mt-4">Browse the marketplace</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Items */}
            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item) => {
                  const product = item.product ?? item
                  return (
                    <motion.div
                      key={item.id ?? product.id}
                      layout
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Card className="flex items-center gap-4 p-4">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-farm-50">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">🌿</div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-ink">{product.name}</p>
                          <p className="text-xs text-ink/50">{product.farmerName || 'Local farm'}</p>
                          <p className="mt-1 font-display text-lg font-semibold text-farm-900">₹{item.price ?? product.price}</p>
                        </div>
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            onClick={() => updateItem({ cartItemId: item.id, quantity: Math.max(1, (item.quantity ?? 1) - 1) })}
                            className="p-2.5 text-ink/60 hover:text-farm-600"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{item.quantity ?? 1}</span>
                          <button
                            onClick={() => updateItem({ cartItemId: item.id, quantity: (item.quantity ?? 1) + 1 })}
                            className="p-2.5 text-ink/60 hover:text-farm-600"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="p-2 text-ink/40 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <Card className="h-fit p-6">
              <h2 className="font-display text-lg font-semibold">Order summary</h2>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-full border border-line px-3 py-2">
                  <Tag className="h-4 w-4 text-ink/40" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={applyCoupon}>Apply</Button>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-ink/70">
                  <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-farm-600">
                    <span>Discount (FRESH10)</span><span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink/70">
                  <span>Delivery</span><span>{delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}</span>
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-ink/40">Free delivery on orders over ₹{FREE_DELIVERY_THRESHOLD}</p>
                )}
                <div className="flex justify-between border-t border-line pt-3 font-display text-lg font-semibold text-farm-900">
                  <span>Total</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button size="lg" className="mt-6 w-full" onClick={() => navigate('/checkout')}>
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
