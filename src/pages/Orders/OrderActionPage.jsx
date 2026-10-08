import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

export default function OrderActionPage() {
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')

const [order, setOrder] = useState(null)
const [loadingOrder, setLoadingOrder] = useState(true)
const [loading, setLoading] = useState(false)
const [result, setResult] = useState(null)
const [error, setError] = useState('')


  useEffect(() => {
  const fetchOrder = async () => {
    if (!token) {
      setError('Invalid order link.')
      setLoadingOrder(false)
      return
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/order-actions/${token}`
      )

      setOrder(response.data.data)
    } catch (err) {
      console.error('FETCH ORDER ERROR:', err)

      setError(
        err.response?.data?.message ||
          'This order link is invalid or has expired.'
      )
    } finally {
      setLoadingOrder(false)
    }
  }

  fetchOrder()
}, [token])

  
  const handleAction = async (action) => {
    if (!token) {
      setError('Invalid order link.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(
        `${API_BASE_URL}/order-actions/${token}/${action}`
      )

      setResult({
        success: true,
        message:
          response.data?.message ||
          `Order ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`,
      })
    } catch (err) {
      console.error('ORDER ACTION ERROR:', err)

      setError(
        err.response?.data?.message ||
          'This order link is invalid, expired, or has already been used.'
      )
    } finally {
      setLoading(false)
    }
  }

  // No token in URL
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-5xl">⚠️</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            Invalid Order Link
          </h1>

          <p className="mt-2 text-gray-500">
            This order link is missing a valid token.
          </p>
        </div>
      </div>
    )
  }

  // Order accepted/rejected successfully
  if (result?.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-6xl">✅</div>

          <h1 className="mt-5 text-2xl font-bold text-gray-800">
            {result.message}
          </h1>

          <p className="mt-3 text-gray-500">
            Thank you for responding to the AgriConnect order.
          </p>

          <p className="mt-6 text-sm text-gray-400">
            You can safely close this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            🌱
          </div>

          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            AgriConnect
          </h1>

          <p className="mt-1 text-gray-500">
            New Order Received
          </p>
        </div>

{loadingOrder ? (
  <div className="mt-8 text-center">
    <div className="text-3xl">⏳</div>

    <p className="mt-3 text-gray-500">
      Loading order details...
    </p>
  </div>
) : order ? (
  <>
    {/* Order Number */}
    <div className="mt-8 rounded-xl bg-gray-50 p-5">
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">
          Order Number
        </span>

        <span className="text-sm font-semibold text-gray-800">
          {order.orderNumber}
        </span>
      </div>
    </div>

    {/* Buyer */}
    <div className="mt-4 rounded-xl bg-gray-50 p-5">
      <h2 className="text-lg font-semibold text-gray-800">
        Buyer
      </h2>

      <p className="mt-2 text-gray-600">
        {order.buyerName}
      </p>
    </div>

    {/* Products */}
    <div className="mt-4 rounded-xl bg-gray-50 p-5">
      <h2 className="text-lg font-semibold text-gray-800">
        Order Items
      </h2>

      <div className="mt-4 space-y-3">
        {order.items?.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg bg-white p-4"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {item.productName}
              </p>

              <p className="text-sm text-gray-500">
                Quantity: {item.quantity}
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
    <div className="mt-4 flex items-center justify-between rounded-xl bg-green-50 p-5">
      <span className="text-lg font-semibold text-gray-700">
        Total Amount
      </span>

      <span className="text-2xl font-bold text-green-700">
        ₹{order.totalAmount}
      </span>
    </div>
  </>
) : null}

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-center">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-7 grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('accept')}
            className="rounded-xl bg-green-600 px-4 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Processing...' : '✓ Accept'}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleAction('reject')}
            className="rounded-xl bg-red-600 px-4 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Processing...' : '✕ Reject'}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          No login required. This secure link is associated with this order.
        </p>
      </div>
    </div>
  )
}