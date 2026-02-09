export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-ink/70">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-ink" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}
