// Ambient decorative layer: soft rising particles, subtle, non-distracting,
// and skipped for anyone with prefers-reduced-motion (handled globally in index.css).
export default function FloatingCandles() {
  const particles = Array.from({ length: 10 })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((_, i) => (
        <span
          key={i}
          className="absolute bottom-0 block rounded-full bg-gold-600/35 animate-rise"
          style={{
            left: `${(i * 97) % 100}%`,
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
            animationDuration: `${9 + (i % 5)}s`,
            animationDelay: `${i * 1.3}s`,
          }}
        />
      ))}
    </div>
  )
}
