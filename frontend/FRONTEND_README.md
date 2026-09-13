# Mini Multi-Tenant Property Listing Platform - Frontend

A Next.js-based frontend for a property listing platform with role-based access control, built with TypeScript, Tailwind CSS, and TanStack Query.

## 🚀 Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand (authentication) + TanStack Query (server state)
- **HTTP Client:** Axios
- **Authentication:** JWT stored in cookies

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

## 🔧 Setup

### 1. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production:
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_APP_URL=https://your-frontend-domain.com
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run start
```

## 🏗️ Project Structure

```
src/
├── app/               # Next.js app directory
│   ├── layout.tsx     # Root layout with providers
│   ├── page.tsx       # Home page
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   ├── properties/    # Property listing & details
│   │   ├── page.tsx           # List all published properties
│   │   ├── [id]/page.tsx      # Property details
│   │   └── create/page.tsx    # Create/edit properties
│   ├── dashboard/     # Protected routes
│   │   ├── page.tsx   # User dashboard (favorites)
│   │   └── owner/     # Owner dashboard (manage properties)
│   └── providers.tsx  # TanStack Query setup
│
├── components/        # Reusable React components
│   ├── PropertyCard.tsx       # Property card component
│   └── ProtectedRoute.tsx     # Protected route wrapper
│
├── hooks/            # Custom React hooks
│   ├── useAuth.ts    # Authentication hooks
│   ├── useProperties.ts    # Properties queries & mutations
│   └── useFavorites.ts     # Favorites queries & mutations
│
├── services/         # API service layer
│   ├── auth.service.ts      # Authentication endpoints
│   ├── properties.service.ts # Properties endpoints
│   └── favorites.service.ts  # Favorites endpoints
│
├── store/           # Zustand state management
│   └── auth.store.ts # Authentication state
│
└── lib/             # Utility functions & configs
    └── api-client.ts # Axios instance with interceptors
```

## 🔐 Features

- ✅ User authentication (register, login, logout)
- ✅ Protected routes (require authentication)
- ✅ Property browsing with filters (location, price range)
- ✅ Pagination for property listings
- ✅ Property details page with image gallery
- ✅ Favorites management with optimistic updates
- ✅ User dashboard to view favorites
- ✅ Property owner dashboard to manage properties
- ✅ Create/edit/publish properties
- ✅ Soft deletes
- ✅ Cross-tab favorites sync via TanStack Query
- ✅ Authentication persistence (httpOnly cookies + Zustand)
- ✅ Loading & error states
- ✅ Responsive design (mobile, tablet, desktop)

## 📄 Available Pages

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Home | `/` | Public | Landing page with features |
| Login | `/login` | Public | User login |
| Register | `/register` | Public | User registration |
| Properties | `/properties` | Public | Browse published properties |
| Property Details | `/properties/:id` | Public | View property details |
| Create Property | `/properties/create` | Owner Only | Create new property |
| Edit Property | `/properties/:id/edit` | Owner Only | Edit draft property |
| User Dashboard | `/dashboard` | Auth Required | View user favorites |
| Owner Dashboard | `/dashboard/owner` | Owner Only | Manage properties |

## 🎯 Key Implementation Details

### 1. Authentication Flow
- User registers/logs in via `/auth/login` or `/auth/register`
- JWT token stored in httpOnly cookie (secure, automatic)
- Zustand store maintains user state in memory
- Token persists across page refreshes via cookies
- Auto-logout on 401 response

### 2. API Communication
- Axios client with automatic token injection
- Request interceptor adds JWT to Authorization header
- Response interceptor handles 401 errors
- Error handling with user-friendly messages

### 3. State Management
- **Authentication:** Zustand (lightweight, fast)
- **Server State:** TanStack Query (caching, sync, deduplication)
- Favorites synced across tabs via Query invalidation

### 4. Optimistic Updates
- Add/remove favorites shows instant UI feedback
- Query cache updated before server confirmation
- Reverted if server returns error

### 5. Protected Routes
- `ProtectedRoute` component wraps authenticated pages
- Checks token & user data via `useCurrentUser` hook
- Auto-redirects to `/login` if unauthorized

## 🧪 Testing

```bash
# Run tests
npm run test

# Run with coverage
npm run test:cov
```

## 📦 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
vercel
```

#### Netlify
```bash
npm run build
# Connect to Git, Netlify auto-deploys
```

#### Docker
```bash
docker build -t propertylistingapp .
docker run -p 3000:3000 propertylistingapp
```

## 🔗 Environment Variables

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_URL=https://app.example.com
```

## 🚀 Performance Optimizations

- Image optimization via Next.js Image component
- Code splitting via dynamic imports
- Automatic static generation where possible
- TanStack Query caching (5 min default)
- staleTime to prevent unnecessary refetches

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend allows frontend origin in CORS config
- Check `NEXT_PUBLIC_API_URL` matches backend URL

### Authentication Not Persisting
- Verify cookies are being set (browser DevTools → Application → Cookies)
- Check `httpOnly` cookies are supported (most modern browsers do)
- Ensure backend sends token in response

### Images Not Loading
- Verify image URLs are valid and publicly accessible
- Check Next.js Image optimization isn't blocking URLs
- Use external URLs or CDN for production

### State Not Syncing Across Tabs
- TanStack Query uses BroadcastChannel API
- Check browser supports it (most modern browsers do)
- Verify cookies are shared across tabs

## 📊 API Integration

All API calls go through `/services` layer:

```typescript
// Example: Login
import { authService } from '@/services/auth.service';

const response = await authService.login({
  email: 'user@example.com',
  password: 'password'
});
// Returns: { accessToken, user }
```

## 🎨 Styling

- Tailwind CSS for utility-based styling
- Custom components in `/components`
- Responsive design (mobile-first approach)
- Dark mode support ready (can be added)

## 📝 Notes

- All API communication is typed with TypeScript interfaces
- Loading and error states on all async operations
- Proper cleanup in useEffect hooks
- Re-renders optimized via React.memo where needed
- Query keys follow convention for better debugging

## 🚀 Production Checklist

- [ ] Set production API URL in `.env.production`
- [ ] Build and test: `npm run build && npm run start`
- [ ] Deploy to Vercel/Netlify
- [ ] Set environment variables in hosting platform
- [ ] Verify CORS settings on backend
- [ ] Test authentication flow end-to-end
- [ ] Monitor error logs
- [ ] Set up error tracking (Sentry recommended)
