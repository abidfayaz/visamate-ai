import {
  HomeIcon,
  SearchIcon,
  MessageCircleIcon,
  UsersIcon,
  CheckCircleIcon,
  FolderIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from './Icons.jsx'

const PHASE_1_ITEMS = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'search', label: 'Visa Search', Icon: SearchIcon },
  { id: 'copilot', label: 'AI Copilot', Icon: MessageCircleIcon, tag: 'AI' },
  { id: 'insights', label: 'Community Insights', Icon: UsersIcon },
]

const PHASE_2_ITEMS = [
  { id: 'readiness', label: 'Readiness Check', Icon: CheckCircleIcon },
  { id: 'workspace', label: 'Application Workspace', Icon: FolderIcon },
]

export default function Sidebar({ view, onNavigate, collapsed, onToggleCollapsed }) {
  return (
    <nav className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`} aria-label="Main navigation">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <span className="sidebar__logo-mark" aria-hidden="true">V</span>
          <span className="sidebar__wordmark">
            VisaMate <span className="sidebar__wordmark-ai">AI</span>
          </span>
        </div>
        <button
          type="button"
          className="sidebar__collapse-btn"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronsRightIcon size={14} /> : <ChevronsLeftIcon size={14} />}
        </button>
      </div>

      <div className="sidebar__section-label">Phase 1</div>
      <ul className="sidebar__nav">
        {PHASE_1_ITEMS.map(({ id, label, Icon, tag }) => (
          <li key={id}>
            <button
              type="button"
              className={`sidebar__item${view === id ? ' sidebar__item--active' : ''}`}
              onClick={() => onNavigate(id)}
              aria-current={view === id ? 'page' : undefined}
              title={label}
            >
              <Icon size={16} />
              <span className="sidebar__item-label">{label}</span>
              {tag && <span className="sidebar__item-tag">{tag}</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="sidebar__section-label">Coming Soon</div>
      <ul className="sidebar__nav">
        {PHASE_2_ITEMS.map(({ id, label, Icon }) => (
          <li key={id}>
            <span className="sidebar__item sidebar__item--disabled" aria-disabled="true" title={`${label} (coming soon)`}>
              <Icon size={16} />
              <span className="sidebar__item-label">{label}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="sidebar__footer">Indian Passport · UK Visa · MVP</div>
    </nav>
  )
}
