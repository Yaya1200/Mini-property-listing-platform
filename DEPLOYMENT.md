# Deployment Guide

Complete instructions for deploying the Mini Property Listing Platform to production.

## Prerequisites

- Git repository (GitHub/GitLab/Bitbucket)
- Supabase account (free tier available)
- Vercel account (for frontend)
- Railway/Render/Fly.io account (for backend)
- Custom domain (optional)

## Part 1: Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose region (closest to users)
4. Set strong database password
5. Wait for project to initialize

### Step 2: Run Database Migrations

1. Go to SQL Editor in Supabase Dashboard
2. Create new query
3. Copy entire content from `backend/database/schema.sql`
4. Paste and run
5. Verify tables created: Users, Properties, Favorites

### Step 3: Get Supabase Credentials

In Supabase Dashboard:
1. Settings → API
2. Copy:
   - Project URL → `SUPABASE_URL`
   - `anon` key → `SUPABASE_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

## Part 2: Backend Deployment (Railway)

### Step 1: Prepare Repository

```bash
cd backend
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Login with GitHub
3. Create new project
4. Select "Deploy from GitHub repo"
5. Connect your repository
6. Select backend folder

### Step 3: Configure Environment Variables

In Railway Dashboard:
1. Go to your project
2. Settings → Environment
3. Add variables:

```
SUPABASE_URL=your_project_url
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=generate_strong_random_string
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
MAX_IMAGE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

### Step 4: Deploy

1. Railway auto-deploys on git push
2. Monitor build logs
3. Note the public URL (e.g., `https://mini-property-backend.railway.app`)

### Step 5: Verify Backend

```bash
curl https://your-railway-url/api/properties
# Should return empty array
```

## Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

```bash
cd frontend
# Ensure .env.production is correct
echo "NEXT_PUBLIC_API_URL=https://your-railway-backend-url" > .env.production.local
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using GitHub Integration

1. Go to https://vercel.com
2. Import your GitHub repo
3. Select frontend folder
4. Continue

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Settings → Environment Variables
2. Add:

```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.com
```

### Step 4: Deploy

- CLI: `vercel --prod`
- GitHub: Auto-deploys on push to main

## Part 4: Custom Domain Setup (Optional)

### Frontend Custom Domain (Vercel)

1. Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records at your registrar:
   - CNAME record pointing to Vercel
4. Wait for SSL certificate (automatic)

### Backend Custom Domain (Railway)

1. Railway Dashboard → Settings → Custom Domain
2. Add domain
3. Update DNS records
4. SSL certificate auto-issued

## Part 5: Post-Deployment Verification

### Check Health Endpoints

```bash
# Backend health
curl https://your-api-domain.com/auth/me
# Should return 401 (not authenticated)

# Frontend
curl https://your-frontend-domain.com
# Should return HTML
```

### Test Complete Flow

1. Open frontend: `https://your-frontend-domain.com`
2. Register new account
3. Login
4. Browse properties
5. Create property (if property owner)
6. Publish property

### Monitor Logs

**Backend (Railway):**
```
Settings → Logs
# Check for errors
```

**Frontend (Vercel):**
```
Deployments → View Logs
```

## Part 6: Maintenance & Updates

### Deploy Updates

```bash
# Backend
git push
# Railway auto-deploys

# Frontend
git push
# Vercel auto-deploys
```

### Database Backups

1. Supabase Dashboard → Backups
2. Enable auto-backups (free tier: daily)

### Monitor Performance

**Vercel Analytics:**
- Settings → Analytics
- Monitor performance metrics

**Railway Metrics:**
- Project → Metrics
- Monitor CPU, RAM, requests

### Scaling

**When needed:**
- Railway: Increase CPU/RAM in settings
- Vercel: Auto-scales (no action needed)
- Supabase: Upgrade plan

## Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Enable HTTPS (auto with Vercel/Railway)
- [ ] Set strong JWT_SECRET
- [ ] Enable CORS only for your domain
- [ ] Review Row-Level Security policies

### Performance
- [ ] Enable Vercel caching headers
- [ ] Configure Supabase connection pooling
- [ ] Monitor database query performance
- [ ] Set up error tracking (Sentry recommended)

### Monitoring
- [ ] Set up uptime monitoring
- [ ] Configure error alerts
- [ ] Monitor response times
- [ ] Track error rates

### Backups
- [ ] Enable Supabase automatic backups
- [ ] Test restore procedure
- [ ] Document backup location

### Documentation
- [ ] Document deployment URLs
- [ ] Document API key locations
- [ ] Create runbooks for common issues
- [ ] Update team wiki

## Troubleshooting Deployment

### Backend Won't Start

**Error:** "Cannot find module"
```bash
# Solution: Ensure all dependencies installed
npm install
# Rebuild
npm run build
```

**Error:** "Connection refused"
```bash
# Solution: Check Supabase credentials
# Verify SUPABASE_URL and keys are correct
```

### Frontend Shows 502 Bad Gateway

**Solution:** Backend is down
```bash
# Check backend logs on Railway
# Restart backend service
```

### CORS Errors

**Error:** "No 'Access-Control-Allow-Origin'"
```bash
# Solution: Update backend CORS_ORIGIN
# Must match frontend domain exactly
CORS_ORIGIN=https://your-frontend-domain.com
```

### SSL Certificate Issues

**Solution:** Wait 24-48 hours for certificate generation
- Check certificate status in hosting dashboard
- Force renew if needed

## Advanced Deployment Options

### Using Docker

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 3000
```

```bash
docker build -t property-listing-frontend .
docker run -p 3000:3000 property-listing-frontend
```

### Using GitHub Actions for CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```

### Environment-Specific Configs

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.prod.example.com
NODE_ENV=production
NEXT_PUBLIC_ANALYTICS=true

# .env.staging
NEXT_PUBLIC_API_URL=https://api.staging.example.com
NODE_ENV=production
NEXT_PUBLIC_ANALYTICS=true
```

## Cost Estimation

### Monthly Costs (Estimated)

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Supabase | $0 (5GB DB) | $10-100 |
| Railway | $5 credit | $7+ |
| Vercel | $0 | $20+ |
| **Total** | ~$0 | ~$37+ |

Free tier sufficient for MVP (< 10k users)

## Support & Help

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **NestJS Docs:** https://docs.nestjs.com
- **Next.js Docs:** https://nextjs.org/docs

---

**Happy deploying! 🚀**
