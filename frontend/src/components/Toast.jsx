export default function Toast({ type = 'info', message }) {
  if (!message) return null;
  const color = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-emerald-600' : 'bg-ink';
  return (
    <div className={`${color} text-white px-4 py-2 rounded-lg text-sm shadow-md`}>{message}</div>
  );
}
