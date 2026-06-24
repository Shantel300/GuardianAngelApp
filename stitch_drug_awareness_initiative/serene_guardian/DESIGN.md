---
name: Serene Guardian
colors:
  surface: '#f7f9fc'
  surface-dim: '#d8dadd'
  surface-bright: '#f7f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f7'
  surface-container: '#eceef1'
  surface-container-high: '#e6e8eb'
  surface-container-highest: '#e0e3e6'
  on-surface: '#191c1e'
  on-surface-variant: '#5a403f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f4'
  outline: '#8e706f'
  outline-variant: '#e2bebc'
  surface-tint: '#b52330'
  primary: '#b52330'
  on-primary: '#ffffff'
  primary-container: '#ff5a5f'
  on-primary-container: '#61000e'
  inverse-primary: '#ffb3b0'
  secondary: '#0060ac'
  on-secondary: '#ffffff'
  secondary-container: '#68abff'
  on-secondary-container: '#003e73'
  tertiary: '#006d37'
  on-tertiary: '#ffffff'
  tertiary-container: '#00aa59'
  on-tertiary-container: '#003517'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b0'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001b'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a4c9ff'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#004883'
  tertiary-fixed: '#6bfe9c'
  tertiary-fixed-dim: '#4ae183'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#f7f9fc'
  on-background: '#191c1e'
  surface-variant: '#e0e3e6'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-page: 20px
  gutter-grid: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  container-padding: 20px
---

## Brand & Style

The design system is centered around a philosophy of "Protective Warmth." It bridges the gap between a high-stakes safety utility and a friendly, supportive companion. The brand personality is vigilant yet calm, utilizing a helpful mascot to reduce user anxiety during stressful situations.

The visual style is **Corporate Modern with a Soft Edge**, leaning into clean, high-contrast layouts for immediate legibility while using generous roundedness and playful iconography to maintain an approachable feel. The target audience spans from solo travelers and students to elderly users, requiring an interface that is both intuitive and comforting. Key emotional responses should be "I am safe" and "I am being looked after."

## Colors

This design system utilizes a high-contrast palette to ensure critical safety information is never missed. 

- **Primary (Coral Red):** Used for urgent actions, SOS triggers, and primary branding. It commands attention without feeling overly aggressive.
- **Secondary (Soft Blue):** Used for informational states, maps, and non-emergency navigation to provide a sense of calm.
- **Tertiary (Safety Green):** Dedicated to "Safe Arrival" states and positive confirmations.
- **Neutral:** A range of soft grays and off-whites are used for background surfaces to reduce eye strain and allow the primary colors to pop.

The default mode is **Light**, emphasizing clean white surfaces for maximum clarity, though a high-contrast dark mode should be utilized for nighttime safety contexts.

## Typography

The design system uses **Plus Jakarta Sans** for all levels to maintain a friendly, modern, and highly legible appearance. The typography strategy prioritizes a clear hierarchy:

- **Headlines:** Use Bold weights to ground the card-based layout and provide clear entry points for the eye.
- **Body:** Use Medium weights for instructions to ensure they are readable even in low-light or vibrating environments (e.g., walking quickly).
- **Labels:** Used for navigation and metadata, utilizing semi-bold weights to maintain visibility against colorful backgrounds.

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for mobile-first interactions. 

- **Grid:** A 4-column system for mobile and an 8-column system for tablet, with 16px gutters to ensure elements remain distinct.
- **Safe Zones:** A minimum 20px outer margin is maintained to prevent accidental triggers near screen edges.
- **Rhythm:** A base-8 scale is used for vertical rhythm. "Quick Action" buttons are sized at a minimum height of 56px to ensure a large tap target for users who may be under stress or in motion.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

1. **Base:** The background uses a soft neutral (off-white).
2. **Cards:** Primary content containers are pure white with subtle, highly-diffused shadows (Blur: 15px, Y: 4px, Opacity: 6% Black). This makes the content appear to float gently above the surface.
3. **Active Elements:** Interactive elements like the "SOS" button use a double-shadow technique to create a tactile, "pressable" feel, signifying high importance. 
4. **Overlays:** Full-screen modals or emergency alerts use a backdrop blur (10px) with a 40% opacity dark tint to focus the user's attention entirely on the critical task.

## Shapes

The shape language is defined by **Soft Geometricism**. All corners are rounded to remove visual tension and reinforce the "friendly companion" brand trait.

- **Standard Containers:** Cards and inputs use a 16px (1rem) radius.
- **Buttons:** Primary action buttons use a fully rounded (pill-shaped) style to maximize touch-friendliness.
- **Icons:** Encapsulated in circular or super-elliptical containers to maintain a cohesive look with the mascot’s organic form.

## Components

### Buttons
- **Primary:** Pill-shaped, #FF5A5F background with white text. High-elevation shadow.
- **Secondary:** Pill-shaped, white background with #4A90E2 border and text.
- **Emergency (SOS):** Large circular button with a pulsating outer glow to indicate its active state.

### Cards
- White background with a 1px soft gray border (#E1E8F0) and subtle ambient shadow. 
- Internal padding is strictly 20px to ensure content doesn't feel cramped.

### Input Fields
- Filled style with #F7F9FC background and 16px corner radius. 
- Focus state is indicated by a 2px #4A90E2 border.

### Chips & Badges
- Used for "Live" status or "Battery" indicators. 
- These use a "Soft Tonal" style: a low-opacity version of the status color (e.g., 10% Red) with high-saturation text for contrast.

### Lists
- Grouped in cards with subtle separators. Each list item includes a leading icon in a colored circle to aid rapid scanning.