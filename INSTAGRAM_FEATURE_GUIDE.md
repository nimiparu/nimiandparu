# 🎨 Instagram Link Feature - Implementation Guide

## 📋 Overview

The Instagram Link feature allows artists to securely display their Instagram profiles on the ArtHamper platform with:
- ✅ Secure validation and sanitization
- ✅ Real-time form validation
- ✅ Premium, animated UI components
- ✅ Responsive mobile design
- ✅ Proper security headers (rel="noopener noreferrer")
- ✅ Accessible links with ARIA labels

---

## 🏗️ Architecture

### Files Created

1. **lib/instagram.js** - Validation utilities
   - `validateInstagramUsername()` - Validate username format
   - `getInstagramProfileURL()` - Convert username to profile URL
   - `sanitizeInstagramUsername()` - Sanitize for display
   - `createInstagramLinkData()` - Create safe link data

2. **components/InstagramLink.js** - Reusable React component
   - `InstagramLink` - Main component with customizable sizing
   - `InstagramLinkInline` - Inline variant for text
   - `InstagramLinkProfile` - Profile variant
   - `InstagramLinkCard` - Card variant for artist cards

3. **styles/instagram-link.module.css** - Component styling
   - Premium gradient backgrounds
   - Smooth hover animations
   - Responsive design
   - Dark mode support

### Files Modified

1. **pages/api/artists.js** - Backend validation
   - Validates Instagram username on signup
   - Normalizes input (removes @ and URLs)
   - Better error messages

2. **pages/artist-signup.js** - Enhanced signup form
   - Real-time form validation
   - Better UX with error messages
   - Input hints and tips

3. **pages/artists.js** - Artist gallery page
   - Uses new InstagramLink component
   - Premium visual display
   - Enhanced user experience

---

## 🔐 Security Features

### Validation Rules

Instagram usernames can only contain:
- Letters (a-z, A-Z)
- Numbers (0-9)
- Underscores (_)
- Periods (.)
- 1-30 characters maximum
- Cannot start or end with a period

### Input Normalization

The system automatically:
1. Trims whitespace
2. Removes @ symbol if included
3. Removes full Instagram URLs if provided
4. Extracts just the username portion
5. Validates the format

### XSS Prevention

- React's default XSS protection
- Sanitized URLs with proper href construction
- `rel="noopener noreferrer"` prevents window attacks
- `target="_blank"` safely opens new tab

### URL Construction

```javascript
// Converts any input format to safe URL:
"@creative_artist" → "https://instagram.com/creative_artist"
"creative_artist" → "https://instagram.com/creative_artist"
"https://instagram.com/creative_artist" → "https://instagram.com/creative_artist"
"https://www.instagram.com/creative_artist/" → "https://instagram.com/creative_artist"
```

---

## 📱 Component Usage

### Basic Usage

```jsx
import InstagramLink from '../components/InstagramLink'

// Default - Medium size with label
<InstagramLink username="creative_artist" />

// Upload with options
<InstagramLink 
  username="creative_artist"
  size="lg"           // 'sm', 'md', 'lg'
  showLabel={true}    // Show @username
  inline={false}      // inline={true} for text embedding
/>
```

### Variants

```jsx
import { 
  InstagramLink, 
  InstagramLinkInline, 
  InstagramLinkProfile,
  InstagramLinkCard 
} from '../components/InstagramLink'

// Inline variant - for embedding in text
<InstagramLinkInline username="creative_artist" />

// Profile variant - for artist profiles
<InstagramLinkProfile username="creative_artist" />

// Card variant - for artist cards in grid
<InstagramLinkCard username="creative_artist" />
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `username` | string | required | Instagram username (@optional) |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| `showLabel` | boolean | true | Show username text |
| `inline` | boolean | false | Use inline styling |

---

## 🎨 Styling Details

### Default Style
- Instagram gradient background (multi-color)
- White text with 600 font-weight
- Rounded pill shape (12px)
- Smooth 0.3s transitions
- Hover: lift effect (translateY -3px)
- Hover: shine animation overlay

### Inline Variant
- Soft background gradient
- Pink text (#e1306c)
- Border accent
- Smaller padding
- Hover: background intensifies
- Hover: subtle translateX shift

### Size Variants

**Small (sm)**
- 0.5rem padding
- 0.875rem font-size
- 1rem icon

**Medium (md)** - Default
- 0.75rem padding
- 1rem font-size
- 1.25rem icon

**Large (lg)**
- 1rem padding
- 1.125rem font-size
- 1.5rem icon

### Responsive

Mobile adjustments:
- Padding reduced to fit screen
- Font-size scales down
- Hover indicator hidden on touch
- Maintains 44px minimum tap target

---

## ✅ Validation Examples

### Valid Inputs

```javascript
"creative_artist"           ✓
"@creative_artist"          ✓
"art_hamper_2025"          ✓
"artist.creative"          ✓
"a"                        ✓ (minimum 1 char)
"creative_artist_123"      ✓
"https://instagram.com/creative_artist" ✓
"https://www.instagram.com/creative_artist/" ✓
"instagram.com/creative_artist" ✓
```

### Invalid Inputs

```javascript
""                         ✗ (empty)
"@"                        ✗ (just symbol)
".creative_artist"         ✗ (starts with .)
"creative_artist."         ✗ (ends with .)
"creative artist"          ✗ (space not allowed)
"creative-artist"          ✗ (hyphens not allowed)
"creative@artist"          ✗ (@ only at start)
"very_long_instagram_name_that_exceeds_limit_xxx" ✗ (>30 chars)
```

---

## 🔄 Data Flow

### Artist Signup Flow

```
User Input (form)
    ↓
