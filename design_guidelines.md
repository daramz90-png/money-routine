# Design Guidelines: 쿠쿠의 돈루틴 Financial Dashboard

## Design Approach
**Selected Framework:** Material Design for Data-Dense Applications
**Rationale:** Financial dashboards require clear data hierarchy, excellent readability, and consistent interaction patterns. Material Design's elevation system and card-based layouts are ideal for organizing real-time market information.

**Key Design Principles:**
1. Information clarity over visual flair
2. Scannable data layouts with clear hierarchy
3. Consistent visual language for financial indicators
4. Purposeful use of space to reduce cognitive load

---

## Typography System

**Font Family:** 
- Primary: 'Pretendard' or 'Noto Sans KR' (Korean optimized)
- Fallback: system-ui, -apple-system

**Type Scale:**
- Page Title (h1): text-4xl (36px), font-bold
- Section Headers (h2): text-2xl (24px), font-bold
- Card Titles: text-lg (18px), font-semibold
- Data Values (primary): text-3xl (30px), font-bold
- Data Labels: text-sm (14px), font-medium
- Metadata/timestamps: text-xs (12px), font-normal
- Body text: text-base (16px)

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 8, 12 (e.g., p-4, gap-8, mb-12)

**Container Strategy:**
- Max width: max-w-4xl (960px) for optimal data scanning
- Outer padding: p-5 (mobile), p-8 (desktop)
- Section spacing: mb-10 between major sections
- Card gaps: gap-4 for grid layouts

**Grid System:**
- Mobile: grid-cols-1 (all cards stack)
- Tablet: grid-cols-2 (2-column market data)
- Desktop: grid-cols-4 (4-column market data grid)

---

## Component Library

### Header Component
- Gradient background with centered content
- Title + subtitle + date badge layout
- Update timestamp displayed prominently
- Padding: p-10 for breathing room

### Market Data Cards
- Elevated card style with rounded corners (rounded-xl)
- Internal padding: p-4
- Structure per card:
  - Icon/emoji indicator (top-left)
  - Label text (text-sm, opacity-75)
  - Large value display (text-3xl, font-bold)
  - Unit suffix (text-sm, inline)
  - Change indicator (percentage with arrow, text-sm)
- Loading state: skeleton shimmer animation
- Hover: subtle lift effect (shadow-md transition)

### Summary List Items
- Left border accent (border-l-4, w-1)
- Background: white with subtle shadow
- Padding: p-4
- Emoji bullet points for visual interest
- Hover: translate-x-1 with shadow increase

### Status Indicators
- Change values: Positive (green icon/text), Negative (red icon/text)
- Fear & Greed gauge: Circular progress indicator with value display
- Loading states: Pulsing skeleton UI

### Refresh Button
- Positioned top-right of section header
- Icon + text label
- Subtle interaction (no background, text color change on hover)

---

## Visual Hierarchy

**Priority 1 (Highest Emphasis):**
- Large numerical data values in market cards
- Page title
- 3-line summary items

**Priority 2 (Medium Emphasis):**
- Section headers
- Card labels
- Change percentages

**Priority 3 (Supporting Information):**
- Update timestamps
- Units/suffixes
- Metadata

---

## Data Presentation Standards

**Number Formatting:**
- Use locale-specific separators (e.g., 1,427.80)
- Decimal precision: 2 places for currencies, 0 for large integers
- Percentage changes: Always show +/- sign, 2 decimal places

**Change Indicators:**
- Positive: ↑ arrow with upward trend visual
- Negative: ↓ arrow with downward trend visual
- Display both icon and numeric percentage

**Loading States:**
- "로딩중..." text placeholder
- Shimmer animation on card backgrounds
- Maintain card structure during loading

---

## Interaction Patterns

**Data Updates:**
- Auto-refresh every 5 minutes
- Manual refresh button (top-right of section)
- Subtle fade animation on data change
- Timestamp updates with each refresh

**Card Interactions:**
- Hover: Slight elevation increase (shadow enhancement)
- No click action needed (information display only)
- Maintain visual consistency across all states

**Animations:**
- Entry: Staggered slideUp for sections (0.1s delay increments)
- Fade-in on mount
- Hover transitions: 200ms ease
- Loading: Continuous pulse for skeletons

---

## Responsive Behavior

**Mobile (<768px):**
- Single column layout for all cards
- Reduced padding (p-5)
- Maintained text sizes for readability
- Stack date and update info vertically

**Tablet (768px-1024px):**
- 2-column market data grid
- Moderate padding (p-6)

**Desktop (>1024px):**
- 4-column market data grid
- Full padding (p-8)
- Optimal max-width container

---

## Images

**Image Usage:** None required. This is a data-focused dashboard where numerical information and text content are primary. Visual indicators use icons rather than imagery.

**Icon Strategy:** Use lucide-react icons for visual indicators. This provides a consistent, professional look with proper scalability and theming support. Avoid emojis per global design rules.