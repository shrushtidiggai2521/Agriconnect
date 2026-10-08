import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, ShieldCheck, Truck, Heart, Minus, Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProductCard from '@/components/ui/ProductCard'
import ProductService from '@/services/productService'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user, role } = useAuth()
  const [deleting, setDeleting] = useState(false)
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await ProductService.getById(id)
        console.log("PRODUCT FROM API:", data)
        if (cancelled) return
        setProduct(data)
        setActiveImage(0)
        setQty(1)
        try {
          const all = await ProductService.getAll({ category: data?.category })
          const list = Array.isArray(all) ? all : all?.content ?? all?.items ?? []
          setRelated(list.filter((p) => p.id !== data.id).slice(0, 4))
        } catch {
          setRelated([])
        }
      } catch (err) {
        if (!cancelled) setError('Could not load this product. It may no longer be available.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2">
          <div className="skeleton aspect-square" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-24 w-full" />
            <div className="skeleton h-12 w-1/2" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
          <span className="text-4xl">🍂</span>
          <p className="mt-4 font-medium text-ink/70">{error || 'Product not found.'}</p>
          <Link to="/products" className="mt-2 text-sm font-medium text-farm-600 hover:underline">
            Back to marketplace
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : []
  const inStock = (product.quantity ?? 0) > 0
  const isOwner = role === ROLES.FARMER && user?.id != null && product.farmerId === user.id

  const handleDelete = async () => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    try {
      await ProductService.remove(product.id)
      toast.success('Product deleted.')
      navigate('/products')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not delete product.'
      toast.error(msg)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl2 border border-line bg-farm-50">
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-8xl">🌿</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImage === i ? 'border-farm-500' : 'border-transparent'}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {product.organic && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-farm-50 px-3 py-1 text-xs font-medium text-farm-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Certified organic
              </span>
            )}
            <h1 className="mt-3 font-display text-3xl font-semibold text-farm-900">{product.name}</h1>

            <div className="mt-2 flex items-center gap-4 text-sm text-ink/60">
              {product.rating != null && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-harvest-500 text-harvest-500" /> {product.rating} ({product.reviewCount ?? 0} reviews)
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {product.location || 'Local farm'}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-4xl font-semibold text-farm-900">₹{product.price}</span>
              <span className="text-sm text-ink/50">/ {product.unit || 'kg'}</span>
            </div>
            <p className={`mt-1 text-sm ${inStock ? 'text-farm-600' : 'text-red-500'}`}>
              {inStock ? `${product.quantity} in stock` : 'Out of stock'}
            </p>

            <p className="mt-6 leading-relaxed text-ink/70">{product.description || 'Freshly harvested and listed directly by the grower.'}</p>

            <Card className="mt-6 flex items-center gap-4 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-farm-100 text-farm-700">
                {product.farmerName?.[0] ?? 'F'}
              </div>
              <div>
                <p className="text-sm font-semibold">{product.farmerName || 'Independent grower'}</p>
                <p className="text-xs text-ink/50">Sold and shipped by this farmer</p>
              </div>
            </Card>

            {isOwner ? (
              <div className="mt-8 flex items-center gap-4">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate(`/farmer/products/${product.id}/edit`)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4" /> Edit product
                </Button>
                <Button
                  size="lg"
                  variant="dark"
                  loading={deleting}
                  onClick={handleDelete}
                  className="flex-1 !bg-red-600 hover:!bg-red-700"
                >
                  <Trash2 className="h-4 w-4" /> Delete product
                </Button>
              </div>
            ) : (
              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center rounded-full border border-line">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 text-ink/60 hover:text-farm-600">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="p-3 text-ink/60 hover:text-farm-600">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button size="lg" disabled={!inStock} onClick={() => addItem(product.id, qty)} className="flex-1">
                  Add to cart
                </Button>
                <Button
                  size="lg"
                  variant="dark"
                  disabled={!inStock}
                  onClick={async () => { await addItem(product.id, qty); navigate('/cart') }}
                  className="flex-1"
                >
                  Buy now
                </Button>
                <button className="rounded-full border border-line p-3.5 text-ink/50 hover:text-red-500">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 text-xs text-ink/50">
              <Truck className="h-4 w-4" /> Delivered within 24–48 hours of harvest
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-2xl font-semibold text-farm-900">You might also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