Frontend Validation (real-time)
    ↓
Form Submission
    ↓
API POST /api/artists
    ↓
Backend Validation (lib/instagram.js)
    ↓
Database Storage (normalized username)
    ↓
Confirmation
```

### Display Flow

```
Database (normalized username)
    ↓
API GET /api/artists
    ↓
createInstagramLinkData() function
    ↓
InstagramLink Component
    ↓
Styled Link in Gallery
```

---

## 📊 Database Schema

### Artist Model

```prisma
model Artist {
  id          String       @id @default(uuid())
  name        String
  instagramId String       @unique  // Validated, normalized username
  orders      OrderArtist[]
  signedUpAt  DateTime     @default(now())
}
```

**instagramId Field:**
- Stores only the username (no @ or URL)
- Unique constraint (prevents duplicates)
- Normalized on input
- Example: "creative_artist"

---

## 🧪 Testing

### Unit Tests - Validation Logic

```javascript
import { validateInstagramUsername, getInstagramProfileURL } from '../lib/instagram'

// Valid cases
expect(validateInstagramUsername('creative_artist').isValid).toBe(true)
expect(validateInstagramUsername('@creative_artist').isValid).toBe(true)
expect(validateInstagramUsername('https://instagram.com/creative_artist').isValid).toBe(true)

// Invalid cases
expect(validateInstagramUsername('').isValid).toBe(false)
expect(validateInstagramUsername('.invalid').isValid).toBe(false)
expect(validateInstagramUsername('invalid.').isValid).toBe(false)

// URL conversion
expect(getInstagramProfileURL('creative_artist')).toBe('https://instagram.com/creative_artist')

// Normalization
const validation = validateInstagramUsername('@creative_artist')
expect(validation.normalized).toBe('creative_artist')
```

### Manual Testing

1. **Signup with various formats:**
   - [ ] Test with @username
   - [ ] Test with just username
   - [ ] Test with full Instagram URL
   - [ ] Test with www.instagram.com URL

2. **Error handling:**
   - [ ] Empty input shows error
   - [ ] Invalid characters show error
   - [ ] Too long username shows error
   - [ ] Duplicate username shows error

3. **Display:**
   - [ ] Link displays on artist gallery
   - [ ] Hover effects work
   - [ ] Click opens Instagram in new tab
   - [ ] Mobile works responsively

4. **Security:**
   - [ ] No scripts can be injected
   - [ ] Link has rel="noopener noreferrer"
   - [ ] target="_blank" opens safely

---

## 🚀 Deployment

### Environment Setup

No special environment variables needed. The feature works with:
- SQLite database (includes instagramId field)
- Next.js 12+
- React 17+

### Database Migration

If adding to existing database:
```bash
# Instagram field already in schema
# Just run migration if needed
npx prisma migrate dev
```

### Testing Before Deploy

```bash
# Start development server
npm run dev

# Test artist signup
# 1. Go to /artist-signup
# 2. Enter test data
# 3. Check /artists page for new artist

# Test API
# GET /api/artists
# POST /api/artists with { name, instagramId }
```

---

## 🎯 Usage Examples

### Example 1: Artist Gallery Page

```jsx
import InstagramLink from '../components/InstagramLink'

function ArtistCard({ artist }) {
  return (
    <div className="card">
      <h3>{artist.name}</h3>
      
      {/* Display Instagram link */}
      <InstagramLink 
        username={artist.instagramId}
        size="md"
      />
      
      <button>Partner With Artist</button>
    </div>
  )
}
```

### Example 2: Artist Profile Page

```jsx
import { InstagramLinkProfile } from '../components/InstagramLink'

