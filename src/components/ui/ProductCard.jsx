import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MapPin, Star, Plus } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const {
    id, name, price, unit = 'kg', imageUrl, rating, stock,
    farmerName, location, organic,
  } = product

const cleanImageUrl =
  imageUrl?.match(/\((https?:\/\/.*?)\)/)?.[1] || imageUrl;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-xl2 border border-line bg-surface shadow-soft transition-shadow hover:shadow-lift"
    >
      <Link to={`/products/${id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-farm-50">
          {imageUrl ? (
            <img
              src={cleanImageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                console.log("Failed image:", cleanImageUrl);
                e.currentTarget.src =
                "https://via.placeholder.com/600x400?text=No+Image";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">🌿</div>
          )}
          {organic && (
            <span className="absolute left-3 top-3 rounded-full bg-farm-500 px-2.5 py-1 text-xs font-medium text-white">
              Organic
            </span>
          )}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink/60 opacity-0 shadow-soft transition-opacity group-hover:opacity-100 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </button>
          {stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
              Out of stock
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/products/${id}`}>
          <h3 className="truncate font-medium text-ink group-hover:text-farm-600">{name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-ink/50">
          <MapPin className="h-3 w-3" /> {location || 'Local farm'}
        </div>
        <p className="mt-0.5 text-xs text-ink/50">{farmerName || 'Independent grower'}</p>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="font-display text-lg font-semibold text-farm-900">₹{price}</span>
            <span className="text-xs text-ink/50">/{unit}</span>
          </div>
          {rating != null && (
            <span className="flex items-center gap-1 text-xs text-ink/60">
              <Star className="h-3.5 w-3.5 fill-harvest-500 text-harvest-500" /> {rating}
            </span>
          )}
        </div>

        <button
          onClick={() => addItem(id, 1)}
          disabled={stock === 0}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-farm-50 py-2 text-sm font-medium text-farm-700 transition-colors hover:bg-farm-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add to cart
        </button>
      </div>
    </motion.div>
  )
}
