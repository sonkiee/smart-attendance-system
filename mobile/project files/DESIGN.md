---
name: Precision Metric
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#ae0010'
  on-tertiary: '#ffffff'
  tertiary-container: '#d52022'
  on-tertiary-container: '#ffecea'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 16px
  gutter-mobile: 12px
---

## Brand & Style
The design system is built for a geofence-based attendance application, emphasizing utility, speed, and clinical reliability. The brand personality is functional and authoritative, stripping away decorative elements to focus on high-stakes data accuracy. 

The aesthetic is **High-Contrast Minimalism**. It utilizes a neutral, near-white foundation to ensure that status indicators (geofence proximity) and primary actions are unmistakable. The interface avoids ambiguity by using clear visual signifiers, heavy typographic weights for critical data, and a structured card-based architecture that creates a sense of organized, bite-sized information.

## Colors
The palette is engineered for immediate cognitive processing. 

- **Primary (Electric Blue):** Reserved for core attendance actions (Clock In/Out) and active navigation states.
- **Secondary (Emerald):** Exclusively signifies "Inside Zone" or successful synchronization.
- **Tertiary (Ruby):** Used for "Outside Zone" alerts and critical error states.
- **Neutral (Off-White/Slate):** The background (#F8F9FA) provides a low-strain canvas, while dark slate tones are used for text to maintain a high contrast ratio for accessibility in outdoor lighting conditions.

## Typography
This design system utilizes **Inter** for its systematic and utilitarian qualities. 

- **Headlines:** Use Bold (700) and SemiBold (600) weights to anchor the page. Headlines are tight in tracking to feel punchy and urgent.
- **Labels:** Labels for status badges and input headers use SemiBold weight with slight letter spacing (0.05em) for maximum legibility at small scales.
- **Captions:** Use a muted color hex (#64748B) to distinguish secondary metadata from primary content.

## Layout & Spacing
The layout follows a **fluid-width card model** optimized for mobile interaction. 

- **Grid:** A 4-column fluid grid for mobile with 16px outer margins.
- **Rhythm:** An 8pt linear scale governs all vertical rhythm.
- **Safe Zones:** High-priority actions (Clock In) are anchored to the bottom of the viewport using a sticky container with 24px padding to ensure thumb-reachability.
- **Card Spacing:** Cards are separated by 12px vertically to maintain clear individual identities while maximizing vertical real estate for logs.

## Elevation & Depth
To maintain a "clinical" feel, depth is used sparingly. 

- **Surface Strategy:** The background is #F8F9FA. Interactive cards sit on pure #FFFFFF surfaces.
- **Shadows:** Use a singular, soft ambient shadow for all floating elements: `0 4px 12px rgba(0,0,0,0.05)`. This provides enough lift to indicate interactability without introducing visual clutter.
- **State Indicators:** Depth is complemented by 2px solid borders for active input states or "Inside Zone" indicators to reinforce the hierarchy.

## Shapes
The shape language is "Soft-Modern." 

- **Standard Radius:** All primary cards and large buttons use a **16px (1rem)** radius to feel approachable and modern.
- **Small Elements:** Tooltips and status badges use a 6px radius to maintain a distinct visual language from larger containers.
- **Interactive States:** Buttons expand slightly or deepen in shadow on press, but never change their base corner radius.

## Components
- **Buttons:** Primary buttons are Electric Blue with white text, 16px radius, and a height of 56px for easy tapping. Success buttons (Clock In) transition to Emerald upon geofence validation.
- **Status Badges:** Compact pills with 100% roundedness. "Inside Zone" uses Emerald background (10% opacity) with Emerald text. "Outside Zone" uses Ruby background (10% opacity) with Ruby text.
- **Cards:** White background, 16px radius, 1px subtle border (#E2E8F0), and soft shadow. Used for shift details and location summaries.
- **Input Fields:** 56px height, 8px radius, #F1F5F9 background. Border becomes 2px Electric Blue on focus.
- **Attendance Log:** List items with 16px vertical padding, separated by a thin 1px hairline (#F1F5F9). Use icons to denote "In" vs "Out" events.
- **Geofence Map:** Minimalist map styling with a 50% opacity Emerald circle representing the perimeter.