import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sprout, Tractor, ShoppingBasket, Check, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { ROLES } from '@/utils/constants'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(10, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const roleOptions = [
  { value: ROLES.BUYER, title: 'Buyer', desc: 'Shop fresh produce direct from local farms.', icon: ShoppingBasket },
  { value: ROLES.FARMER, title: 'Farmer', desc: 'List your harvest and sell straight to buyers.', icon: Tractor },
]

export default function Register() {
  const { register: registerUser, loading } = useAuth()
  const [params] = useSearchParams()
  const [role, setRole] = useState(params.get('role') === 'FARMER' ? ROLES.FARMER : ROLES.BUYER)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      const { confirmPassword, ...payload } = values
      await registerUser({ ...payload, role })
    } catch (err) {
      const msg = err?.response?.data?.message || 'Could not create account. Try again.'
      toast.error(msg)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-6 py-16">
      <div className="absolute inset-0 bg-furrows" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg rounded-xl2 border border-line bg-surface p-8 shadow-lift"
      >
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-farm-500 text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold text-farm-900">AgriConnect</span>
        </Link>

        <h1 className="font-display text-2xl font-semibold text-farm-900">Create your account</h1>
        <p className="mt-1 text-sm text-ink/60">Join as a buyer or a farmer — takes under a minute.</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={`relative rounded-xl2 border p-4 text-left transition-all ${
                role === opt.value ? 'border-farm-500 bg-farm-50 shadow-soft' : 'border-line hover:border-farm-300'
              }`}
            >
              {role === opt.value && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-farm-500 text-white">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <opt.icon className="h-6 w-6 text-farm-600" />
              <p className="mt-2 text-sm font-semibold">{opt.title}</p>
              <p className="mt-1 text-xs text-ink/60">{opt.desc}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <Input label="Full name" placeholder="Jane Farmer" error={errors.name?.message} {...register('name')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
            <Input label="Phone" placeholder="98765 43210" error={errors.phone?.message} {...register('phone')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <Input label="Confirm password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Create account as {role === ROLES.FARMER ? 'Farmer' : 'Buyer'} <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-farm-600 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
