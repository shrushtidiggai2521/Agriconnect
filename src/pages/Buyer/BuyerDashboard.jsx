import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Wallet,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Leaf,
} from 'lucide-react'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import OrderService from '@/services/orderService'

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await OrderService.myOrders()

        const list = Array.isArray(data)
          ? data
          : data?.content ?? data?.items ?? []

        setOrders(list)
      } catch (error) {
        console.error('Could not load buyer orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount ?? 0),
    0
  )

  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus !== 'DELIVERED' &&
      order.orderStatus !== 'CANCELLED'
  ).length

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === 'DELIVERED'
  ).length

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#fafbf7]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">

                        {/* Profile button */}
        <div className="flex justify-end">
          <Link to="/profile">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-farm-600 text-lg font-semibold text-white">
              S
            </div>
          </Link>
        </div>

        {/* Welcome */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-3xl bg-farm-900 px-7 py-9 sm:px-10"
        >

        
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-farm-700/30" />
          <div className="absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-farm-700/20" />

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-sm text-farm-200">
              <Leaf className="h-4 w-4" />
              Your AgriConnect account
            </div>

            <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              Welcome back 👋
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">
              Manage your orders, wallet and shopping activity from one place.
            </p>
          </div>
        </motion.section>



        {/* Main actions */}
        <section className="mt-8">
          <div className="grid gap-5 md:grid-cols-2">

            {/* Wallet */}
            <Link to="/wallet">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group relative overflow-hidden p-6 transition-shadow hover:shadow-lift">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-farm-50" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-farm-50 text-farm-600">
                        <Wallet className="h-6 w-6" />
                      </div>

                      <ArrowRight className="h-5 w-5 text-ink/20 transition-all group-hover:translate-x-1 group-hover:text-farm-600" />
                    </div>

                    <p className="mt-5 text-sm text-ink/50">
                      My Wallet
                    </p>

                    <h2 className="mt-1 font-display text-2xl font-semibold text-farm-900">
                      View Wallet
                    </h2>

                    <p className="mt-2 text-sm text-ink/55">
                      Manage your balance and payments.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </Link>

            {/* Orders */}
            <Link to="/orders">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group relative overflow-hidden p-6 transition-shadow hover:shadow-lift">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-farm-50" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-farm-50 text-farm-600">
                        <Package className="h-6 w-6" />
                      </div>

                      <ArrowRight className="h-5 w-5 text-ink/20 transition-all group-hover:translate-x-1 group-hover:text-farm-600" />
                    </div>

                    <p className="mt-5 text-sm text-ink/50">
                      Purchase history
                    </p>

                    <h2 className="mt-1 font-display text-2xl font-semibold text-farm-900">
                      My Orders
                    </h2>

                    <p className="mt-2 text-sm text-ink/55">
                      View and track all your orders.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </Link>

          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="font-display text-xl font-semibold text-farm-900">
              Your activity
            </h2>

            <p className="mt-1 text-sm text-ink/50">
              A quick overview of your shopping activity.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total orders */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-50 text-farm-600">
                  <Package className="h-5 w-5" />
                </div>

                <span className="text-xs text-ink/40">
                  All time
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold text-farm-900">
                {loading ? '—' : orders.length}
              </p>

              <p className="mt-1 text-sm text-ink/55">
                Total orders
              </p>
            </Card>

            {/* Total spent */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-50 text-farm-600">
                  ₹
                </div>

                <span className="text-xs text-ink/40">
                  All time
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold text-farm-900">
                {loading
                  ? '—'
                  : `₹${totalSpent.toLocaleString('en-IN')}`}
              </p>

              <p className="mt-1 text-sm text-ink/55">
                Total spent
              </p>
            </Card>

            {/* Active */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-50 text-farm-600">
                  <Truck className="h-5 w-5" />
                </div>

                <span className="text-xs text-ink/40">
                  Currently
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold text-farm-900">
                {loading ? '—' : activeOrders}
              </p>

              <p className="mt-1 text-sm text-ink/55">
                Active orders
              </p>
            </Card>

            {/* Delivered */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-50 text-farm-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <span className="text-xs text-ink/40">
                  Completed
                </span>
              </div>

              <p className="mt-5 text-3xl font-semibold text-farm-900">
                {loading ? '—' : deliveredOrders}
              </p>

              <p className="mt-1 text-sm text-ink/55">
                Delivered orders
              </p>
            </Card>

          </div>
        </section>

        {/* Recent orders */}
        <section className="mt-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-farm-900">
                Recent orders
              </h2>

              <p className="mt-1 text-sm text-ink/50">
                Keep track of your latest purchases.
              </p>
            </div>

            {orders.length > 0 && (
              <Link
                to="/orders"
                className="hidden items-center gap-1 text-sm font-medium text-farm-700 hover:text-farm-900 sm:flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          <div className="mt-4">
            {loading ? (
              <Card className="p-6">
                <div className="h-5 w-40 animate-pulse rounded bg-farm-50" />
                <div className="mt-3 h-4 w-64 animate-pulse rounded bg-farm-50" />
              </Card>
            ) : recentOrders.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock3 className="mx-auto h-8 w-8 text-farm-500" />

                <p className="mt-3 font-medium text-ink/70">
                  No orders yet
                </p>

                <p className="mt-1 text-sm text-ink/45">
                  Your recent purchases will appear here.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                  >
                    <Card className="mb-3 flex items-center justify-between p-5 transition-shadow hover:shadow-lift">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-farm-50 text-farm-600">
                          <Package className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="font-medium text-farm-900">
                            {order.orderNumber ??
                              `Order #${order.id}`}
                          </p>

                          <p className="mt-1 text-xs text-ink/45">
                            {order.orderedAt
                              ? new Date(
                                  order.orderedAt
                                ).toLocaleDateString()
                              : 'Recently placed'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden text-right sm:block">
                          <p className="font-semibold text-farm-900">
                            ₹
                            {Number(
                              order.totalAmount ?? 0
                            ).toLocaleString('en-IN')}
                          </p>

                          <span className="text-xs text-farm-600">
                            {order.orderStatus}
                          </span>
                        </div>

                        <ArrowRight className="h-4 w-4 text-ink/30" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-8 pb-8">
          <Card className="overflow-hidden bg-farm-50/70 p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-farm-600">
                  AgriConnect
                </p>

                <h2 className="mt-1 font-display text-xl font-semibold text-farm-900">
                  Ready to discover fresh produce?
                </h2>

                <p className="mt-1 text-sm text-ink/55">
                  Visit the marketplace to shop directly from farmers.
                </p>
              </div>

              <Link to="/products">
                <Button className="flex items-center gap-2">
                  Browse Marketplace
                  <ShoppingBag className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </section>

      </main>

      <Footer />
    </div>
  )
}