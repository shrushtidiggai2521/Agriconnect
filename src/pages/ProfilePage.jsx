import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, ShieldCheck, ArrowLeft, Pencil } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import UserService from '@/services/userService'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadProfile() {
      try {
        setLoading(true)
        const data = await UserService.getMyProfile()

        if (!cancelled) {
          setUser(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.data?.message ||
            'Could not load your profile.'
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="skeleton h-8 w-40" />

          <div className="mt-8 skeleton h-72 w-full rounded-2xl" />
        </main>

        <Footer />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />

        <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <p className="text-sm text-red-600">
              {error || 'Profile not found.'}
            </p>

            <Link to="/dashboard">
              <Button className="mt-5">
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        </main>

        <Footer />
      </div>
    )
  }

  const initial = user.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-farm-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card className="overflow-hidden">

            {/* Profile header */}
            <div className="bg-farm-50 px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-5">

                  {/* Circle profile */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-farm-600 text-3xl font-semibold text-white shadow-lg">
                    {initial}
                  </div>

                  <div>
                    <h1 className="font-display text-2xl font-semibold text-farm-900">
                      {user.name}
                    </h1>

                    <p className="mt-1 text-sm text-ink/60">
                      {user.role}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-ink/50">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      AgriConnect member
                    </div>
                  </div>
                </div>

                <Link to="/profile/edit">
                  <Button>
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>

              </div>
            </div>

            {/* Details */}
            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

              <div className="rounded-xl2 border border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-farm-50 text-farm-600">
                    <User className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-xs text-ink/50">
                      Full name
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {user.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl2 border border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-farm-50 text-farm-600">
                    <Mail className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-xs text-ink/50">
                      Email
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl2 border border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-farm-50 text-farm-600">
                    <Phone className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-xs text-ink/50">
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {user.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl2 border border-line p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-farm-50 text-farm-600">
                    <MapPin className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-xs text-ink/50">
                      Location
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink">
                      {user.location || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}