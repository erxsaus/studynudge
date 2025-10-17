# StudyFlow - Personal Study Tracker 📚

A Progressive Web App (PWA) designed for iOS-first productivity. Track study sessions, build learning streaks, and achieve your educational goals with cloud synchronization and Google authentication.

![StudyFlow](https://img.shields.io/badge/PWA-Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

## ✨ Features

- 🎯 **Custom Study Sessions** - Create themed study sessions with daily targets
- ⏱️ **Focus Timer** - Built-in timer with vibration alerts for study sessions
- 📸 **Rich Notes** - Capture study notes with photos and videos
- 🔥 **Streak System** - Track your learning consistency with creative milestone badges (7 days → 10 years)
- ☁️ **Cloud Sync** - Automatic multi-device synchronization
- 🔐 **Secure Auth** - Google Single Sign-On with Replit Auth (also supports GitHub, Apple, Email)
- 📱 **iOS Optimized** - Apple Human Interface Guidelines compliant design
- 🌙 **Dark Mode** - Full light/dark theme support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)
- Replit account (for authentication)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/studyflow.git
   cd studyflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env` file in the root directory:
   ```bash
   # Database
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   
   # Authentication (Replit)
   REPL_ID=your-replit-app-id
   ISSUER_URL=https://replit.com/oidc
   SESSION_SECRET=your-random-secret-key
   
   # JWT (for Vercel deployment)
   JWT_SECRET=your-random-jwt-secret
   ```

4. **Initialize the database**:
   ```bash
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   ```
   http://localhost:5000
   ```

## 📦 Deployment

### Deploy to Replit

1. Import this repository to Replit
2. Set environment variables in Secrets
3. Click "Run" - that's it!

### Deploy to Vercel

See the detailed [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) for step-by-step instructions.

**Quick deploy**:
```bash
npm install -g vercel
vercel
```

Set these environment variables in Vercel dashboard:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Random secret for JWT tokens
- `REPL_ID` - Your Replit app ID
- `ISSUER_URL` - `https://replit.com/oidc`

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **shadcn/ui** - Accessible component library
- **Tailwind CSS** - Utility-first styling

### Backend
- **Express.js** - Traditional server (Replit)
- **Vercel Serverless** - Serverless functions (Vercel)
- **PostgreSQL** - Cloud database via Neon
- **Drizzle ORM** - Type-safe database queries

### Authentication
- **Replit Auth** - OIDC with Google/GitHub/Apple
- **JWT** - Stateless authentication for Vercel
- **Express Session** - Session management for Replit

## 📂 Project Structure

```
studyflow/
├── api/                    # Vercel serverless functions
│   ├── auth/              # Authentication endpoints
│   ├── sessions/          # Session management
│   └── activities/        # Activity tracking
├── client/                # Frontend application
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom React hooks
│       └── lib/           # Utilities
├── server/                # Backend server
│   ├── routes.ts          # Express API routes (Replit)
│   ├── storage.ts         # Database interface
│   ├── jwt.ts             # JWT utilities
│   ├── vercelAuth.ts      # Vercel auth flow
│   └── replitAuth.ts      # Replit auth flow
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
└── vercel.json            # Vercel configuration
```

## 🗄️ Database Schema

### Users
- `id` - Primary key
- `email` - User email
- `firstName` - First name
- `lastName` - Last name
- `profileImageUrl` - Avatar URL

### Study Sessions
- `id` - Primary key
- `userId` - Foreign key to users
- `name` - Session name
- `description` - Session description
- `theme` - Color theme
- `dailyTargetMinutes` - Daily study goal

### Study Activities
- `id` - Primary key
- `sessionId` - Foreign key to sessions
- `userId` - Foreign key to users
- `date` - Activity date
- `durationMinutes` - Study duration
- `notes` - Activity notes
- `media` - Photos/videos JSON

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run check` - Type check with TypeScript

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REPL_ID` | Yes | Replit app ID for auth |
| `SESSION_SECRET` | Replit | Express session secret |
| `JWT_SECRET` | Vercel | JWT token secret |
| `ISSUER_URL` | Yes | OIDC issuer URL (default: `https://replit.com/oidc`) |

## 🎨 Design System

StudyFlow follows the **Apple Human Interface Guidelines** for an iOS-native feel:

- **Colors**: Semantic color tokens with automatic dark mode
- **Typography**: SF Pro-inspired font stack
- **Spacing**: Consistent 4px/8px grid system
- **Components**: Accessible shadcn/ui primitives
- **Interactions**: Subtle animations and transitions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Duolingo's streak system
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Database hosting by [Neon](https://neon.tech)
- Authentication by [Replit Auth](https://replit.com)

## 📧 Support

For questions or issues, please open an issue on GitHub or contact the maintainer.

---

**Built with ❤️ using React, TypeScript, and PostgreSQL**
