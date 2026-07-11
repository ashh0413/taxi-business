# Taxi Hub — Design System Master

> Source of truth for all design decisions. Apply to every page.

---

## Brand DNA

| Element | Text |
|---------|------|
| **Tagline** | Driven by Trust. Defined by Care. |
| **Headline** | MORE THAN A RIDE. |
| **Family Line** | We're Family. |
| **Quote** | "Our drivers don't just drive, they treat you as family." |

---

## Design Pattern

**Pattern**: Service Discovery with Trust Focus
- Hero with emotional hook
- Service grid (bento-style)
- Fleet showcase
- Social proof (reviews)
- Clear CTAs (WhatsApp)

---

## Color System

### Dark Mode (Default)
```
--bg-primary:      #0a0a0c     /* Deep black */
--bg-secondary:   #141418     /* Card backgrounds */
--bg-tertiary:    #1a1a1f     /* Elevated surfaces */
--text-primary:   #ffffff     /* Headings */
--text-secondary: #e5e5e5     /* Body text */
--text-muted:     #888888     /* Subtle text */
--gold-primary:   #c9a030     /* Primary accent */
--gold-light:     #e8c96a     /* Highlights */
--gold-dark:      #a07820     /* Pressed states */
--border:         rgba(201, 160, 48, 0.18)
--glass-bg:       rgba(20, 20, 24, 0.7)
--glass-border:   rgba(255, 255, 255, 0.1)
--whatsapp:       #25D366
```

### Light Mode
```
--bg-primary:      #faf9f7     /* Warm white */
--bg-secondary:    #ffffff     /* Card backgrounds */
--bg-tertiary:     #f5f4f2     /* Elevated surfaces */
--text-primary:    #1a1a1a     /* Headings */
--text-secondary:  #4a4a4a     /* Body text */
--text-muted:      #888888     /* Subtle text */
--gold-primary:    #b8941f     /* Darker gold for contrast */
--gold-light:      #d4a82a     /* Highlights */
--gold-dark:       #9a7a18     /* Pressed states */
--border:         rgba(0, 0, 0, 0.08)
--glass-bg:       rgba(255, 255, 255, 0.7)
--glass-border:   rgba(0, 0, 0, 0.1)
--whatsapp:       #25D366
```

---

## Typography

**Headers**: Cormorant Garamond (serif, elegant)
- Hero: 54px / 700
- Section titles: 36px / 700
- Card titles: 19px / 700
- Script accent: Great Vibes (cursive)

**Body**: Montserrat (sans, clean)
- Nav: 8.5px / 600 / uppercase / letter-spacing 2px
- Body: 14px / 400
- Small: 12px / 400
- Labels: 9px / 600 / uppercase / letter-spacing 3px

**Google Fonts Import**:
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Montserrat:wght@300;400;500;600;700&family=Great+Vibes&display=swap');
```

---

## Glass Effects (CSS)

### Glass Card
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
}
```

### Glass Button
```css
.glass-btn {
  background: rgba(201, 160, 48, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(201, 160, 48, 0.3);
}
```

---

## Spacing System

```
--space-xs:  4px
--space-sm:  8px
--space-md:  16px
--space-lg:  24px
--space-xl:  32px
--space-2xl: 48px
--space-3xl: 64px
```

---

## Touch Targets (Mobile-First)

- **Minimum touch target**: 44px × 44px
- **Button padding**: 15px 28px minimum
- **Gap between targets**: 8px minimum
- **Touch-action**: manipulation (removes 300ms delay)

---

## Border Radius

```
--radius-sm:  7px   /* Buttons */
--radius-md:  10px  /* Cards */
--radius-lg:  14px  /* Large cards */
--radius-xl:  16px  /* Modals */
--radius-full: 9999px /* Pills */
```

---

## Shadows

```css
/* Light mode */
--shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.08);
--shadow-md:  0 4px 16px rgba(0, 0, 0, 0.12);
--shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.16);

/* Dark mode */
--shadow-sm:  0 2px 8px rgba(0, 0, 0, 0.4);
--shadow-md:  0 4px 16px rgba(0, 0, 0, 0.5);
--shadow-lg:  0 8px 32px rgba(0, 0, 0, 0.6);
```

---

## Transitions

```css
--transition-fast:   150ms ease;
--transition-normal: 250ms ease;
--transition-slow:   400ms ease;
```

---

## Z-Index Scale

```
--z-base:    0
--z-card:    10
--z-sticky:  20
--z-nav:     50
--z-fab:     100
--z-modal:   200
--z-toast:   300
```

---

## Page Layout

### Mobile Shell
```
max-width: 430px
margin: 0 auto
min-height: 100vh
```

### Section Padding
```
padding-left/right: 22px
section-gap: 28-32px
```

### Bottom Navigation (Sticky)
```
position: sticky
bottom: 0
height: ~70px
backdrop-filter: blur(20px)
```

---

## WhatsApp CTA

Every page needs WhatsApp integration:

```html
<!-- Base URL -->
https://wa.me/919158798744

<!-- Pre-filled message -->
https://wa.me/919158798744?text=Hi%2C%20I%27d%20like%20to%20book%20a%20taxi%20in%20Goa.
```

### CTA Button Style
```css
.btn-whatsapp {
  background: #25D366;
  color: white;
  padding: 15px 28px;
  border-radius: 7px;
  font-weight: 700;
  letter-spacing: 2px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
```

---

## Component Library

### 1. Service Card (Bento Grid)
- Icon + Label
- 2x2 grid on mobile
- Glass background
- Hover: border glow

### 2. Fleet Card
- Car image (left)
- Name + features (right)
- Price badge
- Book CTA

### 3. Route Card
- Background image
- Overlay gradient
- Title + duration
- Starting price

### 4. Review Card
- Star rating
- Quote text
- Customer name
- Glass background

### 5. Accordion (FAQ)
- Question as trigger
- Smooth expand/collapse
- Plus/minus icon

---

## Accessibility Checklist

- [ ] Color contrast: 4.5:1 minimum (text on backgrounds)
- [ ] Touch targets: 44px minimum
- [ ] Focus states: visible outline
- [ ] Alt text: all images
- [ ] Reduced motion: respect prefers-reduced-motion
- [ ] Keyboard navigation: logical tab order

---

## Anti-Patterns (AVOID)

- ❌ Emojis as icons (use SVG)
- ❌ Horizontal scroll without purpose
- ❌ Tiny touch targets (< 44px)
- ❌ Low contrast text in light mode
- ❌ Transparent glass cards in light mode (use opacity 0.7+)
- ❌ Instant state changes (use transitions)

---

## Files Structure

```
d:\PROJECTS\Taxi-business\
├── design-system/
│   └── MASTER.md           ← This file
├── css/
│   └── styles.css          ← All styles
├── js/
│   └── main.js             ← Interactions, theme toggle
├── index.html              ← Home
├── airport.html            ← Airport transfers
├── sightseeing.html        ← North + South Goa
├── fleet.html              ← All vehicles
├── bulk.html               ← Corporate/Bulk
├── gallery.html            ← Photo gallery
├── tips.html               ← Travel blog
├── faq.html                ← FAQ
└── contact.html            ← Contact + Map
```
