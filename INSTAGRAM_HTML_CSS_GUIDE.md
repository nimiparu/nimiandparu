# Instagram Link Feature - HTML/CSS Implementation

## Standalone HTML/CSS Example

For developers who want to understand the underlying markup and styling without React:

---

## 📌 Basic Instagram Link - HTML

### Simple Link with Icon

```html
<a 
  href="https://instagram.com/creative_artist"
  target="_blank"
  rel="noopener noreferrer"
  class="instagram-link"
  title="View @creative_artist on Instagram"
  aria-label="Instagram profile: @creative_artist"
>
  <!-- Instagram Icon SVG -->
  <svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.012-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.06 1.281-.073 1.689-.073 4.948 0 3.259.013 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.06-1.69-.073-4.949-.073z"/>
  </svg>
  
  <!-- Username -->
  <span class="instagram-username">@creative_artist</span>
  
  <!-- Hover Indicator -->
  <span class="instagram-arrow" aria-hidden="true">↗</span>
</a>
```

---

## 🎨 CSS Styling

### Default Style - Premium Button

```css
.instagram-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  
  /* Multi-color gradient */
  background: linear-gradient(
    135deg,
    #f09433 0%,
    #e6683c 25%,
    #dc2743 50%,
    #cc2366 75%,
    #bc1888 100%
  );
  
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Smooth transitions */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Subtle shadow */
  box-shadow: 0 4px 15px rgba(224, 148, 51, 0.3);
  
  position: relative;
  overflow: hidden;
  
  /* Focus state for accessibility */
  outline: none;
}

/* Shine animation on hover */
.instagram-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

/* Hover effect */
.instagram-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(224, 148, 51, 0.4);
}

.instagram-link:hover::before {
  left: 100%;
}

/* Focus visible for keyboard navigation */
.instagram-link:focus-visible {
  outline: 2px solid #f09433;
  outline-offset: 2px;
}
```

### Icon Styling

```css
.instagram-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.instagram-link:hover .instagram-icon {
  transform: scale(1.1);
}
```

### Username Text

```css
.instagram-username {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: letter-spacing 0.3s ease;
}

.instagram-link:hover .instagram-username {
  letter-spacing: 1px;
}
```

### Hover Arrow

```css
.instagram-arrow {
  display: inline-flex;
  opacity: 0;
  transform: translate(-4px, 0);
  transition: all 0.3s ease;
  font-size: 0.875rem;
  margin-left: -0.5rem;
}

.instagram-link:hover .instagram-arrow {
  opacity: 1;
  transform: translate(2px, 0);
}
```

---

## 📏 Responsive Variants

### Small Size (sm)

```css
.instagram-link.size-sm {
  padding: 0.5rem 0.85rem;
  font-size: 0.875rem;
}

.instagram-link.size-sm .instagram-icon {
  width: 1rem;
  height: 1rem;
}
```

### Medium Size (md) - Default

```css
.instagram-link.size-md {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
}

.instagram-link.size-md .instagram-icon {
  width: 1.25rem;
  height: 1.25rem;
}
```

### Large Size (lg)

```css
.instagram-link.size-lg {
  padding: 1rem 1.75rem;
  font-size: 1.125rem;
}

.instagram-link.size-lg .instagram-icon {
  width: 1.5rem;
  height: 1.5rem;
}
```

---

## 💬 Inline Variant

For embedding in text:

### HTML
```html
<p>
  Follow me on 
  <a 
    href="https://instagram.com/creative_artist"
    target="_blank"
    rel="noopener noreferrer"
    class="instagram-link-inline"
  >
    <svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor">
      <!-- Icon SVG -->
    </svg>
    @creative_artist
  </a>
</p>
```

### CSS
```css
.instagram-link-inline {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.85rem;
  
  /* Soft gradient background */
  background: linear-gradient(
    135deg,
    rgba(240, 148, 51, 0.15),
    rgba(220, 39, 67, 0.15)
  );
  
  color: #e1306c;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  border: 1px solid #e1306c;
  
  transition: all 0.3s ease;
}

.instagram-link-inline:hover {
  background: linear-gradient(
    135deg,
    rgba(240, 148, 51, 0.25),
    rgba(220, 39, 67, 0.25)
  );
  color: #c13584;
  border-color: #c13584;
  transform: translateX(2px);
}
```

---

## 📱 Mobile Responsive

```css
/* Tablets and smaller */
@media (max-width: 768px) {
  .instagram-link {
    padding: 0.625rem 1rem;
    font-size: 0.95rem;
  }
  
  .instagram-icon {
    width: 1.125rem;
    height: 1.125rem;
  }
}

/* Small phones */
@media (max-width: 480px) {
  .instagram-link {
    padding: 0.5rem 0.85rem;
    font-size: 0.875rem;
    width: 100%;
    justify-content: center;
  }
  
  /* Hide arrow on mobile/touch */
  .instagram-arrow {
    display: none !important;
  }
  
  /* Ensure 44px minimum tap target */
  .instagram-link {
    min-height: 44px;
    min-width: 44px;
  }
}
```

