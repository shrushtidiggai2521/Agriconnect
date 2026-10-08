import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import GovernmentSchemeService from '../../services/GovernmentSchemeService'

const GovernmentSchemesPage = () => {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [state, setState] = useState('')

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await GovernmentSchemeService.getAll()
        setSchemes(data)
      } catch (err) {
        console.error(err)
        setError('Unable to load government schemes')
      } finally {
        setLoading(false)
      }
    }

    loadSchemes()
  }, [])

  // Get categories automatically from API data
  const categories = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map((scheme) => scheme.category)
          .filter(Boolean)
      )
    ]
  }, [schemes])

  // Get states automatically from API data
  const states = useMemo(() => {
    return [
      ...new Set(
        schemes
          .map((scheme) => scheme.state)
          .filter(Boolean)
      )
    ]
  }, [schemes])

  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
        !search ||
        scheme.name?.toLowerCase().includes(searchText) ||
        scheme.shortDescription?.toLowerCase().includes(searchText)

      const matchesCategory =
        !category ||
        scheme.category?.toLowerCase() === category.toLowerCase()

      const matchesState =
        !state ||
        scheme.state?.toLowerCase() === state.toLowerCase() ||
        scheme.state?.toLowerCase() === 'all'

      return (
        matchesSearch &&
        matchesCategory &&
        matchesState
      )
    })
  }, [schemes, search, category, state])

  return (
    <div className="min-h-screen bg-[#f8f7f2]">

      {/* Main content */}
      <main className="px-6 py-8 md:px-10 lg:px-12">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-600">
                Explore
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Government Schemes
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Discover benefits, subsidies, and welfare programs
                available for farmers.
              </p>
            </div>

            <button
              className="rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              ✓ Check Eligibility
            </button>

          </div>


          {/* Search + filters */}
          <div className="mb-8 flex flex-col gap-3 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by scheme name or keyword..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

            </div>


            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>


            {/* State */}
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-500"
            >
              <option value="">
                All States
              </option>

              {states.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

          </div>


          {/* Loading */}
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-2xl bg-white"
                />
              ))}

            </div>
          )}


          {/* Error */}
          {!loading && error && (
            <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
              {error}
            </div>
          )}


          {/* Empty */}
          {!loading &&
            !error &&
            filteredSchemes.length === 0 && (
              <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

                <div className="mb-3 text-4xl">
                  🔎
                </div>

                <h3 className="font-semibold text-gray-900">
                  No schemes found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try another search, category, or state.
                </p>

              </div>
            )}


          {/* Cards */}
          {!loading && !error && filteredSchemes.length > 0 && (

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {filteredSchemes.map((scheme) => (

                <div
                  key={scheme.id}
                  className="group flex min-h-[230px] flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                      📄
                    </div>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                      {scheme.state === 'All'
                        ? 'ALL INDIA'
                        : scheme.state}
                    </span>

                  </div>


                  {/* Name */}
                  <h2 className="mt-4 line-clamp-2 text-base font-bold text-gray-900">
                    {scheme.name}
                  </h2>


                  {/* Description */}
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-gray-500">
                    {scheme.shortDescription}
                  </p>


                  {/* Bottom */}
                  <div className="mt-auto flex items-center justify-between pt-5">

                    <span className="max-w-[60%] truncate rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                      {scheme.category}
                    </span>

                    <Link
                      to={`/government-schemes/${scheme.id}`}
                      className="text-xs font-semibold text-gray-600 transition hover:text-green-600"
                    >
                      View details →
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>


      {/* Floating help button */}
      <button
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl text-white shadow-lg transition hover:scale-105"
        title="Help"
      >
        💬
      </button>

    </div>
  )
}

export default GovernmentSchemesPage