export default function PropertyCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-xl border border-silver-200 bg-white"
      aria-hidden="true"
    >
      <div className="aspect-[4/3] w-full skeleton" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-5 w-2/3 rounded skeleton" />
        <div className="h-4 w-1/2 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="h-7 w-24 rounded skeleton" />
          <div className="h-9 w-28 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}
