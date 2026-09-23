import { useState } from 'react'
import TrustBadge from '../components/TrustBadge.jsx'
import TrustLegend from '../components/TrustLegend.jsx'
import { TickCircleIcon, ExternalLinkIcon } from '../components/Icons.jsx'
import { UK_VISA_DATA } from '../data/visaData.js'

export default function VisaSearchPage({ purpose, onPurposeChange }) {
  // Dropdown value is local until "Search" is pressed; a purpose arriving
  // from the Home page auto-displays results (PRD 5.2).
  const [pendingPurpose, setPendingPurpose] = useState(purpose)
  const [activePurpose, setActivePurpose] = useState(purpose)

  const search = (e) => {
    e.preventDefault()
    setActivePurpose(pendingPurpose)
    onPurposeChange(pendingPurpose)
  }

  const data = UK_VISA_DATA
  const documents = activePurpose
    ? [...data.coreDocuments, ...(data.additionalDocuments[activePurpose] ?? [])]
    : []
  const overview = activePurpose ? data.overviewByPurpose[activePurpose] : null

  return (
    <div className="visa-search">
      {/* Search bar */}
      <form className="card search-bar" onSubmit={search}>
        <div className="field">
          <label className="field__label" htmlFor="search-nationality">Nationality</label>
          <input
            id="search-nationality"
            className="field__input"
            value="🇮🇳 Indian Passport"
            disabled
            aria-label="Nationality (locked to Indian Passport)"
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="search-destination">Destination</label>
          <input
            id="search-destination"
            className="field__input"
            value="🇬🇧 United Kingdom"
            disabled
            aria-label="Destination (locked to United Kingdom)"
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="search-purpose">Purpose</label>
          <select
            id="search-purpose"
            className="field__input"
            value={pendingPurpose}
            onChange={(e) => setPendingPurpose(e.target.value)}
          >
            <option value="" disabled>Select purpose…</option>
            {data.purposes.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn--primary" disabled={!pendingPurpose}>
          Search
        </button>
      </form>

      <TrustLegend />

      {!activePurpose ? (
        <div className="empty-state">
          <p>Select a purpose above to view requirements.</p>
        </div>
      ) : (
        <div className="results-grid">
          {/* Left column — 60% */}
          <div className="results-grid__left">
            {/* Visa Overview Card */}
            <section className="card" aria-labelledby="overview-heading">
              <div className="card__header">
                <div>
                  <h3 id="overview-heading" className="card__title">{data.name}</h3>
                  <p className="card__subtitle">{data.type} · {activePurpose}</p>
                </div>
                <span className="status-pill status-pill--required">Visa Required</span>
              </div>
              <div className="stat-grid">
                <div className="stat-box">
                  <div className="stat-box__label">Fee</div>
                  <div className="stat-box__value">{overview.fee}</div>
                  <div className="stat-box__sub">{overview.feeSub}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box__label">Processing</div>
                  <div className="stat-box__value">{overview.processing}</div>
                  <div className="stat-box__sub">{overview.processingSub}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box__label">Validity</div>
                  <div className="stat-box__value">{overview.validity}</div>
                  <div className="stat-box__sub">{overview.validitySub}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-box__label">Entry</div>
                  <div className="stat-box__value">{overview.entry}</div>
                  <div className="stat-box__sub">{overview.entrySub}</div>
                </div>
              </div>
              <p className="overview-note">
                <strong>{activePurpose}:</strong> {overview.note}
              </p>
              <div className="card__footer">
                <TrustBadge variant="verified" />
                <span className="source-line">
                  Source: {data.source} · Fees checked against GOV.UK on {data.feesCheckedOn}
                </span>
              </div>
            </section>

            {/* Required Documents Card */}
            <section className="card" aria-labelledby="docs-heading">
              <div className="card__header">
                <h3 id="docs-heading" className="card__title">
                  Required Documents · {activePurpose}
                </h3>
                <TrustBadge variant="verified" />
              </div>
              <ul className="doc-checklist">
                {documents.map((doc, index) => (
                  <li key={doc} className="doc-checklist__item">
                    <span
                      className={`doc-checklist__icon${index >= data.coreDocuments.length ? ' doc-checklist__icon--extra' : ''}`}
                    >
                      <TickCircleIcon size={16} />
                    </span>
                    <span>
                      {doc}
                      {index >= data.coreDocuments.length && (
                        <span className="doc-checklist__extra-tag">{activePurpose}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right column — 40% */}
          <div className="results-grid__right">
            {/* Common Rejection Reasons Card */}
            <section className="card" aria-labelledby="rejections-heading">
              <div className="card__header">
                <h3 id="rejections-heading" className="card__title">Common Rejection Reasons</h3>
                <div className="badge-stack">
                  <TrustBadge variant="verified" label="Verified" />
                  <TrustBadge variant="community" label="Community" />
                </div>
              </div>
              <ul className="rejection-list">
                {data.rejectionReasons.map((reason) => (
                  <li key={reason.text} className="rejection-list__item">
                    <span className="dot dot--red" aria-hidden="true" />
                    <div>
                      <p className="rejection-list__text">{reason.text}</p>
                      <TrustBadge
                        variant={reason.source}
                        label={reason.source === 'verified' ? 'Verified' : 'Community'}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Community Experiences Card */}
            <section className="card" aria-labelledby="community-heading">
              <div className="card__header">
                <h3 id="community-heading" className="card__title">Community Experiences</h3>
                <TrustBadge variant="community" />
              </div>
              <p className="card__hint">
                Individual applicant reports — not official UKVI policy.
              </p>
              <div className="community-stack">
                {data.communityInsights.slice(0, 3).map((insight) => (
                  <article key={insight.text} className="community-card">
                    <div className="community-card__meta">
                      <span aria-hidden="true">{insight.flag}</span>
                      <span className="community-card__source">
                        {insight.destination} · {insight.source} · {insight.date}
                      </span>
                    </div>
                    <p className="community-card__text">{insight.text}</p>
                    <TrustBadge variant="community" />
                  </article>
                ))}
              </div>
            </section>

            {/* Application Centre Card */}
            <section className="card" aria-labelledby="centre-heading">
              <div className="card__header">
                <h3 id="centre-heading" className="card__title">Where to Apply</h3>
                <TrustBadge variant="verified" />
              </div>
              <p className="centre__lead">
                <strong>{data.applicationCentre}</strong> — official visa
                application centre. Biometric enrollment is required at VFS.
              </p>
              <div className="city-chip-row" aria-label="VFS Global cities in India">
                {data.cities.map((city) => (
                  <span key={city} className="city-chip">{city}</span>
                ))}
              </div>
              <p className="centre__note">
                Note: the application is submitted online at GOV.UK before your
                VFS appointment.
              </p>
              <a
                className="centre__link"
                href={data.vfsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book appointment at VFS Global India <ExternalLinkIcon size={13} />
              </a>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
