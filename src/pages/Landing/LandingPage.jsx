import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, Leaf, Truck, ShieldCheck, ArrowRight, Star,
  Sprout, Users, Package, TrendingUp, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stats = [
  { label: 'Farmers onboarded', value: '4,200+', icon: Sprout },
  { label: 'Orders delivered', value: '180K+', icon: Package },
  { label: 'Cities served', value: '38', icon: Users },
  { label: 'Avg. farmer earnings up', value: '32%', icon: TrendingUp },
]

const categories = [
  { name: 'Vegetables', emoji: '🥬' },
  { name: 'Fruits', emoji: '🍉' },
  { name: 'Grains', emoji: '🌾' },
  { name: 'Dairy', emoji: '🥛' },
  { name: 'Spices', emoji: '🌶️' },
  { name: 'Honey', emoji: '🍯' },
]

const steps = [
  { title: 'Farmer lists the harvest', desc: 'Growers photograph and price what just came out of the ground, same day.' },
  { title: 'You order direct', desc: 'Browse by farm, distance, or crop — no distributor markup in between.' },
  { title: 'It ships from the field', desc: 'Your order is packed within hours of harvest and routed to your door.' },
]

const testimonials = [
  { name: 'Meera R.', role: 'Home cook, Pune', quote: 'The tomatoes taste like they did at my grandmother\u2019s farm. Ordered Tuesday, arrived Wednesday morning.' },
  { name: 'Arjun Patil', role: 'Farmer, Nashik', quote: 'I used to lose 40% of my margin to middlemen. Now buyers pay me directly and I set my own price.' },
  { name: 'Fatima K.', role: 'Restaurant owner, Hubballi', quote: 'Sourcing produce for my kitchen used to take all morning. Now it takes ten minutes on AgriConnect.' },
]

const faqs = [
  { q: 'How fresh is "fresh", really?', a: 'Most listings are harvested within 24-48 hours of delivery. Farmers set their own harvest date on every listing.' },
  { q: 'How do I become a seller?', a: 'Register as a Farmer, verify your farm details, and list your first product in minutes — no subscription fees.' },
  { q: 'What payment methods are supported?', a: 'UPI, major debit/credit cards, and cash on delivery in serviceable areas.' },
  { q: 'Can I track my order?', a: 'Yes — every order has a live timeline from Placed through Delivered.' },
]

function FAQItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-line py-5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="font-medium text-farm-900">{item.q}</span>
        <ChevronDown className={`h-5 w-5 text-farm-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.a}</p>}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-furrows" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-farm-200 bg-farm-50 px-4 py-1.5 text-xs font-medium text-farm-700">
              <Leaf className="h-3.5 w-3.5" /> Harvested this morning, delivered today
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-farm-900 md:text-6xl">
              The farm has a
              <span className="relative mx-3 inline-block text-farm-500">
                direct line
              </span>
              to your kitchen.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink/70">
              AgriConnect cuts out the middlemen. Buy straight from the farmer who grew it — fresher produce, fairer prices, faster delivery.
            </p>

            <div className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-line bg-surface p-2 shadow-soft">
              <Search className="ml-2 h-5 w-5 text-ink/40" />
              <input
                placeholder="Search tomatoes, mangoes, wheat..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink/40"
              />
              <Button size="sm">Search</Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" variant="primary">
                  Explore products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register?role=FARMER">
                <Button size="lg" variant="outline">Become a farmer</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute h-80 w-80 rounded-full bg-farm-200/50 blur-3xl md:h-96 md:w-96" />
            <div className="relative grid grid-cols-2 gap-4">
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="col-span-2">
                <Card className="flex items-center gap-3 p-4">
                  <span className="text-3xl">🍅</span>
                  <div>
                    <p className="text-sm font-semibold">Heirloom Tomatoes</p>
                    <p className="text-xs text-ink/50">from Patil Farms, Nashik</p>
                  </div>
                  <span className="ml-auto rounded-full bg-farm-50 px-2 py-1 text-xs font-medium text-farm-600">Organic</span>
                </Card>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                <Card className="p-4">
                  <p className="text-3xl">🥭</p>
                  <p className="mt-2 text-sm font-semibold">Alphonso Mango</p>
                  <p className="text-xs text-ink/50">₹180/kg</p>
                </Card>
              </motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>
                <Card className="p-4">
                  <p className="text-3xl">🌾</p>
                  <p className="mt-2 text-sm font-semibold">Wheat, stone-milled</p>
                  <p className="text-xs text-ink/50">₹42/kg</p>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-line bg-farm-900 py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center text-white">
              <s.icon className="mx-auto mb-2 h-6 w-6 text-harvest-300" />
              <p className="font-display text-3xl font-semibold">{s.value}</p>
              <p className="mt-1 text-xs text-farm-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold">Shop by category</h2>
        <div className="mt-8 grid grid-cols-3 gap-4 md:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${c.name.toLowerCase()}`}
              className="group flex flex-col items-center gap-3 rounded-xl2 border border-line bg-surface p-6 text-center shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="text-3xl transition-transform group-hover:scale-110">{c.emoji}</span>
              <span className="text-sm font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-farm-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                variants={fadeUp}
                className="relative rounded-xl2 border border-line bg-surface p-8 shadow-soft"
              >
                <span className="font-mono text-xs text-farm-400">STEP {i + 1}</span>
                <h3 className="mt-3 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST / TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-farm-500" />
          <h2 className="font-display text-3xl font-semibold">Trusted on both sides of the harvest</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6">
              <div className="flex gap-0.5 text-harvest-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/80">"{t.quote}"</p>
              <p className="mt-4 text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-ink/50">{t.role}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="relative overflow-hidden rounded-xl2 bg-farm-900 px-8 py-16 text-center text-white">
          <div className="absolute inset-0 bg-furrows opacity-30" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Ready to taste the difference?</h2>
            <p className="mx-auto mt-3 max-w-md text-farm-200">
              Join thousands buying direct from local farms — or start selling your own harvest today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/products"><Button size="lg" variant="secondary">Explore products</Button></Link>
              <Link to="/register?role=FARMER"><Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Become a farmer</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="font-display text-3xl font-semibold">Frequently asked</h2>
        <div className="mt-6">
          {faqs.map((f) => <FAQItem key={f.q} item={f} />)}
        </div>
      </section>

      <Footer />
    </div>
  )
}
