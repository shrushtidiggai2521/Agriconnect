export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl2 border border-line bg-surface">
      <div className="skeleton aspect-[4/3]" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="skeleton h-5 w-1/3" />
        <div className="skeleton h-9 w-full" />
      </div>
    </div>
  )
}
