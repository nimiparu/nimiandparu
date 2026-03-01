/**
 * Instagram Link Component
 * Displays artist Instagram profile with styling and security
 */

import { createInstagramLinkData } from '../lib/instagram'
import styles from '../styles/instagram-link.module.css'

/**
 * InstagramLink Component
 * @param {string} username - Instagram username
 * @param {Object} options - Display options
 * @returns {JSX}
 */
export default function InstagramLink({ username, size = 'md', showLabel = true, inline = false }) {
  // Validate and create safe link data
  const linkData = createInstagramLinkData(username)

  // Handle invalid username
  if (!linkData.isValid) {
    return (
      <div className={styles.instagramLinkError}>
        <p className={styles.errorText}>{linkData.error}</p>
      </div>
    )
  }

  // Size classes
  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg
  }[size] || styles.sizeMd

  // Layout classes
  const containerClass = inline ? styles.instagramLinkInline : styles.instagramLink

  return (
    <a
      href={linkData.url}
      target={linkData.target}
      rel={linkData.rel}
      className={`${containerClass} ${sizeClass}`}
      title={`View ${linkData.displayName} on Instagram`}
      aria-label={`Instagram profile: ${linkData.displayName}`}
    >
      {/* Instagram Icon */}
      <svg
        className={styles.instagramIcon}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.012-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.06 1.281-.073 1.689-.073 4.948 0 3.259.013 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.06-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
      </svg>

      {/* Username Display */}
      {showLabel && (
        <span className={styles.username}>
          {linkData.displayName}
        </span>
      )}

      {/* Hover indicator */}
      <span className={styles.hoverIndicator} aria-hidden="true">↗</span>
    </a>
  )
}

/**
 * Simple version - just for embedding in text
 */
export function InstagramLinkInline({ username }) {
  return <InstagramLink username={username} size="sm" inline={true} showLabel={true} />
}

/**
 * Standalone version - for artist profiles
 */
export function InstagramLinkProfile({ username }) {
  return <InstagramLink username={username} size="md" inline={false} showLabel={true} />
}

/**
 * Card version - for artist cards in grid
 */
export function InstagramLinkCard({ username }) {
  return (
    <div className={styles.instagramCardContainer}>
      <InstagramLink username={username} size="md" inline={false} showLabel={true} />
    </div>
  )
}
