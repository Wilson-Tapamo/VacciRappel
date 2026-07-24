export default function Loading() {
  return (
    <div className="animate-pulse space-y-7" aria-label="Chargement">
      <div className="h-7 w-32 rounded-full bg-sky-100" />
      <div className="h-12 w-3/5 rounded-2xl bg-slate-200/80" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-44 rounded-[2rem] border border-white/70 bg-white/65 shadow-sm"
          />
        ))}
      </div>
      <div className="h-56 rounded-[2.5rem] border border-white/70 bg-white/65 shadow-sm" />
    </div>
  );
}
