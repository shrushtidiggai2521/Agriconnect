import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, Search, ShoppingCart, Bell, Menu, X, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Button from '@/components/ui/Button'

const links = [
  { to: '/products', label: 'Marketplace' },
  { to: '/farmers', label: 'Farmers' },
  { to: '/how-it-works', label: 'How It Works' },
]

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-canvas/80 backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-farm-500 text-white">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold text-farm-900">AgriConnect</span>
        </Link>

<div className="hidden items-center gap-8 md:flex">
  {links.map((l) => (
    <NavLink
      key={l.to}
      to={l.to}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${
          isActive
            ? 'text-farm-600'
            : 'text-ink/70 hover:text-farm-600'
        }`
      }
    >
      {l.label}
    </NavLink>
  ))}

  {isAuthenticated && role === 'FARMER' && (
    <NavLink
      to="/government-schemes"
      className={({ isActive }) =>
        `text-sm font-medium transition-colors ${
          isActive
            ? 'text-farm-600'
            : 'text-ink/70 hover:text-farm-600'
        }`
      }
    >
      Government Schemes
    </NavLink>
  )}
</div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <button className="relative rounded-full p-2 text-ink/60 hover:bg-farm-50 hover:text-farm-700">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-harvest-500" />
              </button>
              {role !== 'FARMER' && (
                <button
                  onClick={() => navigate('/cart')}
                  className="relative rounded-full p-2 text-ink/60 hover:bg-farm-50 hover:text-farm-700"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => navigate(role === 'FARMER' ? '/farmer/dashboard' : '/dashboard')}
                className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm hover:bg-farm-50"
              >
                <User className="h-4 w-4" /> Dashboard
              </button>
              <Button variant="ghost" size="sm" onClick={logout}>Log out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log in</Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get started</Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-4">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-ink/80">
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/login')}>Log in</Button>
                <Button variant="primary" className="flex-1" onClick={() => navigate('/register')}>Get started</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
