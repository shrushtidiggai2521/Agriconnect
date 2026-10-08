import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { MapPin, ShoppingBag, ArrowRight, ArrowLeft, Plus, Check } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { useCart } from '@/contexts/CartContext'
import OrderService from '@/services/orderService'
import AddressService from '@/services/addressService'

const DELIVERY_FEE = 40
const FREE_DELIVERY_THRESHOLD = 500

const addressSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  phone: z.string().min(10, 'Enter a valid 10-digit phone number'),
  addressLine: z.string().min(5, 'Enter your full address'),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(2, 'Enter your state'),
  pincode: z.string().min(4, 'Enter a valid pincode'),
})

export default function CheckoutPage() {
  const { items, subtotal, loading } = useCart()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)

  const [addresses, setAddresses] = useState([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(addressSchema) })

  useEffect(() => {
    let cancelled = false
    async function loadAddresses() {
      setAddressesLoading(true)
      try {
        const list = await AddressService.getAll()

if (!cancelled) {
  const addressList = Array.isArray(list) ? list : []

  setAddresses(addressList)

  if (addressList.length > 0) {
    // Automatically select the default address.
    // If none is default, select the first address.
    const defaultAddress =
      addressList.find((address) => address.isDefault) ||
      addressList[0]

    setSelectedAddressId(defaultAddress.id)
    setShowNewAddressForm(false)
  } else {
    setSelectedAddressId(null)
    setShowNewAddressForm(true)
  }
}
      } catch {
        // Address endpoints are an assumption (see addressService.js) — if
        // they don't exist yet on your backend, this fails silently and we
        // fall back to "add a new address" so checkout still works once
        // you confirm/add the real endpoints.
        if (!cancelled) setShowNewAddressForm(true)
      } finally {
        if (!cancelled) setAddressesLoading(false)
      }
    }
    loadAddresses()
    return () => { cancelled = true }
  }, [])

  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE
  const total = subtotal + delivery

  const onSaveAddress = async (values) => {
    setSavingAddress(true)
    try {
  const created = await AddressService.create(values)

if (!created?.id) {
  throw new Error('Address was saved but no address ID was returned.')
}

setAddresses((prev) => [...prev, created])
setSelectedAddressId(created.id)
setShowNewAddressForm(false)
reset()

toast.success('Address saved.')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not save this address.'
      toast.error(msg)
    } finally {
      setSavingAddress(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Select or add a delivery address first.')
      return
    }
    setPlacing(true)
    try {
      // Matches your real OrderPlaceRequestDTO exactly: { addressId }
      const result = await OrderService.place({ addressId: selectedAddressId })

      // Defensive: farmerId is singular on OrderResponseDTO, meaning one
      // order = one farmer. If your backend splits a multi-farmer cart into
      // several orders, place() may return an array instead of one object —
      // handled here rather than assumed.
      const order = Array.isArray(result) ? result[0] : result
      const orderId = order?.id
      if (!orderId) {
        toast.error('Order was created but no order ID was returned. Please check My Orders.')
        navigate('/orders')
        return
      }

      if (Array.isArray(result) && result.length > 1) {
        toast.success(`${result.length} orders placed (split by farmer). Continue to payment for the first.`)
      } else {
        toast.success('Order placed! Continue to payment.')
      }
      navigate(`/payment/${orderId}`)
    } catch (err) {
      const status = err?.response?.status
      const msg = err?.response?.data?.message
      if (status === 400 && msg) {
        toast.error(msg)
      } else if (!err?.response) {
        // handled by the api.js interceptor's network-error toast
      } else if (status !== 401) {
        toast.error(msg || 'Could not place your order. Please try again.')
      }
    } finally {
      setPlacing(false)
    }
  }

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-farm-50 text-farm-500">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <p className="mt-4 font-medium text-ink/70">Your cart is empty — nothing to check out yet.</p>
          <Link to="/products">
            <Button className="mt-4">Browse the marketplace</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/cart" className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-farm-600">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <h1 className="font-display text-3xl font-semibold text-farm-900">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Delivery address */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-farm-600" />
                <h2 className="font-display text-lg font-semibold text-farm-900">Delivery address</h2>
              </div>

              {addressesLoading ? (
                <div className="mt-4 space-y-3">
                  <div className="skeleton h-16 w-full" />
                  <div className="skeleton h-16 w-full" />
                </div>
              ) : (
                <>
                  {addresses.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {addresses.map((addr) => (
                        <button
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`flex w-full items-start gap-3 rounded-xl2 border p-4 text-left transition-colors ${
                            selectedAddressId === addr.id ? 'border-farm-500 bg-farm-50' : 'border-line hover:border-farm-300'
                          }`}
                        >
                          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selectedAddressId === addr.id ? 'border-farm-500 bg-farm-500 text-white' : 'border-line'
                          }`}>
                            {selectedAddressId === addr.id && <Check className="h-3 w-3" />}
                          </span>
                          <div className="text-sm">
                            <p className="font-medium text-ink">{addr.fullName}</p>
                            <p className="text-ink/60">{addr.addressLine}, {addr.city}, {addr.state} {addr.pincode}</p>
                            <p className="text-ink/50">{addr.phone}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {!showNewAddressForm ? (
                    <button
                      onClick={() => setShowNewAddressForm(true)}
                      className="mt-4 flex items-center gap-1.5 text-sm font-medium text-farm-600 hover:underline"
                    >
                      <Plus className="h-4 w-4" /> Add a new address
                    </button>
                  ) : (
                    <form onSubmit={handleSubmit(onSaveAddress)} className="mt-4 space-y-4 border-t border-line pt-4">
                      <Input label="Full name" placeholder="Jane Buyer" error={errors.fullName?.message} {...register('fullName')} />
                      <Input label="Phone number" placeholder="98765 43210" error={errors.phone?.message} {...register('phone')} />
                      <Input label="Address" placeholder="House no., street, area" error={errors.addressLine?.message} {...register('addressLine')} />
                      <div className="grid grid-cols-3 gap-4">
                        <Input label="City" placeholder="Hubballi" error={errors.city?.message} {...register('city')} />
                        <Input label="State" placeholder="Karnataka" error={errors.state?.message} {...register('state')} />
                        <Input label="Pincode" placeholder="580001" error={errors.pincode?.message} {...register('pincode')} />
                      </div>
                      <div className="flex gap-3">
                        {addresses.length > 0 && (
                          <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewAddressForm(false)}>
                            Cancel
                          </Button>
                        )}
                        <Button type="submit" className="flex-1" loading={savingAddress}>Save address</Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </Card>
          </motion.div>

          {/* Order summary */}
          <Card className="h-fit p-6">
            <h2 className="font-display text-lg font-semibold text-farm-900">Order summary</h2>
            <div className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => {
                const product = item.product ?? item
                return (
                  <div key={item.id ?? product.id} className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-farm-50">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">🌿</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                      <p className="text-xs text-ink/50">Qty {item.quantity ?? 1}</p>
                    </div>
                    <p className="text-sm font-semibold text-farm-900">
                      ₹{((item.price ?? product.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-ink/70">
                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink/70">
                <span>Delivery</span><span>{delivery === 0 ? 'Free' : `₹${delivery.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-3 font-display text-lg font-semibold text-farm-900">
                <span>Total</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button size="lg" className="mt-6 w-full" loading={placing} onClick={handlePlaceOrder}>
              Place Order <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
