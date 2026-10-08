import { Link } from 'react-router-dom'
import { Sprout, Instagram, Twitter, Facebook } from 'lucide-react'

const columns = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Browse products', to: '/products' },
      { label: 'Seasonal picks', to: '/products?sort=newest' },
      { label: 'Organic only', to: '/products?organic=true' },
    ],
  },
  {
    title: 'For Farmers',
    links: [
      { label: 'Become a farmer', to: '/register?role=FARMER' },
      { label: 'Farmer dashboard', to: '/farmer/dashboard' },
      { label: 'Seller guidelines', to: '/how-it-works' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'How it works', to: '/how-it-works' },
      { label: 'Contact', to: '/contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-farm-900 text-farm-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-farm-50 text-farm-800">
                <Sprout className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold">AgriConnect</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-farm-200">
              Fresh produce, straight from the farmer who grew it. No middlemen, no markup, no mystery.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="rounded-full border border-farm-700 p-2 hover:bg-farm-800">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold text-farm-100">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-farm-300 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-farm-800 pt-8 text-xs text-farm-400 md:flex-row">
          <span>© {new Date().getFullYear()} AgriConnect. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
