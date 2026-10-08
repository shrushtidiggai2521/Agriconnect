import { useEffect, useState } from 'react'
//import axios from 'axios'
import api from '../../services/api'

//const API_BASE_URL = 'http://localhost:8080/api'

export default function FarmerDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/farmer/orders')

      console.log('FARMER ORDERS RESPONSE:', response.data)

    //  const response = await axios.get(
      //  `${API_BASE_URL}/orders/farmer/orders`,
        //{
          //headers: {
            //Authorization: `Bearer ${token}`,
          //},
        //}
      //)

      setOrders(response.data.data?.content || [])
    } catch (err) {
      console.error('FARMER ORDERS ERROR:', err)

      setError(
        err.response?.data?.message ||
          'Unable to load farmer orders.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const acceptedOrders = orders.filter(
    (order) => order.orderStatus === 'CONFIRMED'
  )

  const packingOrders = orders.filter(
    (order) => order.orderStatus === 'PACKING'
  )

  const shippedOrders = orders.filter(
    (order) => order.orderStatus === 'SHIPPED'
  )

  const totalSales = orders
    .filter(
      (order) =>
        order.orderStatus !== 'CANCELLED' &&
        order.orderStatus !== 'REJECTED'
    )
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading farmer dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Farmer Dashboard 🌱
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your orders and track your sales.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-800">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {acceptedOrders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Packing
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {packingOrders.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Sales
            </p>

            <p className="mt-2 text-3xl font-bold text-green-700">
              ₹{totalSales.toFixed(2)}
            </p>
          </div>

        </div>

        {/* Orders */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              My Orders
            </h2>

            <button
              onClick={fetchOrders}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="text-5xl">📦</div>

              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                No orders yet
              </h3>

              <p className="mt-2 text-gray-500">
                Orders from buyers will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  {/* Order header */}
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                      <p className="text-sm text-gray-500">
                        Order Number
                      </p>

                      <h3 className="font-bold text-gray-800">
                        {order.orderNumber}
                      </h3>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                        order.orderStatus === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : order.orderStatus === 'PACKING'
                          ? 'bg-orange-100 text-orange-700'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-blue-100 text-blue-700'
                          : order.orderStatus === 'DELIVERED'
                          ? 'bg-green-100 text-green-700'
                          : order.orderStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                  </div>

                  {/* Buyer */}
                  <div className="mt-5 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Buyer
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {order.buyerName}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mt-5">
                    <h4 className="font-semibold text-gray-800">
                      Ordered Products
                    </h4>

                    <div className="mt-3 space-y-2">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.productName}
                            </p>

                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} × ₹
                              {item.unitPrice}
                            </p>
                          </div>

                          <p className="font-semibold text-gray-800">
                            ₹{item.subtotal}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-5 flex items-center justify-between border-t pt-5">
                    <span className="font-semibold text-gray-600">
                      Total
                    </span>

                    <span className="text-xl font-bold text-green-700">
                      ₹{order.totalAmount}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}