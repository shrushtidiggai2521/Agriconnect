import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GovernmentSchemeService from '../../services/GovernmentSchemeService'

export default function GovernmentSchemeDetailsPage() {
  const { id } = useParams()

  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadScheme = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await GovernmentSchemeService.getById(id)
        setScheme(data)
      } catch (err) {
        console.error(err)
        setError('Unable to load scheme details')
      } finally {
        setLoading(false)
      }
    }

    loadScheme()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="h-10 w-72 animate-pulse rounded bg-gray-200" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-white" />
          <div className="mt-6 h-60 animate-pulse rounded-2xl bg-white" />
        </div>
      </div>
    )
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen bg-[#f8f7f2] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/government-schemes"
            className="text-sm font-medium text-green-600"
          >
            ← Back to Government Schemes
          </Link>

          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              {error || 'Scheme not found'}
            </h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f2] px-6 py-8 md:px-10">

      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to="/government-schemes"
          className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-green-600"
        >
          ← Back to Government Schemes
        </Link>


        {/* Header */}
        <div className="mt-6 rounded-2xl bg-white p-7 shadow-sm md:p-9">

          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

            <div>

              <div className="mb-4 flex flex-wrap gap-2">

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                  {scheme.category}
                </span>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                  {scheme.state === 'All'
                    ? 'All India'
                    : scheme.state}
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                {scheme.name}
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
                {scheme.shortDescription}
              </p>

            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
              📄
            </div>

          </div>

        </div>


        {/* Main information */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Benefits */}
          <InfoCard
            icon="💰"
            title="Benefits"
            content={scheme.benefits}
          />

          {/* Eligibility */}
          <InfoCard
            icon="✅"
            title="Eligibility"
            content={scheme.eligibility}
          />

          {/* Who can apply */}
          <InfoCard
            icon="👨‍🌾"
            title="Who Can Apply"
            content={scheme.whoCanApply}
          />

          {/* Documents */}
          <InfoCard
            icon="📄"
            title="Documents Required"
            content={scheme.documentsRequired}
          />

        </div>


        {/* Application section */}
        <div className="mt-6 rounded-2xl bg-white p-7 shadow-sm md:p-8">

          <h2 className="text-xl font-bold text-gray-900">
            Application & Official Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* Official information */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">

              <p className="text-sm font-semibold text-gray-900">
                Official Information
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Read the official scheme information.
              </p>

              {scheme.officialInfoUrl && (
                <a
                  href={scheme.officialInfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:underline"
                >
                  Visit Official Website ↗
                </a>
              )}

            </div>


            {/* Apply */}
            <div className="rounded-xl border border-green-100 bg-green-50 p-5">

              <p className="text-sm font-semibold text-gray-900">
                Apply for this scheme
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Continue to the official government application portal.
              </p>

              {scheme.officialApplyUrl && (
                <a
                  href={scheme.officialApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Apply Now ↗
                </a>
              )}

            </div>

          </div>

        </div>


        {/* Helpline + last updated */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Helpline
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {scheme.helpline || 'Not available'}
            </p>

          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Last Updated
            </p>

            <p className="mt-2 text-lg font-bold text-gray-900">
              {scheme.lastUpdated || 'Not available'}
            </p>

          </div>

        </div>

      </div>

    </div>
  )
}


/* Reusable information card */

function InfoCard({ icon, title, content }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
          {icon}
        </div>

        <h2 className="text-lg font-bold text-gray-900">
          {title}
        </h2>

      </div>

      <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
        {content || 'Information not available.'}
      </p>

    </div>
  )
}