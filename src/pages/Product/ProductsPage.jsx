import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Leaf, X, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import ProductService from '@/services/productService'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES } from '@/utils/constants'

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

const categories = [
  { label: 'Vegetables', value: 'vegetable' },
  { label: 'Fruits', value: 'Fruits' },
  { label: 'Grains', value: 'grain' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Spices', value: 'spice' },
  { label: 'Honey', value: 'honey' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const organic = searchParams.get('organic') === 'true'
  const sort = searchParams.get('sort') || 'newest'
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {
        ...(query && { name: query }),
        ...(category && { category }),
        ...(organic && { organic: true }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        sort,
      }
      const data = await ProductService.getAll(params)
      
      setProducts(Array.isArray(data) ? data : data?.data?.content ?? data?.data?.items ?? data?.content ?? data?.items ?? [])
    } catch (err) {
      setError('Could not load products. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [query, category, organic, minPrice, maxPrice, sort])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const hasActiveFilters = query || category || organic || minPrice || maxPrice

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
            <Leaf className="h-3.5 w-3.5" /> 100% farmer direct, zero middlemen
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-5 font-display text-4xl font-semibold text-farm-900 md:text-5xl"
          >
            Fresh Products From Local Farmers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-3 max-w-xl text-ink/60"
          >
            Browse today's harvest — sourced straight from the farm, priced fairly for both sides.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={(e) => { e.preventDefault(); updateParam('q', searchInput) }}
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-line bg-white p-2 shadow-lift"
          >
            <Search className="ml-2 h-5 w-5 shrink-0 text-ink/40" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search tomatoes, mangoes, wheat..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
            />
            <button type="submit" className="shrink-0 rounded-full bg-farm-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-farm-600">
              Search
            </button>
          </motion.form>
        </div>
      </section>

      <div className="relative mx-auto max-w-7xl px-6 py-10">
        {isAuthenticated && role === ROLES.FARMER && (
          <button
            onClick={() => navigate('/add-product')}
            className="fixed right-6 top-24 z-40 flex items-center gap-2 rounded-full bg-farm-500 px-5 py-3 text-sm font-medium text-white shadow-lift transition-transform hover:-translate-y-0.5 hover:bg-farm-600 md:right-10"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-farm-900">Marketplace</h2>
            <p className="mt-1 text-sm text-ink/60">{loading ? 'Loading fresh listings...' : `${products.length} products available`}</p>
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm shadow-soft hover:bg-farm-50 md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[240px_1fr]">
          {/* Filters */}
          <aside className={`space-y-8 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="rounded-xl2 border border-line bg-surface p-5 shadow-soft">
              <h3 className="mb-3 text-sm font-semibold text-farm-900">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateParam('category', '')}
                  className={`block text-sm ${!category ? 'font-medium text-farm-600' : 'text-ink/60 hover:text-farm-600'}`}
                >
                  All categories
                </button>
                {categories.map((c) => (
                <button
                  key={c.value}
                  onClick={() => updateParam('category', c.value)}
                  className={`block text-sm ${
                  category === c.value
                      ? 'font-medium text-farm-600'
                      : 'text-ink/60 hover:text-farm-600'
                  }`}
                >
                  {c.label}
                </button>
                ))} 
              </div>
            </div>

            <div className="rounded-xl2 border border-line bg-surface p-5 shadow-soft">
              <h3 className="mb-3 text-sm font-semibold text-farm-900">Price range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  defaultValue={minPrice}
                  onBlur={(e) => updateParam('minPrice', e.currentTarget.value)}
                  placeholder="Min"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-farm-500"
                />
                <span className="text-ink/40">–</span>
                <input
                  type="number"
                  min="0"
                  defaultValue={maxPrice}
                  onBlur={(e) => updateParam('maxPrice', e.currentTarget.value)}
                  placeholder="Max"
                  className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-farm-500"
                />
              </div>
            </div>

            <div className="rounded-xl2 border border-line bg-surface p-5 shadow-soft">
              <h3 className="mb-3 text-sm font-semibold text-farm-900">Sort by</h3>
              <div className="space-y-2">
                {sortOptions.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updateParam('sort', s.value)}
                    className={`block text-sm ${sort === s.value ? 'font-medium text-farm-600' : 'text-ink/60 hover:text-farm-600'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 rounded-xl2 border border-line bg-surface p-4 text-sm text-ink/70 shadow-soft">
              <input
                type="checkbox"
                checked={organic}
                onChange={(e) => updateParam('organic', e.target.checked ? 'true' : '')}
                className="rounded border-line text-farm-500 focus:ring-farm-500"
              />
              <Leaf className="h-4 w-4 text-farm-500" /> Organic only
            </label>

            {hasActiveFilters && (
              <button
                onClick={() => { setSearchInput(''); setSearchParams({}) }}
                className="flex items-center gap-1 text-xs font-medium text-ink/50 hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" /> Clear all filters
              </button>
            )}
          </aside>

          {/* Grid */}
          <div>
            {error && (
              <div className="rounded-xl2 border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
            )}

            {!error && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
                  : products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-line py-24 text-center">
                <span className="text-4xl">🌱</span>
                <p className="mt-4 font-medium text-ink/70">No products match your filters yet.</p>
                <button onClick={() => { setSearchInput(''); setSearchParams({}) }} className="mt-2 text-sm font-medium text-farm-600 hover:underline">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
