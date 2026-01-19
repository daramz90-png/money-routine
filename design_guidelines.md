# Design Guidelines: 쿠쿠의 돈루틴 Financial Dashboard

## Design Approach
**Selected Framework:** Modern Korean Finance Dashboard with Rich Visual Design
**Visual References:** Modern fintech apps with gradient accents and card-based layouts
**User Preference:** User explicitly requested modern gradients, shadows, and visual impact

**Core Principles:**
1. Modern gradient accents for headers and hero sections
2. Card-based layouts with shadow effects for depth
3. Korean color conventions for financial data (red=상승, blue=하락)
4. Professional yet visually engaging design
5. Clear visual hierarchy with gradient backgrounds

---

## Typography System

**Font Family:** 
- Primary: 'Pretendard Variable', 'Noto Sans KR', system-ui, sans-serif

**Type Scale:**
- Page Title (h1): text-3xl to text-5xl, font-bold
- Section Headers (h2): text-2xl, font-bold
- Card Titles: text-lg, font-bold
- Data Values: text-2xl to text-3xl, font-bold
- Data Labels: text-sm, font-medium
- Body text: text-sm to text-base

---

## Color System

**Gradient Backgrounds (Per User Request):**
- Header: from-blue-600 via-indigo-600 to-purple-600
- Hero: from-blue-600 via-indigo-600 to-purple-700
- Quote Section: from-purple-600 via-indigo-600 to-blue-600
- Todo Section Accent: yellow-400 border with yellow/orange gradient background

**Surface Colors:**
- Background: soft gray (#F8F9FA in light mode)
- Cards: white with shadow-lg/shadow-md
- Dark mode: deep charcoal backgrounds

**Status Colors (Korean Financial Convention):**
- 상승 (Up/Positive): Red (#EF4444) - bg-red-100, text-red-600
- 하락 (Down/Negative): Blue (#3B82F6) - bg-blue-100, text-blue-600
- Neutral: Gray

**Accent Colors:**
- Primary: Blue-indigo gradient
- Section icons: Gradient backgrounds (blue, green, orange, purple, yellow)

---

## Layout System

**Container:**
- Max width: max-w-6xl (1152px)
- Outer padding: px-4 (mobile), expanding on larger screens
- Section spacing: py-8

**Grid System:**
- Mobile: grid-cols-1
- Tablet: grid-cols-2
- Desktop: grid-cols-4 for market cards

---

## Component Styles

### Header
- Gradient background (blue-indigo-purple)
- White text
- Shadow-xl for depth
- Sticky positioning
- Mobile hamburger menu

### Hero Section
- Full-width gradient background
- Large centered text
- Date badge with backdrop blur

### Cards
- White/card background
- shadow-md to shadow-lg
- Rounded corners (rounded-xl)
- hover-elevate for interactive cards
- No hover effects on pure data display

### Market Data Cards
- Clean card with shadow-md
- Icon + label at top
- Large bold value
- Change indicator badge (red for up, blue for down)

### Section Headers
- Gradient icon container (10x10)
- Bold text-2xl heading
- Flex layout with gap

### Todo Section
- Yellow-400 border (4px)
- Yellow-orange gradient background
- White inner cards

### Quote Section
- Purple-indigo-blue gradient
- White text
- Quote icon
- Centered layout

---

## Icons
- Use lucide-react icons exclusively
- No emojis (per global design rules)
- Icon size: w-4 h-4 to w-6 h-6 depending on context

---

## Responsive Behavior
- Mobile-first approach
- Flex-wrap on all horizontal flex containers
- Grid columns adjust by breakpoint
- Hamburger menu on mobile

---

## Animation
- Subtle hover effects using hover-elevate
- No heavy animations
- Smooth transitions (transition-all)

---

## Data Presentation

**Number Formatting:**
- Korean locale with comma separators
- Currency symbols where appropriate
- Percentage with +/- sign

**Status Indicators:**
- 상승: TrendingUp icon + red text/bg
- 하락: TrendingDown icon + blue text/bg
