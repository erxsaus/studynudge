# Deploy StudyFlow to Vercel

This guide will help you deploy your StudyFlow app to Vercel with serverless functions and JWT-based authentication.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Get a connection string from [Neon](https://neon.tech), [Supabase](https://supabase.com), or any PostgreSQL provider
3. **Replit Account** (for OIDC authentication): You'll use Replit Auth for Google/GitHub/Apple sign-in

## Step 1: Prepare Your Database

### Option A: Neon (Recommended for Vercel)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (looks like: `postgresql://user:pass@ep-*.neon.tech/dbname`)

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to Settings → Database
3. Copy the connection string (use the "pooler" connection string for better performance)

### Option C: Railway
1. Go to [railway.app](https://railway.app) and create a PostgreSQL database
2. Copy the connection string from the database settings

## Step 2: Deploy to Vercel

### Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Scope: Choose your account
   - Link to existing project: `N`
   - Project name: `studyflow` (or your preferred name)
   - Directory: `./`
   - Override settings: `N`

### Using Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Configure build settings (these are already set in `vercel.json`):
   - **Framework Preset**: Other
   - **Build Command**: `vite build` (builds frontend only)
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Your PostgreSQL connection string | Database connection |
| `JWT_SECRET` | A random 32+ character string | For signing JWT tokens (generate with `openssl rand -base64 32`) |
| `REPL_ID` | Your Replit app ID | For OIDC authentication |
| `ISSUER_URL` | `https://replit.com/oidc` | OIDC issuer URL |
| `NODE_ENV` | `production` | Environment mode |

### Generate JWT_SECRET

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```
Or use an online generator: [randomkeygen.com](https://randomkeygen.com)

### Get REPL_ID

1. Go to your Replit workspace
2. The REPL_ID is shown in your workspace URL or environment variables
3. Or create a new Replit account and app specifically for authentication

## Step 4: Initialize Database Schema

After deploying, you need to create the database tables:

1. **Clone your repository locally** (if not already):
   ```bash
   git clone <your-repo-url>
   cd studyflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up local environment variables** (create `.env` file):
   ```bash
   DATABASE_URL=<your-database-url>
   ```

4. **Push database schema**:
   ```bash
   npm run db:push
   ```

This creates these tables:
- `users` - User accounts
- `studySessions` - Study sessions
- `studyActivities` - Study activity records

## Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel project → **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed by Vercel
4. Wait for DNS propagation (usually 5-10 minutes)

## Step 6: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://studyflow.vercel.app`)
2. Click "Sign in to Get Started"
3. Authenticate with Google/GitHub/Apple/Email
4. Create a study session and test the timer
5. Check the Progress page for your activities

## Architecture Overview

### Frontend
- **Static Site**: Built with Vite and served from Vercel's CDN
- **Location**: `dist/public` folder after build
- **Routing**: SPA routing handled by Vercel rewrites in `vercel.json`

### Backend (Serverless Functions)
- **API Routes**: Each endpoint is a serverless function in `/api` directory
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Database**: Direct connection to PostgreSQL via Neon serverless driver

### Key Differences from Replit Version

| Feature | Replit | Vercel |
|---------|--------|--------|
| **Server** | Express.js (always running) | Serverless functions (on-demand) |
| **Auth Storage** | PostgreSQL sessions | JWT cookies |
| **Database** | Neon via persistent connection | Neon via HTTP driver |
| **Deployment** | Click "Publish" | Git push or CLI |

## Troubleshooting

### "Database connection failed"
- Verify `DATABASE_URL` is correct in Vercel environment variables
- Make sure database allows connections from Vercel's IP ranges (most serverless DBs do by default)
- Check database is active (Neon free tier pauses after inactivity)

### "Authentication failed"
- Verify `REPL_ID` matches your Replit app
- Check `JWT_SECRET` is set and consistent
- Ensure `ISSUER_URL` is correct
- Check that cookies are enabled in your browser

### "API routes not working"
- Verify `vercel.json` is in the root directory
- Check build logs in Vercel dashboard for errors
- Ensure all TypeScript files compile without errors

### Cold Starts
- First request may be slow (1-3 seconds) due to serverless cold start
- Subsequent requests are fast
- Consider upgrading to Vercel Pro for better performance

## Environment Variables Reference

```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your-random-32-char-secret
REPL_ID=your-replit-app-id

# Optional
ISSUER_URL=https://replit.com/oidc  # Default value
NODE_ENV=production                  # Set automatically by Vercel
VERCEL_URL=your-app.vercel.app      # Set automatically by Vercel
```

## Maintenance

### Updating Your App
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys on git push
```

### Database Migrations
```bash
# After schema changes in shared/schema.ts
npm run db:push --force
```

### Monitoring
- View logs in Vercel dashboard → Your Project → Deployments → View Function Logs
- Monitor database usage in your DB provider dashboard

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- **Replit Auth**: [docs.replit.com](https://docs.replit.com)

## Cost Estimate

- **Vercel Hobby (Free)**: 100GB bandwidth, unlimited serverless function invocations
- **Neon Free Tier**: 0.5GB storage, 10GB egress
- **Estimated Cost**: $0/month for personal use, scales with traffic

---

**Ready to deploy?** Run `vercel` in your project directory! 🚀
