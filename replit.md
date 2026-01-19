# 쿠쿠의 돈루틴 (Kuku's Money Routine)

## Overview

A comprehensive Korean financial dashboard application that displays real-time market data including exchange rates, stock indices, cryptocurrency prices, and market sentiment indicators. Features a modern gradient design with rich visual elements, admin content management, and multiple content sections for daily financial check-ins.

## Recent Changes (2026-01-19)

- Complete visual redesign with modern gradient backgrounds (blue-indigo-purple)
- Added sticky header with navigation and mobile hamburger menu
- New hero section with gradient background
- 8 comprehensive content sections: summary, IPO/real estate schedule, news, todos, market data, quote, closing
- New admin page (/admin) for content management with localStorage persistence
- Professional card-based layouts with proper shadows and hover effects

## User Preferences

- Preferred communication style: Simple, everyday language
- Design preference: Modern gradients, shadows, visual impact (explicitly requested)
- Language: Korean

## Application Structure

### Pages
- `/` - Home page with full dashboard
- `/admin` - Admin page for content management

### Dashboard Sections
1. **Hero Section** - Gradient banner with title and date
2. **오늘의 주요 요약** - Daily key summaries with checkmarks
3. **오늘의 재테크 일정** - IPO and real estate schedules (2-column layout)
4. **오늘의 뉴스픽** - News cards with blue accent
5. **오늘 해야하는 것** - Todo items with yellow border accent
6. **주요 항목 시세 CHECK** - 8 market data cards in grid
7. **오늘의 한 줄** - Quote section with gradient
8. **마무리** - Closing section with subscribe button

### Market Data (8 items)
1. 달러 환율 (USD/KRW)
2. 금 시세 (Gold)
3. S&P 500 (SPY)
4. 비트코인 (Bitcoin)
5. 나스닥 (NASDAQ)
6. KODEX 200
7. CNN 공포지수 (Fear & Greed)
8. SCFI (운임지수)

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state + localStorage for content
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (home.tsx, admin.tsx)
- Reusable UI components in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Shared utilities in `client/src/lib/`

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: RESTful endpoints under `/api/` prefix
- **Development**: Vite dev server with HMR proxied through Express

Key server files:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route definitions with market data fetching
- `server/storage.ts` - In-memory storage with interface for future database integration
- `server/vite.ts` - Development server with Vite middleware

### Data Layer
- **Content Storage**: localStorage for dashboard content (summaries, IPOs, news, todos, etc.)
- **Market Data**: Real-time fetching from external APIs
- **Schema**: Defined in `shared/schema.ts` with TypeScript interfaces

### Design System
- Modern gradient accents (blue-indigo-purple)
- Korean-optimized typography (Pretendard/Noto Sans KR)
- Card-based layouts with shadow effects
- Korean financial color convention: red=상승(up), blue=하락(down)
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
- Icons from lucide-react (no emojis)

## External Dependencies

### Market Data APIs
- **Exchange Rates**: exchangerate-api.com for USD/KRW
- **Cryptocurrency**: CoinGecko API for Bitcoin prices
- **Stock Data**: Yahoo Finance API for SPY, NASDAQ, KODEX200
- **Market Sentiment**: Fear & Greed Index API

### UI Components
- shadcn/ui component library (Radix UI primitives)
- Lucide React for icons
- Tailwind CSS for styling

### Data Persistence
- localStorage for content management
- 5-minute auto-refresh for market data
