export function CodeBlockSkeleton() {
  return (
    <div className="border-skin-base flex animate-pulse flex-col gap-2 border p-4 rounded-lg">
      <div className="bg-skin-muted h-4 w-3/4 rounded" />
      <div className="bg-skin-muted h-4 w-[85%] rounded" />
      <div className="bg-skin-muted h-4 w-[80%] rounded" />
      <div className="bg-skin-muted h-4 w-[90%] rounded" />
      <div className="bg-skin-muted h-4 w-[70%] rounded" />
    </div>
  )
}
