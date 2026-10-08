import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Sprout, ShieldCheck, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import FarmerService from '@/services/farmerService'
import ProductService from '@/services/productService'

// No GET /api/farmers/{id} endpoint exists yet, so this page is built from
// the existing product list: fetch all products and filter to this
// farmerId client-side (the same pattern ProductDetailsPage already uses
// for "related products"). Only fields that actually appear on the
// product objects (farmerId, farmerName, location, organic) are shown.
export default function FarmerProfilePage() {
  const { id } = useParams()
  const [farmer, setFarmer] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

useEffect(() => {
  let cancelled = false

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const farmerData = await FarmerService.getById(id)
            console.log('FARMER PROFILE RESPONSE:', farmerData)
      console.log('FARMER ID FROM URL:', id)
        if (cancelled) return

        setFarmer(farmerData)
       // Get all products
  const productData = await ProductService.getAll()

  if (cancelled) return

  const allProducts = Array.isArray(productData)
    ? productData
    : productData?.data?.content ??
      productData?.content ??
      productData?.items ??
      []

  // IMPORTANT: only products belonging to this farmer
  const farmerProducts = allProducts.filter(
    (product) => String(product.farmerId) === String(id)
  )

  console.log('ALL PRODUCTS:', allProducts)
  console.log('THIS FARMER PRODUCTS:', farmerProducts)

  setProducts(farmerProducts)
    } catch (err) {
      console.error('Farmer profile error:', err)

      if (!cancelled) {
        setError("Could not load this farmer's profile.")
      }
    } finally {
      if (!cancelled) {
        setLoading(false)
      }
    }
  }

  if (id) {
    load()
  }

  return () => {
    cancelled = true
  }
}, [id])



  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="skeleton h-40 w-full rounded-xl2" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !farmer) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <span className="text-4xl">🌾</span>
          <p className="mt-4 font-medium text-ink/70">{error || "This farmer couldn't be found."}</p>
          <Link to="/farmers" className="mt-2 text-sm font-medium text-farm-600 hover:underline">
            Back to farmers
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="relative overflow-hidden bg-gradient-to-br from-farm-50 via-canvas to-harvest-50">
        <div className="absolute inset-0 bg-furrows opacity-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-12">
          <Link to="/farmers" className="mb-6 flex w-fit items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-farm-600">
            <ArrowLeft className="h-4 w-4" /> Back to farmers
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-6 rounded-xl2 border border-white/60 bg-white/70 p-8 text-center shadow-lift backdrop-blur-xl md:flex-row md:text-left"
          >
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-farm-100 text-5xl">
              👨‍🌾
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <h1 className="font-display text-3xl font-semibold text-farm-900">{farmer.name}</h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-farm-500 px-3 py-1 text-xs font-medium text-white">
  <ShieldCheck className="h-3.5 w-3.5" />
  Organic grower
</span>
              </div>
              {farmer.location && (
                <div className="mt-2 flex items-center justify-center gap-1 text-sm text-ink/60 md:justify-start">
                  <MapPin className="h-4 w-4" /> {farmer.location}
                </div>
              )}
              <div className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-farm-600 md:justify-start">
                <Sprout className="h-4 w-4" />
                {farmer.productCount} {farmer.productCount === 1 ? 'product' : 'products'} listed on AgriConnect
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="font-display text-2xl font-semibold text-farm-900">Products From This Farmer</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      <Footer />
    </div>
  )
}
