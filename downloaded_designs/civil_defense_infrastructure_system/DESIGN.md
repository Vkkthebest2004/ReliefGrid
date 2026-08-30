---
name: Civil Defense Infrastructure System
colors:
  surface: '#faf9fd'
  surface-dim: '#dad9dd'
  surface-bright: '#faf9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f7'
  surface-container: '#efedf1'
  surface-container-high: '#e9e7eb'
  surface-container-highest: '#e3e2e6'
  on-surface: '#1a1b1e'
  on-surface-variant: '#44474e'
  inverse-surface: '#2f3033'
  inverse-on-surface: '#f1f0f4'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#000a1e'
  on-primary: '#ffffff'
  primary-container: '#002147'
  on-primary-container: '#708ab5'
  inverse-primary: '#aec7f6'
  secondary: '#115cb9'
  on-secondary: '#ffffff'
  secondary-container: '#659dfe'
  on-secondary-container: '#003370'
  tertiary: '#180500'
  on-tertiary: '#ffffff'
  tertiary-container: '#3d1500'
  on-tertiary-container: '#b97958'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f6'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#acc7ff'
  on-secondary-fixed: '#001a40'
  on-secondary-fixed-variant: '#004491'
  tertiary-fixed: '#ffdbcb'
  tertiary-fixed-dim: '#ffb691'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#6c391d'
  background: '#faf9fd'
  on-background: '#1a1b1e'
  surface-variant: '#e3e2e6'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for high-stakes governance and disaster response. It prioritizes stability, authority, and immediate clarity over aesthetic trends. The visual style is **Corporate / Modern**, leaning heavily into institutional trust through a structured, clean, and systematic interface. 

The target audience includes government officials, emergency responders, and administrative stakeholders. Every design decision focuses on cognitive load reduction, ensuring that critical data is readable and actionable during time-sensitive operations. The emotional response is one of calm reliability and unwavering professional standards.

## Colors
The palette is rooted in **Deep Government Navy**, symbolizing authority and institutional heritage. This is paired with **Muted Blue** for interactive elements and navigation. 

Functional colors are strictly reserved for status indication and disaster levels. The neutral scale uses a very light gray background to distinguish the application frame from the primary white surfaces of the content area. All color combinations are selected to meet or exceed WCAG 2.1 AA accessibility standards for text contrast.

## Typography
This design system utilizes **Public Sans**, an institutional typeface designed for accessibility and clarity. Headings utilize a semi-bold or bold weight in Deep Navy to establish a strong hierarchy. 

Body text is set in Dark Gray for optimal long-form reading comfort. On mobile devices, the `display-lg` and `headline-lg` roles should scale down by 15% to ensure they remain within the viewport without excessive wrapping. Paragraph spacing should be consistently maintained at 1.5x the line height to ensure legibility in dense reports.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop (12 columns, 1200px max-width) and a fluid model on mobile. A strict 4px baseline grid ensures vertical rhythm across all components.

- **Desktop:** Features a persistent white vertical sidebar (260px width) for primary navigation.
- **Tablet:** Sidebar collapses into a compact icon-only rail or a top-bar navigation depending on content density.
- **Mobile:** Uses a bottom-anchored navigation or a full-screen drawer triggered from a top-left hamburger menu. Margins are reduced to 16px to maximize screen real estate.

## Elevation & Depth
This design system uses **Tonal Layers** and **Low-contrast outlines** instead of heavy shadows to maintain a clean, official appearance. 

- **Level 0 (Background):** #F5F7FA – The foundation layer.
- **Level 1 (Cards/Sidebar):** White surface with a 1px border (#D9DEE5). No shadow.
- **Level 2 (Dropdowns/Modals):** White surface with a 1px border and a subtle, high-diffusion shadow (0px 4px 12px rgba(0, 0, 0, 0.05)).
- **Active State:** Elements may use a subtle inset highlight or a 2px Deep Navy left-border to indicate selection.

## Shapes
The shape language is conservative and disciplined. A **Soft** roundedness (4px) is used for buttons, input fields, and small badges. Larger containers like cards or the sidebar drawer use 8px (`rounded-lg`) to provide a modern but professional touch. Circular shapes are strictly reserved for profile avatars and icon backgrounds to avoid a "playful" appearance.

## Components

- **Buttons:** Primary buttons are solid Deep Navy with white text. Secondary buttons are outlined in Muted Blue. Use 4px corner radius.
- **Status Badges:** Small, compact indicators using a subtle background tint of the status color with high-contrast text (e.g., Critical uses light red background with #D32F2F text).
- **Professional Tables:** Data-dense layouts with no vertical lines. Use thin horizontal separators. Headers should be set in Deep Navy with `label-sm` styling and a subtle gray background.
- **Input Fields:** 1px border (#D9DEE5) that shifts to Muted Blue on focus. Labels are always visible above the field in `label-md`.
- **Cards:** White surfaces with 8px radius and a thin gray border. Titles should be `headline-sm`.
- **Vertical Sidebar:** White background, full height. Active items should be highlighted with a Deep Navy text color and a 4px vertical bar on the left edge.
- **Data Visualizations:** Use the status colors for alerts, but utilize Muted Blue and Deep Navy for general infrastructure metrics to maintain brand consistency.