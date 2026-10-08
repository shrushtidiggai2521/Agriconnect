import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sprout, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export default function Login() {
  const { login, loading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = async (values) => {
    try {
      await login(values)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Invalid email or password.'
      toast.error(msg)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-6">
      <div className="absolute inset-0 bg-furrows" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-xl2 border border-line bg-surface p-8 shadow-lift"
      >
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-farm-500 text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold text-farm-900">AgriConnect</span>
        </Link>

        <h1 className="font-display text-2xl font-semibold text-farm-900">Welcome back</h1>
        <p className="mt-1 text-sm text-ink/60">Log in to keep browsing the harvest.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ink/70">
              <input type="checkbox" className="rounded border-line text-farm-500 focus:ring-farm-500" {...register('remember')} />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-medium text-farm-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={loading}>
            Log in <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-ink/60">
          New to AgriConnect?{' '}
          <Link to="/register" className="font-medium text-farm-600 hover:underline">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
