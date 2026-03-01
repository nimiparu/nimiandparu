/**
 * Instagram URL Validation and Normalization Utilities
 * Handles Instagram username/URL validation, sanitization, and conversion
 */

/**
 * Validates Instagram username format
 * @param {string} username - The Instagram username to validate
 * @returns {Object} { isValid: boolean, normalized: string, error: string }
 */
export const validateInstagramUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return {
      isValid: false,
      normalized: '',
      error: 'Instagram username is required'
    }
  }

  // Trim whitespace
  let normalized = username.trim()

  // Remove @ symbol if included
  if (normalized.startsWith('@')) {
    normalized = normalized.slice(1)
  }

  // Remove https://instagram.com/ or https://www.instagram.com/ if included
  normalized = normalized.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '')

  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '')

  // Validate format: Instagram usernames can contain:
  // - Letters (a-z, A-Z)
  // - Numbers (0-9)
  // - Underscores (_)
  // - Periods (.)
  // - Must be 1-30 characters
  // - Cannot start or end with a period
  const instagramUsernameRegex = /^(?!.*\.$)[a-zA-Z0-9._]{1,30}$/

  if (!instagramUsernameRegex.test(normalized)) {
    return {
      isValid: false,
      normalized: '',
      error: 'Invalid Instagram username format. Use only letters, numbers, underscores, and periods.'
    }
  }

  // Check if starts with underscore (valid but unusual)
  // Check if empty after validation
  if (normalized.length === 0) {
    return {
      isValid: false,
      normalized: '',
      error: 'Instagram username cannot be empty'
    }
  }

  return {
    isValid: true,
    normalized: normalized,
    error: null
  }
}

/**
 * Converts Instagram username to full URL
 * @param {string} username - The Instagram username (with or without @)
 * @returns {string} Full Instagram profile URL
 */
export const getInstagramProfileURL = (username) => {
  const validation = validateInstagramUsername(username)
  if (!validation.isValid) {
    return null
  }
  return `https://instagram.com/${validation.normalized}`
}

/**
 * Sanitizes Instagram username for safe display
 * @param {string} username - The Instagram username to sanitize
 * @returns {string} Sanitized username with @ prefix
 */
export const sanitizeInstagramUsername = (username) => {
  const validation = validateInstagramUsername(username)
  if (!validation.isValid) {
    return ''
  }
  // Return with @ prefix for display
  return `@${validation.normalized}`
}

/**
 * Checks if string appears to be an Instagram URL or username
 * @param {string} input - User input to check
 * @returns {boolean} True if appears to be Instagram-related
 */
export const isInstagramInput = (input) => {
  if (!input || typeof input !== 'string') {
    return false
  }
  return (
    input.includes('instagram.com') ||
    input.startsWith('@') ||
    /^[a-zA-Z0-9._]{1,30}$/.test(input.trim())
  )
}

/**
 * Creates a secure Instagram link component data
 * @param {string} username - The Instagram username
 * @returns {Object} Safe link data for rendering
 */
export const createInstagramLinkData = (username) => {
  const validation = validateInstagramUsername(username)
  
  if (!validation.isValid) {
    return {
      isValid: false,
      error: validation.error
    }
  }

  const profileURL = getInstagramProfileURL(validation.normalized)
  const displayName = sanitizeInstagramUsername(validation.normalized)

  return {
    isValid: true,
    url: profileURL,
    displayName: displayName,
    username: validation.normalized,
    target: '_blank',
    rel: 'noopener noreferrer',
    error: null
  }
}
