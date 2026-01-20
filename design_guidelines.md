# Design Guidelines: 쿠쿠의 돈루틴 Premium Financial Dashboard

## Design Approach
**Framework:** Sophisticated Korean Fintech Dashboard (Bloomberg Terminal meets Korean Premium Banking)
**Visual References:** Samsung Securities, KB Premium Banking, Stripe Dashboard, Bloomberg Professional
**Core Philosophy:** Trustworthy luxury through restraint - dark, sophisticated gradients with clean card hierarchies

**Design Principles:**
1. Dark navy/slate gradients for premium atmosphere
2. Deep shadows and layered cards for depth and trust
3. Korean financial conventions strictly maintained
4. Generous whitespace for sophistication
5. Content-rich sections with clear hierarchy

---

## Typography System

**Font Stack:** 'Pretendard Variable', 'Noto Sans KR', system-ui, sans-serif

**Hierarchy:**
- Hero Title: text-4xl lg:text-6xl, font-bold
- Section Headers: text-3xl, font-bold
- Subsection Titles: text-xl, font-semibold
- Card Headlines: text-lg, font-bold
- Market Values: text-2xl to text-4xl, font-bold, tabular-nums
- Body/Article Text: text-base, leading-relaxed
- Captions/Labels: text-sm, font-medium

---

## Color Palette

**Sophisticated Gradients:**
- Header/Hero: from-slate-900 via-blue-900 to-indigo-950
- Section Accents: from-slate-800 to-slate-900
- Newsletter CTA: from-indigo-900 via-blue-800 to-slate-900

**Surface Colors:**
- Background: slate-50 (light) / slate-950 (dark)
- Primary Cards: white with shadow-xl
- Secondary Cards: slate-100/slate-800
- Dividers: slate-200/slate-700

**Financial Status (Korean Convention):**
- 상승: Red (#DC2626) - bg-red-50, text-red-600, border-red-200
- 하락: Blue (#2563EB) - bg-blue-50, text-blue-600, border-blue-200

**Accent Colors:**
- Primary Action: indigo-600
- Links: blue-700
- Success: emerald-600

---

## Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16, 20, 24 (consistent rhythm)

**Container Widths:**
- Main content: max-w-7xl
- Article content: max-w-4xl
- Newsletter form: max-w-2xl

**Grid Patterns:**
- Market Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-4, gap-6
- Column Articles: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8
- Featured Content: 2-column asymmetric layout (8/4 split)

---

## Core Components

### Header
- Dark gradient background (slate-blue-indigo)
- White text, height 16
- Logo + Navigation + CTA button
- Sticky with shadow-2xl on scroll
- Mobile: hamburger menu

### Hero Section
- **Large hero image**: Professional financial imagery (cityscape, trading floor, modern office)
- Dark overlay gradient (from-slate-900/80 to-transparent)
- Hero content: centered, white text
- CTAs with backdrop-blur-sm bg-white/10 (no hover states on blur buttons)
- Height: min-h-[600px] lg:min-h-[700px]

### Real-Time Market Cards
- White cards with shadow-lg
- Icon (gradient background circle) + Market name
- Large tabular value (text-3xl)
- Status badge (red/blue pill shape)
- Grid layout, equal height

### Investment Column Cards
- Image thumbnail (16:9 ratio, rounded-t-xl)
- White card body with shadow-md
- Category badge, headline, excerpt, author/date
- hover:shadow-xl transition

### Newsletter Section
- Full-width gradient background
- Centered content (max-w-2xl)
- Compelling headline + benefits list
- Email input + submit button (inline form)
- Trust indicators (subscriber count, privacy note)

### Footer
- Dark slate background (bg-slate-900)
- 4-column grid: Company, Products, Resources, Legal
- Social links, contact info
- Newsletter signup (secondary placement)
- Copyright with subtle divider

---

## Icons & Assets
- **Icons:** Lucide-react exclusively (TrendingUp, TrendingDown, Building2, Newspaper, Mail, ChevronRight)
- **Icon Sizes:** w-5 h-5 (standard), w-6 h-6 (section headers)
- **No emojis**

### Images
**Hero Image:** 
- Professional financial cityscape or modern trading floor
- High quality, dark tones, professional photography
- Placement: Full-width background with overlay

**Column Thumbnails:**
- Real estate imagery, investment charts, financial concepts
- 16:9 aspect ratio
- Placement: Top of article cards

---

## Component Details

**Market Status Indicators:**
- Pill shape badges (px-3 py-1, rounded-full)
- Icon + percentage change
- Red (상승) or Blue (하락) backgrounds

**Section Headers:**
- Gradient icon container (w-12 h-12, rounded-xl)
- Bold headline
- Optional subtitle (text-slate-600)
- Bottom border (border-b border-slate-200)

**Cards:**
- Consistent padding: p-6
- Rounded corners: rounded-xl
- Shadows: shadow-lg (primary), shadow-md (secondary)
- Hover: hover:shadow-xl transition-shadow

**Buttons:**
- Primary: bg-indigo-600 hover:bg-indigo-700
- Secondary: border-2 border-indigo-600 hover:bg-indigo-50
- On hero images: bg-white/10 backdrop-blur-sm border border-white/20 (no additional hover/active states)

---

## Responsive Strategy
- Mobile: Single column, stacked layout
- Tablet: 2-column grids
- Desktop: 3-4 column grids, side-by-side sections
- All flex containers: flex-wrap
- Touch-friendly tap targets: min 44x44px

---

## Data Formatting
- Korean locale numbers: 1,234,567
- Currency: ₩ symbol, comma separators
- Percentages: +2.5%, -1.3% with appropriate colors
- Dates: YYYY.MM.DD format

---

## Animation & Interaction
- Minimal, purposeful animations
- Card hover: shadow elevation only
- Transitions: transition-shadow, transition-colors (300ms)
- No distracting motion
- Smooth scroll behavior