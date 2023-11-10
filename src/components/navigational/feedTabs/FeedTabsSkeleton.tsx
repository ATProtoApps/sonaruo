function TabSkeleton() {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-neutral-200 w-20 h-6" />
    </div>
  );
}

export default function FeedTabsSkeleton() {
  return (
    <div className="flex flex-nowrap gap-3 px-4 pb-2 overflow-auto no-scrollbar">
      <TabSkeleton />
      <TabSkeleton />
      <TabSkeleton />
      <TabSkeleton />
      <TabSkeleton />
      <TabSkeleton />
    </div>
  );
}