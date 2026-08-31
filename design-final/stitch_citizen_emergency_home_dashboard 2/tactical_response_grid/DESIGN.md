---
name: Tactical Response Grid
colors:
  surface: '#061327'
  surface-dim: '#061327'
  surface-bright: '#2d394f'
  surface-container-lowest: '#020e22'
  surface-container-low: '#0f1c30'
  surface-container: '#132034'
  surface-container-high: '#1e2a3f'
  surface-container-highest: '#29354b'
  on-surface: '#d6e3ff'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#d6e3ff'
  inverse-on-surface: '#243146'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#cf2c30'
  on-tertiary-container: '#ffecea'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#061327'
  on-background: '#d6e3ff'
  surface-variant: '#29354b'
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
    letterSpacing: '0'
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
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter-sm: 8px
  gutter-md: 16px
  margin-desktop: 32px
  margin-mobile: 16px
  grid-columns: '12'
---

## Brand & Style

The design system is engineered for high-stakes environments where clarity, speed, and authority are paramount. It serves a dual audience: tactical command operators requiring high-density data visualization and citizens in distress needing immediate, unambiguous action paths.

The aesthetic follows a **Tactical Modernism** approach—combining the precision of developer tools with the reliability of institutional command centers. It utilizes high-contrast interfaces, glassmorphic layering for situational awareness, and a strict adherence to a "Command Dark" environment to reduce eye fatigue during extended operations. The emotional response is one of controlled urgency: "The situation is critical, but the system is in control."

## Colors

The palette is anchored in **Deep Space Navy**, providing a low-luminance foundation that makes tactical overlays "pop." 

- **Command Blue (#2563EB):** Reserved for primary mission actions and verified official status.
- **Cyber Cyan (#06B6D4):** Used for telemetry, active data streams, and "safe" system vitals.
- **Critical Crimson (#EF4444):** Exclusively for life-safety alerts, SOS signals, and resource depletion.
- **Surface & Borders:** Surfaces use **Command Dark Navy** with semi-transparent overlays. Borders are strictly defined by **Slate-800**, ensuring structural definition without introducing light leaks.

## Typography

Typography is categorized into three distinct functional roles:

1.  **Command (Outfit):** Heavyweight headings with increased tracking to project authority. Used for section titles and tactical COP labels.
2.  **Intelligence (Inter):** High-legibility sans-serif for body text, news feeds, and shelter descriptions. Reliability is the priority.
3.  **Telemetry (JetBrains Mono):** A monospaced face used for all variable data—coordinates, timestamps, occupancy counts, and sensor metrics. This ensures that numbers do not shift horizontally as they update in real-time.

## Layout & Spacing

This design system utilizes a **Fixed-Fluid Hybrid Grid** optimized for high-density information display.

- **Tactical Dashboards:** Use a 12-column grid with tight 16px gutters to maximize screen real estate. Components should favor horizontal density to minimize scrolling.
- **Citizen Interfaces:** Transition to a single-column fluid layout on mobile, prioritizing large-tap targets and vertical hierarchy.
- **Spacing Rhythm:** All spacing is derived from a 4px base unit. Component internal padding should strictly follow a 2:1 ratio (e.g., 16px horizontal, 8px vertical) to maintain a compact, "instrument panel" feel.

## Elevation & Depth

Hierarchy is established through **Glassmorphic Stratification** rather than traditional shadows.

- **Level 0 (Base):** Deep Space Navy background.
- **Level 1 (Sub-surface):** Command Dark Navy with 1px Slate-800 borders.
- **Level 2 (Active Panels):** 60% opacity Command Navy with a 20px backdrop blur. This allows tactical maps to remain partially visible beneath overlays, maintaining situational context.
- **Interaction Depth:** Instead of "lifting" on hover, elements should "glow." Use 0.5px inner borders (Cyber Cyan or Command Blue) to indicate active or focused states. 
- **Beacons:** Active SOS signals use a "Radar Pulse"—multiple concentric, expanding rings with decreasing opacity to simulate a live broadcasting signal.

## Shapes

The shape language is **Precision-Engineered**. 

Avoid "organic" or "friendly" roundedness. Use a strict **4px (Soft/Level 1)** radius for standard components like buttons, input fields, and cards. This creates a sharp, professional silhouette that aligns with the monospaced data elements. Large containers or modal sheets may use up to 12px (rounded-xl) to distinguish them from the base grid, but never pill-shaped unless used for status tags/chips.

## Components

- **Tactical Buttons:** Sharp 4px edges. Primary actions use Command Blue with white text. Critical actions (SOS) use Critical Crimson with a persistent pulsing animation.
- **Data Cards:** Background-blur containers with a 1px border. The top-left corner must always feature a "Telemetry Label" using JetBrains Mono at 12px.
- **Status Chips:** Small, rectangular badges. Use Cyber Cyan for "Active/Stable," Amber for "Warning," and Critical Crimson for "Immediate Threat."
- **Input Fields:** Darker than the surface level (#000A1E), with Cyber Cyan focus borders. Use monospaced font for numeric inputs.
- **Radar Beacons:** A central red dot with 3-4 expanding translucent rings. The pulse speed should reflect urgency (e.g., 1s cycle for Critical, 3s for Informational).
- **Tactical Maps:** Dark-themed base layer with high-contrast glyphs. All interactive map markers must be at least 44px in diameter for touch accessibility in high-stress scenarios.