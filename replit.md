# 쿠쿠의 돈루틴 (Kuku's Money Routine)

## Overview

A Korean financial dashboard application that displays real-time market data including exchange rates, stock indices, cryptocurrency prices, and market sentiment indicators. The app is designed for quick 5-minute daily financial check-ins, presenting data in a clean, scannable card-based interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
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
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` using Drizzle's schema builder
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Storage**: In-memory (MemStorage class) with database-ready interface

### Design System
- Material Design principles adapted for data-dense financial applications
- Korean-optimized typography (Pretendard/Noto Sans KR)
- Card-based layouts with consistent spacing (Tailwind units of 2, 4, 8, 12)
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)

## External Dependencies

### Market Data APIs
- **Exchange Rates**: exchangerate-api.com for USD/KRW
- **Cryptocurrency**: CoinGecko API for Bitcoin prices
- **Stock Data**: Yahoo Finance API for SPY, NASDAQ, KODEX200
- **Market Sentiment**: Fear & Greed Index API

### Database
- PostgreSQL (configured via `DATABASE_URL` environment variable)
- Drizzle Kit for schema migrations (`drizzle.config.ts`)

### UI Components
- shadcn/ui component library (Radix UI primitives)
- Lucide React for icons
- Embla Carousel for carousel functionality
- date-fns for date formatting

### Session Management
- connect-pg-simple for PostgreSQL session storage (available but not currently active)
- express-session for session handling