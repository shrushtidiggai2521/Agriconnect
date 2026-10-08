import { useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Sprout, ArrowRight, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FarmerService from '@/services/farmerService'

// There is no dedicated farmer/user API yet — only GET /products (and
// /products/{id}, /products/search), and each product only carries
// farmerId + farmerName. So the farmer directory is derived here by
// grouping the real product list by farmerId. No bio, profile image,
// or rating is invented — those fields simply aren't shown because the
// backend doesn't provide them yet (see the note returned to the user
// about a possible GET /api/farmers endpoint).
//function deriveFarmers(products) {
  //const map = new Map()
  //for (const p of products) {
  //  const key = p.farmerId ?? p.farmerName
   // if (key == null) continue
   // if (!map.has(key)) {
    //  map.set(key, {
    //    id: p.farmerId ?? key,
    //    name: p.farmerName || 'Independent grower',
     //   location: p.location || null,
     //   organic: !!p.organic,
    //    productCount: 0,
   //   })
 //   }
  //  const entry = map.get(key)
  //  entry.productCount += 1
  //  if (!entry.location && p.location) entry.location = p.location
 //   if (p.organic) entry.organic = true
 // }
 // return Array.from(map.values()).sort((a, b) => b.productCount - a.productCount)
//}

function FarmerCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-line bg-surface">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-2 p-5">
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-9 w-full" />
      </div>
    </div>
  )
}

export default function FarmersPage() {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
useEffect(() => {
  let cancelled = false

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const data = await FarmerService.getAll()

      if (cancelled) return

      setFarmers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Farmers API error:', err)

      if (!cancelled) {
        setError('Could not load farmers right now. Please try again shortly.')
      }
    } finally {
      if (!cancelled) setLoading(false)
    }
  }

  load()

  return () => {
    cancelled = true
  }
}, [])

  

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-farm-50 via-canvas to-harvest-50">
        <div className="absolute inset-0 bg-furrows opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 py-16 text-center md:py-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-farm-200 bg-white/70 px-4 py-1.5 text-xs font-medium text-farm-700 backdrop-blur-sm"
          >
            <Users className="h-3.5 w-3.5" /> The growers behind AgriConnect
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 font-display text-4xl font-semibold text-farm-900 md:text-5xl"
          >
            Meet Our Farmers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-xl text-ink/60"
          >
            Get to know the people behind your food. Discover local farmers, explore their products, and buy directly from the source.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12">
        {error && (
          <div className="rounded-xl2 border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
        )}

        {!error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <FarmerCardSkeleton key={i} />)
              : farmers.map((farmer, i) => (
                  <motion.div
                    key={farmer.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    whileHover={{ y: -4 }}
                    className="group overflow-hidden rounded-xl2 border border-line bg-surface shadow-soft transition-shadow hover:shadow-lift"
                  >
                    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-farm-50">
                      <span className="text-5xl">👨‍🌾</span>
                <span className="absolute left-3 top-3 rounded-full bg-farm-500 px-2.5 py-1 text-xs font-medium text-white">
  Organic Farmer
</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg font-semibold text-farm-900">{farmer.name}</h3>
                      {farmer.location && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                          <MapPin className="h-3.5 w-3.5" /> {farmer.location}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-1.5 text-sm text-farm-600">
                        <Sprout className="h-4 w-4" />
                        {farmer.productCount} {farmer.productCount === 1 ? 'product' : 'products'}
                      </div>
                      <Link
                        to={`/farmers/${farmer.id}`}
                        className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-farm-50 py-2.5 text-sm font-medium text-farm-700 transition-colors hover:bg-farm-500 hover:text-white"
                      >
                        View Profile <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
          </div>
        )}

        {!loading && !error && farmers.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line py-24 text-center">
            <span className="text-4xl">🌾</span>
            <p className="mt-4 font-medium text-ink/70">No farmers are listed yet.</p>
            <Link to="/products" className="mt-2 text-sm font-medium text-farm-600 hover:underline">
              Browse the marketplace
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
