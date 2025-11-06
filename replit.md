# StudyFlow - Personal Study Tracker

## Overview

StudyFlow is a Progressive Web App (PWA) designed as an iOS-first productivity tool for tracking study sessions, building learning streaks, and achieving educational goals. The application provides session-based study tracking with timer functionality, progress visualization, and cloud-based data synchronization with Google authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server with HMR support
- **Wouter** for lightweight client-side routing (Study, Timer, Progress, Profile pages)
- **TanStack Query** for server state management and data fetching

**UI Component System**
- **shadcn/ui** component library with Radix UI primitives for accessible, unstyled components
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Apple Human Interface Guidelines (HIG)** as the primary design system, focusing on iOS-native feel
- Custom theme system supporting light/dark modes with localStorage persistence

**State Management Approach**
- Cloud-first architecture using PostgreSQL database for all user data
- Authenticated data persistence with automatic multi-device sync
- Single-user per account with Replit Auth (Google, GitHub, Apple, email/password)
- Session data, study activities, and user preferences managed through REST API with React Query

**Progressive Web App Features**
- Manifest configuration for installable PWA experience
- Mobile-optimized viewport settings with safe area support
- iOS-specific meta tags for web app capability and status bar styling
- Bottom navigation pattern for mobile-first UX

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for API routes
- Development uses Vite middleware mode for seamless HMR integration
- Production serves static built assets

**Data Layer**
- **PostgreSQL database** via Neon serverless for production data persistence
- Database schema defined with **Drizzle ORM** and PostgreSQL dialect
- Schema includes users, studySessions, and studyActivities tables
- User authentication integrated with database through Replit Auth session management

**API Design**
- RESTful API structure with `/api` prefix convention
- Protected routes with authentication middleware (`requireAuth`)
- User-specific data isolation - users can only access their own data
- Express middleware for JSON parsing, session management, and error handling

### Data Storage Solutions

**Database Schema**
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- Database tables:
  - **users**: id, email, firstName, lastName, profileImageUrl, createdAt, updatedAt
  - **studySessions**: id, userId, name, description, theme, dailyTargetMinutes, createdAt
  - **studyActivities**: id, sessionId, userId, date, durationMinutes, notes, media, createdAt
- Migration system using `npm run db:push` for schema updates
- Connection via Neon serverless driver with DATABASE_URL

### Authentication & Authorization

**Replit Auth Integration**
- **Google SSO** as primary authentication method (also supports GitHub, Apple, email/password)
- OpenID Connect (OIDC) flow managed by Replit Auth automatically
- Session-based authentication with express-session and connect-pg-simple
- Secure session storage in PostgreSQL
- Protected API routes with `requireAuth` middleware
- User identification via session.user.id from OIDC token claims
- Automatic token refresh and session management

## Recent Changes (October 2025)

### Architecture Migration: localStorage → PostgreSQL + Auth
- **Removed**: Local-only storage, multi-user switching, export/import features
- **Added**: Google authentication, database persistence, multi-device sync
- **Changed**: All components now use React Query for API data fetching
- **Files affected**: server/routes.ts, server/storage.ts, server/db.ts, server/replitAuth.ts, all frontend pages

## External Dependencies

### Authentication & Database
- **openid-client** - OIDC authentication flow with Replit Auth
- **express-session** - Session management middleware
- **connect-pg-simple** - PostgreSQL session store
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon

### UI Component Libraries
- **@radix-ui/* packages** - Accessible, unstyled component primitives (dialogs, dropdowns, popovers, etc.)
- **class-variance-authority** - Type-safe variant styling
- **lucide-react** - Icon library
- **cmdk** - Command palette component
- **embla-carousel-react** - Touch-friendly carousel

### Form & Validation
- **react-hook-form** - Performant form state management
- **@hookform/resolvers** - Validation schema integration
- **zod** - TypeScript-first schema validation
- **drizzle-zod** - Zod schema generation from Drizzle schemas

### Database & ORM
- **drizzle-orm** - TypeScript ORM for SQL databases
- **@neondatabase/serverless** - Serverless PostgreSQL driver for Neon
- **connect-pg-simple** - PostgreSQL session store for Express

### Build & Development Tools
- **@vitejs/plugin-react** - React integration for Vite
- **@replit/* plugins** - Replit-specific development enhancements (error modal, cartographer, dev banner)
- **tsx** - TypeScript execution for development server
- **esbuild** - Fast JavaScript bundler for production builds

### Utilities
- **date-fns** - Date manipulation and formatting
- **clsx** & **tailwind-merge** - Conditional CSS class management
- **nanoid** - Unique ID generation

### PWA Infrastructure
- Service worker ready (manifest.json configured)
- iOS-optimized meta tags and viewport settings
- Standalone display mode for app-like experience