function ArtistProfile({ artist }) {
  return (
    <main>
      <img src={artist.photo} alt={artist.name} />
      <h1>{artist.name}</h1>
      <p>{artist.bio}</p>
      
      {/* Prominent Instagram link */}
      <section className="social-links">
        <InstagramLinkProfile username={artist.instagramId} />
      </section>
      
      {/* Portfolio */}
      <div className="portfolio">
        {artist.portfolio.map(work => (
          <img key={work.id} src={work.image} alt={work.title} />
        ))}
      </div>
    </main>
  )
}
```

### Example 3: Inline in Text

```jsx
<p>
  Created by{' '}
  <strong>{artist.name}</strong>
  {' '}
  <InstagramLinkInline username={artist.instagramId} />
</p>
```

---

## 🔧 Customization

### Custom Styling

To override component styles:

```css
/* Override background gradient */
:global(.instagramLink) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Override hover effect */
:global(.instagramLink:hover) {
  transform: scale(1.05);
}
```

### Custom Components

Build your own using the validation utility:

```jsx
import { createInstagramLinkData } from '../lib/instagram'

function CustomInstagramButton({ username }) {
  const linkData = createInstagramLinkData(username)
  
  if (!linkData.isValid) {
    return null
  }
  
  return (
    <button 
      onClick={() => window.open(linkData.url, linkData.target)}
    >
      Visit {linkData.displayName}
    </button>
  )
}
```

---

## 📈 Performance

### Optimization

- **Client-side validation:** Immediate feedback
- **Component memoization:** Can wrap with `React.memo()`
- **CSS modules:** Scoped styles, no conflicts
- **Minimal dependencies:** Only uses React

### Bundle Impact

- `lib/instagram.js` - ~1.5 KB
- `components/InstagramLink.js` - ~2 KB
- `styles/instagram-link.module.css` - ~2 KB
- **Total:** ~5.5 KB (uncompressed)

---

## 🐛 Troubleshooting

### Issue: Link not displaying

**Solution:** Check that `instagramId` is properly set in database
```javascript
// Verify in database
prisma.artist.findUnique({ where: { id: artistId } })
// Should return instagramId: "username"
```

### Issue: Validation always failing

**Solution:** Check Instagram username format requirements
```javascript
// Valid formats
✓ Alphanumeric + underscore + periods only
✓ 1-30 characters
✓ Cannot start/end with period

// Invalid formats
✗ Spaces, hyphens, special characters
✗ Empty string
✗ Over 30 characters
```

### Issue: Link opens wrong URL

**Solution:** Verify the URL construction
```javascript
import { getInstagramProfileURL } from '../lib/instagram'

// Debug
console.log(getInstagramProfileURL('creative_artist'))
// Should output: https://instagram.com/creative_artist
```

### Issue: Styling not applied

**Solution:** Ensure CSS module is imported correctly
```jsx
// Check import path
import styles from '../styles/instagram-link.module.css'

// Apply className from styles object
className={styles.instagramLink}
```

---

## 🎁 Future Enhancements

### Phase 2 Ideas

1. **Multiple Social Links**
   - Add TikTok links
   - Add YouTube links
   - Add Portfolio website link

2. **Link Verification**
   - Verify Instagram link is active
   - Show verification badge
   - Check follower count

3. **Social Media Preview**
   - Fetch Instagram bio
   - Show profile pic
   - Display follower count

4. **Analytics**
   - Track link clicks
   - Monitor engagement
   - Artist performance metrics

---

## 📚 API Reference

### validateInstagramUsername(username)

Validates and normalizes Instagram username.

```javascript
const result = validateInstagramUsername("@creative_artist")

// Returns:
{
  isValid: true,
  normalized: "creative_artist",
  error: null
}
```

### getInstagramProfileURL(username)

Converts username to Instagram profile URL.

```javascript
const url = getInstagramProfileURL("creative_artist")
// Returns: "https://instagram.com/creative_artist"
```

### createInstagramLinkData(username)

Creates complete link data for rendering.

```javascript
const linkData = createInstagramLinkData("creative_artist")

// Returns:
{
  isValid: true,
  url: "https://instagram.com/creative_artist",
  displayName: "@creative_artist",
  username: "creative_artist",
  target: "_blank",
  rel: "noopener noreferrer",
  error: null
}
```

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review validation rules (must be 1-30 chars, alphanumeric + . and _)
3. Verify database has `instagramId` field in Artist model
4. Check browser console for error messages

---

**Last Updated:** March 2, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
