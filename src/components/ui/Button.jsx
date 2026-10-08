import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const variants = {
  primary: 'bg-farm-500 text-white hover:bg-farm-600 shadow-soft',
  secondary: 'bg-harvest-500 text-farm-900 hover:bg-harvest-600',
  outline: 'border border-farm-500 text-farm-600 hover:bg-farm-50',
  ghost: 'text-farm-700 hover:bg-farm-50',
  dark: 'bg-farm-900 text-white hover:bg-farm-800',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})

export default Button