---

## 🌙 Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  .instagram-link-inline {
    background: linear-gradient(
      135deg,
      rgba(224, 148, 51, 0.1),
      rgba(220, 39, 67, 0.1)
    );
    border-color: #e1306c;
  }
  
  .instagram-link-inline:hover {
    background: linear-gradient(
      135deg,
      rgba(224, 148, 51, 0.2),
      rgba(220, 39, 67, 0.2)
    );
  }
}
```

---

## 🎯 Complete HTML Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instagram Link Examples</title>
  <style>
    /* Paste CSS from above sections here */
    /* ... all the CSS styling ... */
  </style>
</head>
<body>
  <div style="max-width: 600px; margin: 2rem auto; padding: 2rem;">
    
    <h1>Instagram Link Examples</h1>
    
    <!-- Default Button -->
    <section style="margin: 2rem 0;">
      <h2>Default Style (Medium)</h2>
      <a 
        href="https://instagram.com/creative_artist"
        target="_blank"
        rel="noopener noreferrer"
        class="instagram-link size-md"
      >
        <svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.012-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.06 1.281-.073 1.689-.073 4.948 0 3.259.013 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.06-1.69-.073-4.949-.073z"/>
        </svg>
        <span class="instagram-username">@creative_artist</span>
        <span class="instagram-arrow" aria-hidden="true">↗</span>
      </a>
    </section>

    <!-- Size Variants -->
    <section style="margin: 2rem 0;">
      <h2>Size Variants</h2>
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <a href="#" target="_blank" rel="noopener noreferrer" class="instagram-link size-sm">
          <svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor"><!-- ... --></svg>
          <span>@small</span>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" class="instagram-link size-md">
          <svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor"><!-- ... --></svg>
          <span>@medium</span>
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" class="instagram-link size-lg">
          <svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor"><!-- ... --></svg>
          <span>@large</span>
        </a>
      </div>
    </section>

    <!-- Inline Example -->
    <section style="margin: 2rem 0;">
      <h2>Inline in Text</h2>
      <p>
        Follow me on 
        <a 
          href="https://instagram.com/creative_artist"
          target="_blank"
          rel="noopener noreferrer"
          class="instagram-link-inline"
        >
          <svg class="instagram-icon" viewBox="0 0 24 24" fill="currentColor"><!-- ... --></svg>
          @creative_artist
        </a>
        for daily inspiration.
      </p>
    </section>

  </div>
</body>
</html>
```

---

## 🔐 Security Checklist

✅ `target="_blank"` - Opens in new tab
✅ `rel="noopener noreferrer"` - Prevents window access attack
✅ No inline JavaScript event handlers
✅ ARIA labels for accessibility
✅ Semantic HTML structure
✅ No external resource calls

---

## 📝 JavaScript URL Validation

If using vanilla JavaScript to validate input:

```javascript
function validateInstagramUsername(username) {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: 'Username required' };
  }

  // Trim and remove @ symbol
  let normalized = username.trim().replace(/^@/, '');

  // Remove Instagram URLs if present
  normalized = normalized
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/\/$/, '');

  // Validate format
  const regex = /^(?!.*\.$)[a-zA-Z0-9._]{1,30}$/;

  if (!regex.test(normalized)) {
    return { 
      isValid: false, 
      error: 'Invalid format. Use letters, numbers, dots, underscores (1-30 chars)' 
    };
  }

  return {
    isValid: true,
    normalized: normalized,
    url: `https://instagram.com/${normalized}`
  };
}

// Usage
const result = validateInstagramUsername('@creative_artist');
if (result.isValid) {
  window.open(result.url, '_blank', 'noopener,noreferrer');
}
```

---

## 🎬 Live Example CSS Classes

```css
/* Full example you can copy-paste */

.instagram-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(224, 148, 51, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.instagram-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.instagram-link:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(224, 148, 51, 0.4);
}

.instagram-link:hover::before { left: 100%; }

.instagram-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.instagram-link:hover .instagram-icon { transform: scale(1.1); }

.instagram-username {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: letter-spacing 0.3s ease;
}

.instagram-link:hover .instagram-username { letter-spacing: 1px; }

.instagram-arrow {
  opacity: 0;
  transform: translate(-4px, 0);
  transition: all 0.3s ease;
  font-size: 0.875rem;
  margin-left: -0.5rem;
}

.instagram-link:hover .instagram-arrow {
  opacity: 1;
  transform: translate(2px, 0);
}
```

---

This HTML/CSS approach can be used to:
- Integrate Instagram links without React
- Understand the underlying component structure
- Customize styling further
- Build variations for other use cases
