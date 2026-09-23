import { ExternalLinkIcon } from './Icons.jsx'

export const GITHUB_URL = 'https://github.com/abidfayaz/visamate-ai'

export default function PrototypeBanner() {
  return (
    <div className="prototype-banner" role="note">
      <span>
        Prototype for product/UX demonstration. Not all flows are connected to
        live visa systems. Do not use this as official visa advice.
      </span>
      <a
        className="prototype-banner__link"
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Source code on GitHub <ExternalLinkIcon size={12} />
      </a>
    </div>
  )
}
