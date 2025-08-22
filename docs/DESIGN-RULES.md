# General Design & UI Guidelines for AI Assistance (React/Tailwind/shadcn)

These rules guide AI implementation of UI elements to ensure visual consistency, adherence to design specifications, and best practices for modern web development using React, Tailwind CSS, and shadcn/ui.

## Core Principles

### 1. Primacy of Visual Specifications
- Base all UI implementation primarily on the provided target design images, mockups, or detailed visual specification documents (e.g., CopyCoder outputs, Figma links).
- Pay close attention to layout, spacing, typography, color palettes, rounding, and overall visual hierarchy depicted in the specs.

### 2. Leverage Component Library

#### Use shadcn/ui First
- Whenever implementing standard UI elements (Buttons, Cards, Forms, Inputs, Dialogs, Menus, Tables, Alerts, etc.), always use the corresponding components from the shadcn/ui library (assuming it's installed in the project). 
- Import them from `@/components/ui/...`

#### Custom Components
- Only create custom UI components from scratch if a suitable shadcn/ui component does not exist or cannot be easily adapted for the required functionality or unique visual style.

### 3. Styling with Tailwind CSS
- Implement all styling using Tailwind CSS utility classes.
- Apply colors, spacing, typography, layout (Flexbox/Grid), rounding, shadows, etc., using Tailwind classes based on the visual specifications.

#### No Custom CSS/Styled-Components
- Avoid writing custom CSS files (.css, .scss) or using CSS-in-JS libraries like styled-components unless absolutely necessary for complex animations, highly specific overrides, or if it's an established pattern in the project, and only with explicit instruction.

## Iconography

### Default Icon Library (Lucide React)
- For icons within the application (buttons, status indicators, list items, etc.), use icons from the lucide-react library by default, as it integrates well with shadcn/ui and Tailwind.
- Import icons directly: `import { IconName } from 'lucide-react';`

### Icon Specification & Usage
- When specific icons are required for UI elements based on design specs, use the specified lucide-react icon name.
- If no specific icon is given, choose a lucide-react icon that semantically matches the element's purpose:
  - `Trash2` for delete
  - `Edit` for edit
  - `Plus` for add
  - `Check` for success
  - `X` for close/fail
  - `AlertTriangle` for warning
  - `Download` for download
- Apply size (e.g., `h-4 w-4`, `h-5 w-5`) and color (e.g., `text-red-500`, `text-green-600`) using Tailwind classes as needed to match the design.
- **Verification**: Always double-check chosen icon names against the official Lucide library documentation (https://lucide.dev/) if unsure.

## Layout & Responsiveness

### Responsive Design
- Implement layouts that are responsive and adapt gracefully to different screen sizes (mobile, tablet, desktop).
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) extensively to adjust layout, spacing, typography, and visibility across breakpoints.
- Utilize Flexbox (`flex`, `items-center`, `justify-between`, etc.) and CSS Grid (`grid`, `grid-cols-*`, `gap-*`, etc.) via Tailwind classes for layout structure.

### Consistency
- Maintain consistency in:
  - Spacing (padding/margins using `p-*`, `m-*`, `space-x-*`)
  - Typography (font sizes/weights using `text-*`, `font-*`)
  - Border rounding (`rounded-*`)
  - Color usage across the application
- Adhere to the project's design system or visual specs

## AGRO AI Specific Design Guidelines

### Agricultural Theme
- Use earthy, natural colors:
  - Primary: Green shades (`green-600`, `green-700`)
  - Secondary: Earth tones (`amber-600`, `yellow-600`)
  - Accent: Sky blues (`sky-500`, `blue-600`)
- Prefer rounded corners for friendly appearance (`rounded-lg`, `rounded-xl`)
- Use generous whitespace for clean, uncluttered look

### Mobile-First Approach
- Design for thumb-friendly interaction:
  - Minimum touch target: 44x44px (`min-h-[44px] min-w-[44px]`)
  - Important actions at bottom of screen on mobile
  - Swipeable cards for producer browsing
- High contrast for outdoor visibility
- Large, readable fonts (`text-base` minimum on mobile)

### Producer Cards
- Use shadcn/ui Card component as base
- Include:
  - Hero image with aspect ratio 16:9
  - Producer name in bold (`font-semibold text-lg`)
  - Categories as badge components
  - Distance indicator with location icon
  - Clear CTA button for details

### Map Integration
- Full-screen map on mobile with overlay controls
- Floating action buttons for map controls
- Custom markers using Lucide icons
- Cluster nearby producers at zoom levels

### Accessibility
- WCAG 2.1 AA compliance minimum
- Focus indicators on all interactive elements
- Proper ARIA labels for screen readers
- Color not sole indicator of information

## Card Layout Consistency

### Vertical Alignment in Card Grids
- When displaying cards in a grid layout, ensure all cards maintain consistent vertical alignment
- Variable content sections (like tags, badges, or metadata) should have fixed minimum heights
- Use `min-h-[*px]` to reserve space for content that may span multiple lines
- Example: For a tags section that may have 1-2 lines, use `min-h-[52px]` to accommodate two lines
- This prevents cards from having different heights and ensures image galleries and action buttons align across all cards in the grid

### Content Section Heights
- Identify variable-height content sections in cards (tags, descriptions, etc.)
- Calculate the maximum likely height based on:
  - Line height of the text
  - Maximum number of expected lines
  - Gap between elements
- Apply consistent minimum heights to these sections across all cards
- This is especially important for:
  - Tag/badge sections
  - Multi-line descriptions
  - Category listings
  - Any content that wraps to multiple lines