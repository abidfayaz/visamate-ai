// The three-layer trust model badge — the visual identity of VisaMate.
// Variants: verified (green) | community (amber) | ai (violet)
const VARIANTS = {
  verified: { symbol: '✓', label: 'Verified Requirement' },
  community: { symbol: '⚠', label: 'Community Experience' },
  ai: { symbol: '🤖', label: 'AI Recommendation' },
}

export default function TrustBadge({ variant, label }) {
  const config = VARIANTS[variant] ?? VARIANTS.verified
  return (
    <span className={`trust-badge trust-badge--${variant}`}>
      <span aria-hidden="true">{config.symbol}</span> {label ?? config.label}
    </span>
  )
}
