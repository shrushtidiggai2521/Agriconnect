import clsx from 'clsx'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-xl2 border border-line bg-surface shadow-soft',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
