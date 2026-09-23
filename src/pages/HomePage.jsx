import { useState } from 'react'
import TrustBadge from '../components/TrustBadge.jsx'
import TrustLegend from '../components/TrustLegend.jsx'
import {
  UK_VISA_DATA,
  HOME_COPILOT_QUESTIONS,
  VISA_TYPE_PILLS,
} from '../data/visaData.js'

export default function HomePage({ onCheckRequirements, onAskCopilot }) {
  const [heroPurpose, setHeroPurpose] = useState('Tourism')

  return (
    <div className="home">
      {/* Hero Search Card */}
      <section className="card hero-card" aria-labelledby="hero-heading">
        <h2 id="hero-heading" className="hero-card__heading">
          UK Visa Guidance for Indian Passport Holders
        </h2>
        <p className="hero-card__subheading">
          Check requirements, prepare documents, and get AI-powered guidance —
          all in one place.
        </p>
        <form
          className="hero-card__form"
          onSubmit={(e) => {
            e.preventDefault()
            onCheckRequirements(heroPurpose)
          }}
        >
          <div className="field">
            <label className="field__label" htmlFor="hero-nationality">Nationality</label>
            <input
              id="hero-nationality"
              className="field__input"
              value="🇮🇳 Indian Passport"
              disabled
              aria-label="Nationality (locked to Indian Passport)"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="hero-destination">Destination</label>
            <input
              id="hero-destination"
              className="field__input"
              value="🇬🇧 United Kingdom"
              disabled
              aria-label="Destination (locked to United Kingdom)"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="hero-purpose">Purpose</label>
            <select
              id="hero-purpose"
              className="field__input"
              value={heroPurpose}
              onChange={(e) => setHeroPurpose(e.target.value)}
            >
              {UK_VISA_DATA.purposes.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn--primary hero-card__cta">
            Check Requirements
          </button>
        </form>
      </section>

      {/* Trust badge legend */}
      <TrustLegend />

      {/* Popular Destinations | Recent Updates */}
      <div className="home__two-col">
        <section className="card" aria-labelledby="popular-heading">
          <h3 id="popular-heading" className="card__title">Popular UK Visa Types</h3>
          <p className="card__hint">Pick a visit type to see its requirements.</p>
          <div className="visa-pill-grid">
            {VISA_TYPE_PILLS.map(({ label, purpose }) => (
              <button
                key={purpose}
                type="button"
                className="visa-pill"
                onClick={() => onCheckRequirements(purpose)}
              >
                <span aria-hidden="true">🇬🇧</span> {label}
              </button>
            ))}
          </div>
        </section>

        <section className="card" aria-labelledby="updates-heading">
          <div className="card__header">
            <h3 id="updates-heading" className="card__title">Recent Updates</h3>
            <span className="demo-tag">Demo data</span>
          </div>
          <ul className="updates-list">
            {UK_VISA_DATA.recentUpdates.map((update) => (
              <li key={update.text} className="updates-list__item">
                <span className={`dot dot--${update.color}`} aria-hidden="true" />
                <div className="updates-list__body">
                  <div className="updates-list__meta">
                    <TrustBadge
                      variant={update.type}
                      label={update.type === 'verified' ? 'Verified' : 'Community'}
                    />
                    <span className="updates-list__date">
                      {update.source} · {update.date}
                    </span>
                  </div>
                  <p className="updates-list__text">{update.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Suggested Copilot Questions */}
      <section className="card" aria-labelledby="ask-heading">
        <div className="card__header">
          <h3 id="ask-heading" className="card__title">Ask the AI Copilot</h3>
          <TrustBadge variant="ai" />
        </div>
        <p className="card__hint">
          Tap a question to get a structured answer — verified facts, community
          experience, and an AI recommendation.
        </p>
        <div className="question-pill-row">
          {HOME_COPILOT_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className="question-pill"
              onClick={() => onAskCopilot(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
