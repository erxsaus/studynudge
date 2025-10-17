# StudyFlow - Personal Study Tracker

## Overview

StudyFlow is a Progressive Web App (PWA) designed as an iOS-first productivity tool for tracking study sessions, building learning streaks, and achieving educational goals. The application provides session-based study tracking with timer functionality, progress visualization, and multi-user support with local data persistence.

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
- Local-first architecture using browser localStorage for all user data
- No remote database - all data persists client-side
- Multi-user support through user profiles stored in localStorage
- Session data, study activities, and user preferences managed through custom storage utilities

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
- **In-memory storage** implementation (MemStorage class) for development/prototyping
- Database schema defined with **Drizzle ORM** and PostgreSQL dialect
- Prepared for database integration via Neon serverless PostgreSQL
- Schema includes users table with UUID primary keys

**API Design**
- RESTful API structure with `/api` prefix convention
- Express middleware for JSON parsing and request logging
- Error handling middleware with status code propagation

### Data Storage Solutions

**Client-Side Storage**
- **localStorage** as primary persistence layer
- Structured data models:
  - User profiles (id, name, photo, createdAt)
  - Study sessions (id, name, description, theme, dailyTargetMinutes)
  - Study activities (id, sessionId, date, durationMinutes, notes, media)
- Export/import functionality for data backup (JSON format)
- Session-specific data isolation per user

**Database Schema (Prepared)**
- PostgreSQL with Drizzle ORM for type-safe database operations
- Users table with username/password authentication ready
- Migration system configured via drizzle-kit
- Connection via Neon serverless driver

### Authentication & Authorization

**Current Implementation**
- Client-side user management without authentication
- User switching mechanism for multi-profile support
- No password protection (local-only usage)

**Prepared Infrastructure**
- User schema includes password field for future auth implementation
- Session management infrastructure via connect-pg-simple
- Cookie-based session handling ready for integration

## External Dependencies

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