export default function CatalogueLoading() {
  return (
    <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:px-8">
      <div className="h-10 w-64 animate-pulse rounded-lg bg-sand-200" />
      <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-sand-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-card bg-sand-200" />
        ))}
      </div>
    </div>
  );
}
