import TrustBadge from './TrustBadge.jsx'

const PAGE_META = {
  home: {
    title: 'Home',
    subtitle: 'UK visa guidance for Indian passport holders',
    badge: <span className="phase-pill">Phase 1 · MVP</span>,
  },
  search: {
    title: 'Visa Search',
    subtitle: 'UK Standard Visitor Visa requirements',
    badge: <TrustBadge variant="verified" />,
  },
  copilot: {
    title: 'AI Copilot',
    subtitle: 'Ask anything about the UK Standard Visitor Visa',
    badge: <TrustBadge variant="ai" />,
  },
  insights: {
    title: 'Community Insights',
    subtitle: 'Real experiences from Indian travellers who applied for UK visas',
    badge: <TrustBadge variant="community" />,
  },
}

export default function TopBar({ view }) {
  const meta = PAGE_META[view] ?? PAGE_META.home
  return (
    <header className="topbar">
      <div className="topbar__titles">
        <h1 className="topbar__title">{meta.title}</h1>
        <p className="topbar__subtitle">{meta.subtitle}</p>
      </div>
      <div className="topbar__badge">{meta.badge}</div>
    </header>
  )
}
