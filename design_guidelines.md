# Design Guidelines: 쿠쿠의 돈루틴 Financial Dashboard

## Design Approach
**Selected Framework:** Material Design for Data-Dense Applications + Korean Finance App Conventions
**Visual References:** Toss 증권, KB증권, Naver Finance
**Rationale:** Korean financial dashboards demand extreme data density, high readability, and culturally-appropriate visual language. Clean, minimal aesthetic with strategic use of elevation and professional color coding.

**Core Principles:**
1. Data clarity above all - maximum information density without clutter
2. Korean color conventions for financial data (red=상승, blue=하락)
3. Subtle depth through elevation, not gradients
4. Professional, trustworthy visual language
5. Rapid scanning with clear visual hierarchy

---

## Typography System

**Font Family:** 
- Primary: 'Pretendard Variable' (Google Fonts CDN)
- Fallback: 'Noto Sans KR', system-ui, sans-serif

**Type Scale:**
- Page Title (h1): text-2xl (24px), font-bold - compact header
- Section Headers (h2): text-lg (18px), font-bold
- Card Titles: text-sm (14px), font-semibold
- Data Values (primary): text-3xl (30px), font-bold - high contrast
- Data Values (secondary): text-xl (20px), font-semibold
- Data Labels: text-xs (12px), font-medium, uppercase tracking
- Metadata/timestamps: text-xs (12px), font-normal
- Body text: text-sm (14px), font-normal

**Korean-Specific Adjustments:**
- Line height: leading-tight for Korean text (1.25)
- Letter spacing: tracking-tight (-0.025em) for dense layouts

---

## Color System

**Light Mode Foundation:**
- Background: Soft gray (#F8F9FA)
- Surface: Pure white (#FFFFFF)
- Surface elevated: White with shadow-sm

**Accent Color (Strategic Use Only):**
- Primary Accent: Deep Indigo (#3B4DB8) - use for CTAs, active states, key highlights only
- Do NOT use accent for backgrounds or large areas

**Status Colors (Korean Convention):**
- 상승 (Up/Positive): Red (#EF4444) - replaces traditional green
- 하락 (Down/Negative): Blue (#3B82F6) - replaces traditional red
- Neutral: Gray (#6B7280)

**Text Hierarchy:**
- Primary text: Gray-900 (#111827) - maximum contrast
- Secondary text: Gray-600 (#4B5563)
- Tertiary text: Gray-400 (#9CA3AF)

**Dark Mode:**
- Background: Dark Gray (#18181B)
- Surface: Charcoal (#27272A)
- Surface elevated: Lighter charcoal (#3F3F46) with shadow-lg
- Primary text: Gray-50 (#F9FAFB)
- Secondary text: Gray-400 (#9CA3AF)
- Maintain same status colors with adjusted opacity for dark backgrounds

**Borders & Dividers:**
- Light mode: Gray-200 (#E5E7EB)
- Dark mode: Gray-700 (#374151)

---

## Layout System

**Spacing Primitives:** Tailwind units of 4, 8, 12, 16 only
- Micro spacing: 4 (1rem)
- Standard spacing: 8 (2rem)
- Section spacing: 12 (3rem)
- Major spacing: 16 (4rem)

**Container Strategy:**
- Max width: max-w-6xl (1152px) for data dashboards
- Outer padding: px-4 py-6 (mobile), px-8 py-8 (desktop)
- Section spacing: mb-8 between sections
- Card gaps: gap-4 for grids

**Grid System:**
- Mobile: grid-cols-1
- Tablet: grid-cols-2
- Desktop: grid-cols-4 for market cards, grid-cols-3 for summary items

---

## Component Library

### Header Component
- Compact design: py-6 px-4
- Background: White (light) / Charcoal (dark) with border-b
- Layout: Title + last update timestamp in single row
- No gradient, no heavy decoration
- Shadow: shadow-sm for subtle elevation

### Market Data Cards
- Surface: White background with shadow-sm, rounded-lg
- Border: border border-gray-200 (light) / border-gray-700 (dark)
- Internal padding: p-4
- Structure:
  - Label (top): text-xs, uppercase, gray-600
  - Value (center): text-3xl, font-bold, gray-900
  - Change indicator (bottom): text-sm with arrow, red/blue per convention
- Loading: Subtle skeleton pulse without animation distraction
- No hover effects - this is data display only

### Summary Cards
- Same card treatment as market data
- Left border accent: border-l-4 in accent color for active items
- Padding: p-4
- Dense text layout with clear hierarchy
- Icon indicators from lucide-react

### Data Table Rows (for detailed views)
- Alternating row background: even rows get gray-50 (light) / gray-800 (dark)
- Row padding: py-2 px-4
- Border-bottom: border-gray-200
- Hover: bg-gray-100 (light) / bg-gray-700 (dark)

### Status Indicators
- 상승: ↑ arrow + red text + red background at 10% opacity
- 하락: ↓ arrow + blue text + blue background at 10% opacity
- Badge style: px-2 py-1, rounded, text-xs, font-semibold

### Refresh Button
- Position: Inline with section header (right-aligned)
- Style: Minimal - icon + text in gray-600
- Interaction: Text darkens on hover, no background

---

## Visual Hierarchy

**Critical Data (Highest Contrast):**
- Numerical values in cards (text-3xl, font-bold, gray-900)
- Status change percentages with color coding
- Page title

**Secondary Information:**
- Card labels and section headers
- Timestamps and metadata
- Supporting text

**Tertiary (Subtle):**
- Borders, dividers
- Background differentiators
- Helper text

---

## Data Presentation Standards

**Number Formatting:**
- Korean locale: 1,427.80 (comma separators)
- Currency: ₩ prefix or Won suffix
- Percentage: Always +/- sign, 2 decimals
- Large numbers: 억/만 units for Korean readability

**Status Indicators:**
- Positive changes: ↑ + red + percentage
- Negative changes: ↓ + blue + percentage
- Zero change: — with neutral gray

**Loading States:**
- Text placeholder: "데이터 로딩중..."
- Skeleton: Light gray pulse, maintains layout structure
- No heavy animations

---

## Responsive Behavior

**Mobile (<768px):**
- Single column, full card stacking
- Reduced padding: px-4 py-6
- Compact header: vertical stacking of title/timestamp
- Maintained text sizes for readability

**Tablet (768px-1024px):**
- 2-column grid for market data
- Moderate padding: px-6 py-8

**Desktop (>1024px):**
- 4-column market grid, 3-column summary grid
- Full padding: px-8 py-8
- Optimal scanning width with max-w-6xl

---

## Dark Mode Implementation

**Surface Elevation:**
- Level 0 (background): #18181B
- Level 1 (cards): #27272A with shadow-lg
- Level 2 (modals/overlays): #3F3F46 with shadow-xl

**Text Adjustments:**
- Maintain same hierarchy, adjust opacity
- Primary: gray-50
- Secondary: gray-400
- Reduce contrast slightly to prevent eye strain

**Status Colors:**
- Keep red/blue convention
- Adjust brightness: 상승 #FCA5A5, 하락 #93C5FD
- Background overlays at 15% opacity

---

## Images

**Image Usage:** None. This is a data-focused financial dashboard where numerical information is primary. All visual indicators use lucide-react icons for consistency and professionalism.

**Icon Library:** lucide-react via CDN for arrows, refresh, charts, trending indicators

---

## Animations

**Minimal Animation Policy:**
- Entry animations: Simple fadeIn only
- Data updates: Subtle 200ms color transition
- Loading: Light pulse (not distracting)
- No scroll animations, parallax, or decorative motion
- Focus on instant data readability