import { HomeIcon, SearchIcon, MessageCircleIcon, UsersIcon } from './Icons.jsx'

const ITEMS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'search', label: 'Search', Icon: SearchIcon },
  { id: 'copilot', label: 'Copilot', Icon: MessageCircleIcon },
  { id: 'insights', label: 'Community', Icon: UsersIcon },
]

// Mobile-only bottom navigation (replaces the sidebar under 768px).
export default function BottomNav({ view, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`bottom-nav__item${view === id ? ' bottom-nav__item--active' : ''}`}
          onClick={() => onNavigate(id)}
          aria-current={view === id ? 'page' : undefined}
        >
          <Icon size={18} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
