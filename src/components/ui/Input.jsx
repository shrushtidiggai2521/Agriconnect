import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'

const Input = forwardRef(function Input(
  { label, error, type = 'text', className, ...props },
  ref
) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (show ? 'text' : 'password') : type

  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-farm-800">{label}</span>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={clsx(
            'w-full rounded-xl border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition-colors',
            'focus:border-farm-500 focus:outline-none focus:ring-2 focus:ring-farm-500/20',
            error ? 'border-red-400' : 'border-line',
            isPassword && 'pr-11',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
})

export default Input
