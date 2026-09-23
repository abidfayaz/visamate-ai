import { useState } from 'react'
import TrustBadge from '../components/TrustBadge.jsx'
import { UK_VISA_DATA } from '../data/visaData.js'

const FILTERS = ['All', 'Tourism', 'Business', 'Family', 'Student']

// Filter labels are short; data purposes are the full names.
const FILTER_TO_PURPOSE = {
  Tourism: 'Tourism',
  Business: 'Business',
  Family: 'Family Visit',
  Student: 'Student Visitor',
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function dateValue(dateText) {
  const [month, year] = dateText.split(' ')
  return Number(year) * 12 + MONTHS.indexOf(month)
}

function shortPurpose(purpose) {
  return purpose.replace(' Visit', '').replace(' Visitor', '')
}

export default function CommunityInsightsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [sortBy, setSortBy] = useState('recent')

  const filtered = UK_VISA_DATA.communityInsights.filter(
    (insight) =>
      activeFilter === 'All' || insight.purpose === FILTER_TO_PURPOSE[activeFilter],
  )

  // "Most Helpful" keeps the curated data order; "Most Recent" sorts by date.
  const sorted =
    sortBy === 'recent'
      ? [...filtered].sort((a, b) => dateValue(b.date) - dateValue(a.date))
      : filtered

  return (
    <div className="insights">
      {/* Disclaimer card */}
      <div className="insights__disclaimer" role="note">
        These observations are sourced from Reddit, travel blogs, Quora, and
        immigration forums. They reflect individual applicant experiences and
        do not represent official UKVI policy. Always verify requirements at
        GOV.UK.
      </div>

      {/* Filter row */}
      <div className="insights__filter-row">
        <div className="filter-tabs" role="tablist" aria-label="Filter insights by purpose">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={`filter-tab${activeFilter === filter ? ' filter-tab--active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="sort-control">
          <span className="sort-control__label">Sort by</span>
          <select
            className="field__input sort-control__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful (demo order)</option>
          </select>
        </label>
      </div>

      {/* Insights grid */}
      {sorted.length === 0 ? (
        <div className="empty-state">
          <p>No insights found for this category yet.</p>
        </div>
      ) : (
        <div className="insights__grid">
          {sorted.map((insight) => (
            <article key={insight.text} className="card insight-card">
              <div className="insight-card__top">
                <span className="insight-card__destination">
                  <span aria-hidden="true">{insight.flag}</span> {insight.destination}
                </span>
                <TrustBadge variant="community" />
              </div>
              <div className="insight-card__source">
                {insight.source} · {insight.date}
              </div>
              <p className="insight-card__text">{insight.text}</p>
              <span className="insight-card__purpose-tag">
                {shortPurpose(insight.purpose)}
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
