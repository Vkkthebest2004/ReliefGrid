---
name: Tactical Response Light
colors:
  surface: '#FFFFFF'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006780'
  on-secondary: '#ffffff'
  secondary-container: '#76dcff'
  on-secondary-container: '#006077'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#b7eaff'
  secondary-fixed-dim: '#6cd3f7'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e61'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  border-subtle: '#E2E8F0'
  text-primary: '#0F172A'
  text-secondary: '#475569'
  status-crimson: '#DC2626'
  status-emerald: '#059669'
  status-amber: '#D97706'
typography:
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: 0.05em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '800'
    lineHeight: '1.1'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  data-metric:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
  data-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base-unit: 4px
  gutter-sm: 8px
  gutter-md: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  grid-columns: '12'
---

## Brand & Style

This design system translates the high-stakes precision of tactical operations into a high-clarity, light-mode environment. It is engineered for command centers and emergency responders who require maximum legibility in high-ambient light conditions. 

The aesthetic is **Institutional Minimalism**—a blend of modern professional software and government-grade utility. It retains its predecessor's authoritative tone through rigid structure and sharp typography but shifts the emotional response from "stealth and focus" to "transparency and immediate clarity." The UI evokes a sense of organized, high-readability intelligence where every pixel serves a functional purpose.

## Colors

The palette transitions to a high-luminance foundation to ensure clarity and professional appeal.

- **Primary (Command Blue - #2563EB):** Re-tuned for WCAG AA compliance on white backgrounds. Used for directive actions and official system states.
- **Secondary (Cyber Cyan - #0891B2):** A slightly deeper cyan than the dark mode original, maintaining the technical "telemetry" feel while ensuring legibility.
- **Neutral (Base - #F8FAFC):** A clean, off-white background that reduces glare compared to pure white.
- **Functional Accents:** Status colors (Crimson, Emerald, Amber) are darkened from their neon equivalents to remain punchy yet readable against light surfaces.
- **Typography Tones:** Headings utilize Deep Charcoal (#0F172A) for maximum contrast, while secondary body text uses Slate Grey (#475569) to establish a clear visual hierarchy.

## Typography

The typography maintains a tripartite functional structure:

1. **Command (Outfit):** Used for primary navigation, section headers, and high-level titles. The heavy weight and wide tracking project an institutional authority.
2. **Intelligence (Inter):** The workhorse for all body copy, descriptions, and user inputs. It provides a neutral, highly readable foundation.
3. **Telemetry (JetBrains Mono):** Reserved for data points, coordinates, timestamps, and IDs. Monospacing is critical for numerical alignment in live-updating tables.

On mobile devices, large headlines scale down to ensure they do not break into excessive lines while maintaining their characteristic "heavy" visual weight.

## Layout & Spacing

The layout is governed by a **Strict Modular Grid** to ensure density and information efficiency.

- **The 4px Rule:** All dimensions, padding, and margins are multiples of 4px.
- **High-Density Grid:** A 12-column fluid-width grid on desktop uses 16px gutters to pack information tightly without sacrificing scanability.
- **Internal Padding:** Components use a 2:1 ratio for padding (e.g., 16px horizontal / 8px vertical) to maintain a compact, instrument-like appearance.
- **Responsiveness:** For mobile devices, the grid collapses to a single column with 16px margins. Components that are horizontally dense on desktop should reflow into vertical stacks to maintain large, accessible tap targets.

## Elevation & Depth

In light mode, hierarchy is established through **Tonal Layering** and **Soft Shadows** rather than transparency.

- **Level 0 (Base):** Off-white (#F8FAFC) serves as the "ground" layer.
- **Level 1 (Surfaces):** Main content cards and panels are pure white (#FFFFFF) with a 1px Slate border (#E2E8F0).
- **Elevation Shadows:** Use highly diffused, low-opacity shadows (e.g., `0 4px 6px -1px rgba(15, 23, 42, 0.05)`) to lift active cards from the background. 
- **Active States:** Hover and focus states utilize a subtle interior "glow" using a 1px Cyber Cyan or Command Blue border, signaling interactivity through precision rather than movement.

## Shapes

The shape language is **Sharp and Disciplined**. 

Following the "Tactical Modernism" style, the system avoids large radii which feel too "consumer-friendly." A strict **4px (Soft/Level 1)** radius is used for all standard components like buttons, input fields, and cards. This maintains an authoritative, technical silhouette. Large modal containers may use **8px (Level 2)** to provide a clear distinction from the base grid, but the system should never utilize pill-shaped or organic, rounded corners.

## Components

- **Tactical Buttons:** 4px corners, using high-contrast fills. Primary buttons use Command Blue with white text. Secondary buttons are outlined with Cyber Cyan.
- **Data Cards:** Pure white backgrounds with a 1px Slate-200 border. Every card must include a top-aligned "Context Header" using JetBrains Mono at 12px for system telemetry.
- **Input Fields:** Use a subtle inset shadow and a 1px border (#E2E8F0). Focus states shift the border to Cyber Cyan with a 2px stroke. Monospaced font is required for any numeric input fields.
- **Status Badges:** Small, rectangular tags. Use bold status colors (Crimson, Emerald, Amber) with white text for critical states, or tinted backgrounds with dark text for informational states.
- **Tactical Lists:** High-density rows with 1px bottom borders. Each row should utilize JetBrains Mono for ID numbers or timestamps to ensure vertical alignment across long lists.
- **Refined Radar Beacons:** For active light-mode maps, beacons use a solid Status Crimson center with soft, semi-transparent expanding rings (#DC2626 at 10-20% opacity) to denote active signals.