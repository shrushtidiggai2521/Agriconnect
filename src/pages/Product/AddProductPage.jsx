import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Sprout, ImagePlus, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ProductService from '@/services/productService'
import AuthService from '@/services/authService'

const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Spices', 'Honey']
const units = ['kg', 'g', 'litre', 'dozen', 'piece']

const schema = z.object({
  name: z.string().min(2, 'Enter a product name'),
  category: z.string().min(1, 'Select a category'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
  price: z.coerce.number().positive('Enter a valid price'),
  quantity: z.coerce.number().int().nonnegative('Enter a valid quantity'),
  unit: z.string().min(1, 'Select a unit'),
  organic: z.boolean().optional(),
  location: z.string().min(2, 'Enter a location'),
  imageUrl: z.string().url('Enter a valid image URL').optional().or(z.literal('')),
})

export default function AddProductPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { organic: false, unit: 'kg' },
  })

  const imageUrl = watch('imageUrl')

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      await ProductService.create({
        ...values,
        price: Number(values.price),
        quantity: Number(values.quantity),
        stock: Number(values.quantity),
      })
      toast.success('Product added successfully.')
      navigate('/products')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not add product. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-furrows opacity-50" />
        <div className="relative mx-auto max-w-2xl px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-farm-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl2 border border-white/60 bg-white/70 p-8 shadow-lift backdrop-blur-xl md:p-10"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-farm-500 text-white">
                <Sprout className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold text-farm-900">List a new product</span>
            </div>
            <p className="mt-2 text-sm text-ink/60">
              Fill in the details below — buyers will see this listed on the marketplace instantly.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <Input
                label="Product name"
                placeholder="e.g. Heirloom Tomatoes"
                error={errors.name?.message}
                {...register('name')}
              />

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-farm-800">Category</span>
                <select
                  {...register('category')}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-farm-500 focus:ring-2 focus:ring-farm-500/20"
                  defaultValue=""
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="mt-1 block text-xs text-red-500">{errors.category.message}</span>}
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-farm-800">Description</span>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe how it's grown, harvest date, taste, etc."
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-farm-500 focus:ring-2 focus:ring-farm-500/20"
                />
                {errors.description && <span className="mt-1 block text-xs text-red-500">{errors.description.message}</span>}
              </label>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 60"
                  error={errors.price?.message}
                  {...register('price')}
                />
                <Input
                  label="Quantity available"
                  type="number"
                  min="0"
                  placeholder="e.g. 100"
                  error={errors.quantity?.message}
                  {...register('quantity')}
                />
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-farm-800">Unit</span>
                <select
                  {...register('unit')}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-farm-500 focus:ring-2 focus:ring-farm-500/20"
                >
                  {units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-line bg-farm-50/60 p-4 text-sm text-farm-800">
                <input
                  type="checkbox"
                  className="rounded border-line text-farm-500 focus:ring-farm-500"
                  {...register('organic')}
                />
                This product is organically grown
              </label>
              <label className="block">
  <span className="mb-1.5 block text-sm font-medium text-farm-800">
    Location
  </span>

  <Input
    placeholder="Belagavi, Karnataka"
    error={errors.location?.message}
    {...register('location')}
  />
</label>




              <Input
                label="Image URL"
                placeholder="https://..."
                error={errors.imageUrl?.message}
                {...register('imageUrl')}
              />
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-farm-50/50">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-ink/40">
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs">Image preview</span>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full" loading={submitting}>
                Add product
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
