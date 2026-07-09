export default function Logo({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="Vale Mais São José">
      <rect width="64" height="64" rx="14" fill="#0B2545" />
      <path d="M8 44 L22 20 L32 34 L40 16 L56 44 Z" fill="#3BA84A" />
    </svg>
  );
}
