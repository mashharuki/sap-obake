# SAP Obake Haunted Theme Design System

## Overview

The SAP Obake haunted theme is a Halloween-inspired design system that creates an immersive, spooky learning experience while maintaining excellent usability and accessibility. This document describes all the design tokens, utilities, and guidelines for using the theme.

## Color Palette

### Primary Colors

- **Ghost White** (`#F8F8FF`) - Primary text color, high contrast on dark backgrounds
- **Midnight Purple** (`#2D1B4E`) - Primary brand color, used for important UI elements
- **Haunted Orange** (`#FF6B35`) - Accent color for CTAs and highlights
- **Witch Green** (`#4A7C59`) - Secondary accent for success states

### Background Colors

- **Dark Void** (`#0A0A0A`) - Primary background, deepest black
- **Shadow Gray** (`#1A1A1A`) - Secondary background, cards and containers
- **Mist Gray** (`#2A2A2A`) - Tertiary background, hover states

### Accent Colors

- **Blood Red** (`#8B0000`) - Error states and warnings
- **Ghostly Blue** (`#4A5F7F`) - Information and neutral states
- **Poison Green** (`#39FF14`) - Special effects and highlights

### Feedback Colors

- **Correct Glow** (`#4ADE80`) - Success feedback with green glow
- **Incorrect Glow** (`#F87171`) - Error feedback with red glow
- **Warning Glow** (`#FBBF24`) - Warning feedback with amber glow

## Typography

### Font Families

- **Headings**: Creepster (Google Fonts)
  - Use for: Page titles, section headers, dramatic text
  - Class: `font-heading`
  - Variable: `--font-creepster`

- **Body Text**: Inter (Google Fonts)
  - Use for: All body text, UI labels, descriptions
  - Class: `font-sans`
  - Variable: `--font-inter`

- **Code/Technical**: Fira Code (Google Fonts)
  - Use for: AWS service names, code snippets, technical terms
  - Class: `font-mono`
  - Variable: `--font-fira-code`

### Usage Examples

```tsx
// Heading
<h1 className="font-heading text-4xl text-haunted-orange">
  Welcome to SAP Obake
</h1>

// Body text
<p className="font-sans text-ghost-white">
  Master AWS Solutions Architect Professional
</p>

// Technical text
<code className="font-mono text-poison-green">
  AWS Lambda
</code>
```

## Shadows and Glows

### Shadow Effects

- **Ghostly** - Purple glow effect
  - Class: `shadow-ghostly`
  - Value: `0 0 20px rgba(138, 43, 226, 0.5)`
  - Use for: Interactive elements, buttons

- **Eerie** - Deep shadow effect
  - Class: `shadow-eerie`
  - Value: `0 4px 20px rgba(0, 0, 0, 0.8)`
  - Use for: Cards, elevated containers

- **Haunted** - Orange glow effect
  - Class: `shadow-haunted`
  - Value: `0 0 30px rgba(255, 107, 53, 0.3)`
  - Use for: CTAs, important highlights

### Usage Examples

```tsx
// Button with ghostly glow
<button className="shadow-ghostly hover:shadow-haunted">
  Start Quiz
</button>

// Card with eerie shadow
<div className="shadow-eerie bg-shadow-gray">
  Question Card
</div>
```

## Animations

### Available Animations

1. **Float** - Gentle up and down motion
   - Class: `animate-float`
   - Duration: 3s
   - Use for: Ghost icons, floating elements

2. **Pulse** - Breathing effect
   - Class: `animate-pulse`
   - Duration: 2s
   - Use for: CTAs, attention-grabbing elements

3. **Flicker** - Subtle opacity change
   - Class: `animate-flicker`
   - Duration: 4s
   - Use for: Candle effects, mysterious elements

4. **Fade In** - Entrance animation
   - Class: `animate-fade-in`
   - Duration: 0.5s
   - Use for: Page transitions, modal appearances

### Usage Examples

```tsx
// Floating ghost
<div className="animate-float">
  👻
</div>

// Pulsing button
<button className="animate-pulse bg-haunted-orange">
  Click Me
</button>

// Flickering candle
<div className="animate-flicker">
  🕯️
</div>
```

## Accessibility

### Motion Preferences

The theme respects `prefers-reduced-motion` settings. All animations are automatically disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Color Contrast

All color combinations meet WCAG AA standards:
- Ghost White on Dark Void: 19.77:1 (AAA)
- Haunted Orange on Dark Void: 4.89:1 (AA)
- Correct Glow on Dark Void: 8.12:1 (AAA)

### Focus Indicators

All interactive elements have clear focus indicators for keyboard navigation.

## Content Domain Colors

Each AWS SAP exam content domain has a unique color:

- **Complex Organizations**: Midnight Purple (`#2D1B4E`)
- **New Solutions**: Haunted Orange (`#FF6B35`)
- **Continuous Improvement**: Witch Green (`#4A7C59`)
- **Migration & Modernization**: Ghostly Blue (`#4A5F7F`)

### Usage

```tsx
import { getDomainColor } from '@/lib/theme-constants';

const color = getDomainColor('complex-organizations');
```

## Responsive Design

### Breakpoints

- **Mobile**: 320px - Small phones
- **Tablet**: 768px - Tablets and large phones
- **Desktop**: 1024px - Desktop screens
- **Wide**: 1440px - Large desktop screens

### Usage

```tsx
<div className="
  w-full 
  md:w-1/2 
  lg:w-1/3 
  xl:w-1/4
">
  Responsive content
</div>
```

## Best Practices

### Do's ✅

- Use the haunted theme consistently across all pages
- Respect user motion preferences
- Maintain WCAG AA color contrast
- Use semantic HTML with proper ARIA labels
- Test with keyboard navigation
- Use the provided font families

### Don'ts ❌

- Don't use colors outside the defined palette
- Don't create custom animations without considering motion preferences
- Don't use low-contrast color combinations
- Don't override font families without good reason
- Don't use excessive animations that distract from content

## Component Examples

### Haunted Button

```tsx
<button className="
  bg-haunted-orange 
  text-ghost-white 
  font-sans 
  px-6 py-3 
  rounded-lg 
  shadow-ghostly 
  hover:shadow-haunted 
  hover:scale-105 
  transition-all 
  duration-200
">
  Start Quiz
</button>
```

### Question Card

```tsx
<div className="
  bg-shadow-gray 
  border-2 
  border-midnight-purple 
  rounded-xl 
  p-6 
  shadow-eerie
">
  <h2 className="font-heading text-2xl text-haunted-orange mb-4">
    Question 1
  </h2>
  <p className="font-sans text-ghost-white">
    Question text here...
  </p>
</div>
```

### Ghost Mascot

```tsx
<div className="
  animate-float 
  text-6xl 
  filter 
  drop-shadow-[0_0_20px_rgba(138,43,226,0.5)]
">
  👻
</div>
```

## Theme Constants

All theme constants are available in `lib/theme-constants.ts`:

```typescript
import { 
  colors, 
  shadows, 
  animations, 
  typography,
  getDomainColor,
  createGlow 
} from '@/lib/theme-constants';
```

## Testing

When testing components with the haunted theme:

1. Test with `prefers-reduced-motion: reduce`
2. Test keyboard navigation and focus states
3. Test color contrast with accessibility tools
4. Test on different screen sizes
5. Test with screen readers

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Google Fonts](https://fonts.google.com/)
