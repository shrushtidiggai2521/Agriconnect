import { motion } from 'framer-motion'
import { Hammer } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Placeholder used for pages scheduled in the next build module.
// Each will be replaced with a fully wired page as the project continues.
export default function ComingSoon({ title }) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-farm-50 text-farm-600">
            <Hammer className="h-6 w-6" />
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold text-farm-900">{title}</h1>
          <p className="mt-2 text-sm text-ink/60">This module is being built next — coming shortly.</p>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}
