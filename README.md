# Mini Multi-Tenant Property Listing Platform

A full-stack property listing platform with role-based access control, built with modern technologies for scalability and maintainability.

## 🎯 Project Overview

This is a simplified but production-ready version of a real-world property listing system. Users can browse published properties, save favorites, and property owners can list properties with images.

**Key Features:**
- 👥 Three user roles: Admin, Property Owner, Regular User
- 🏠 Property management with draft/published/archived states
- ❤️ Favorites with real-time sync across tabs
- 🖼️ Multiple image support per property
- 🔐 JWT-based authentication with role-based access control
- 📱 Fully responsive design
- 🚀 Production-ready deployment

## 📦 Tech Stack

### Backend
- **Framework:** NestJS (TypeScript)
- **Database:** Supabase PostgreSQL
- **Authentication:** JWT + bcrypt
- **Storage:** Supabase Storage
- **Validation:** class-validator

### Frontend
- **Framework:** Next.js (TypeScript)
- **Styling:** Tailwind CSS
- **State:** Zustand + TanStack Query
- **HTTP:** Axios
- **Package Manager:** npm

### Infrastructure
- **Frontend Hosting:** Vercel (recommended) / Netlify
- **Backend Hosting:** Railway / Render / Fly.io
- **Database:** Supabase PostgreSQL (managed)
- **Storage:** Supabase Storage

## 🎯 Tech Stack Rationale

### Why NestJS for Backend?
✅ **Pros:**
- Built-in TypeScript support with excellent DX
- Modular architecture (Auth, Properties, Favorites modules)
- Dependency injection out-of-the-box
- Built-in validation pipes (class-validator)
- Excellent for team scalability
- Large ecosystem and community

❌ **Cons:**
- Steeper learning curve than Express
- More boilerplate than lightweight frameworks

**Decision:** NestJS chosen because this is meant to be a scalable system. The modular architecture and built-in features make it ideal for multi-tenant applications with role-based access control.

### Why Next.js for Frontend?
✅ **Pros:**
- Server-side rendering improves SEO for property listings
- Built-in image optimization
- API routes simplify development
- Excellent TypeScript support
- Vercel integration for easy deployment
- File-based routing reduces configuration

❌ **Cons:**
- More opinionated than pure React
- Build complexity vs simple React app

**Decision:** Next.js provides SEO benefits crucial for a listing platform. Properties need to be discoverable by search engines.

### Why TanStack Query + Zustand?
✅ **Query (Server State):**
- Perfect for caching API data
- Automatic refetching and invalidation
- Cross-tab synchronization
- Deduplication of requests

✅ **Zustand (Auth State):**
- Lightweight and simple
- Perfect for authentication state
- No boilerplate like Redux
- Easy persistence to localStorage/cookies

**Decision:** Separation of concerns. Query handles remote data, Zustand handles local auth state. This is a proven pattern in modern React apps.

### Why Supabase?
✅ **Pros:**
- PostgreSQL (industry standard)
- Real-time capabilities (for future enhancements)
- Built-in authentication (can be used later)
- Storage for images
- Row-level security (implemented)
- Free tier suitable for MVP

❌ **Cons:**
- Vendor lock-in
- Less control than self-hosted

**Decision:** Supabase provides a complete backend-as-a-service without needing separate services for auth, DB, and storage.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                   │
│  • User Dashboard    • Property Listings                │
│  • Auth Pages        • Owner Dashboard                  │
│  (Vercel/Netlify)                                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS API Calls
                     │ JWT Auth Token
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (NestJS)                       │
│  • Auth Module       • Properties Module               │
│  • Favorites Module  • Role-based Guards               │
│  (Railway/Render/Fly.io)                               │
└────────────────────┬────────────────────────────────────┘
                     │ SQL Queries
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Database & Storage (Supabase)                  │
│  • PostgreSQL        • Row-Level Security             │
│  • Storage for Images                                 │
└─────────────────────────────────────────────────────────┘
```

## 🔑 Key Technical Decisions & Tradeoffs

### 1. Authentication: JWT vs OAuth
**Decision:** JWT with httpOnly cookies

**Reasoning:**
- JWT: Stateless, no session store needed, works well with APIs
- httpOnly cookies: Secure against XSS attacks
- Token refresh: Can implement with short-lived access tokens

**Alternative:** Could use Supabase Auth (built-in), but implemented from scratch for learning

### 2. Database Design: Relational vs Document
**Decision:** Relational (PostgreSQL)

**Reasoning:**
- Properties have clear relationships (owner → many properties)
- Favorites are junction tables (user ↔ property)
- SQL transactions for publishing property atomicity
- ACID compliance ensures data integrity

**Not suitable:** Document DB (MongoDB) because relationships are strict

### 3. Image Storage: Local vs Cloud
**Decision:** Cloud Storage (Supabase)

**Reasoning:**
- Production servers shouldn't store files locally
- Cloud storage auto-scales with demand
- CDN integration for fast delivery
- No disk space constraints

**Implementation:** Image URLs stored in database, actual files in Supabase Storage

### 4. API Design: REST vs GraphQL
**Decision:** REST with pagination

**Reasoning:**
- Simpler to implement than GraphQL
- Better for traditional property listing use cases
- Easier to cache and optimize with HTTP
- Query parameters (location, price) easier than GraphQL

**If scaling:** Could migrate to GraphQL later

### 5. State Management: Context vs Redux vs Zustand
**Decision:** Zustand (auth) + TanStack Query (server state)

**Reasoning:**
- No prop drilling
- No boilerplate (vs Redux)
- Lightweight (Zustand is <1KB)
- TanStack Query handles all server state sync

### 6. Soft Deletes vs Hard Deletes
**Decision:** Soft deletes (deletedAt field)

**Reasoning:**
- Properties can be "restored" if needed
- Audit trail: know when things were deleted
- Historical data preserved for analytics
- Business requirement: properties shouldn't fully disappear

## ⚠️ Hardest Technical Challenges

### 1. **Cross-Tab Favorites Synchronization**
**Problem:** User adds favorite in Tab A, needs to reflect in Tab B instantly.

**Solution:** TanStack Query's BroadcastChannel integration
- Query automatically syncs across tabs
- No manual localStorage polling needed
- Efficient compared to localStorage watch

**Lesson Learned:** Not a trivial feature, browser APIs have limits

### 2. **Published Properties Cannot Be Edited**
**Problem:** Ensuring immutability of published properties

**Solution:** Database-level validation
- Check status before allowing updates
- Return 400 Bad Request if trying to update published
- Business logic enforced at service layer too

**Challenge:** Ensuring consistency across distributed calls

### 3. **JWT Token Expiration & Refresh**
**Problem:** Tokens expire, need seamless refresh without user knowing

**Solution:** Axios interceptor pattern
- Check if 401, clear token and redirect to login
- (Could implement refresh token for better UX)

**Lesson Learned:** Security vs convenience tradeoff

### 4. **Role-Based Access Control at Scale**
**Problem:** Different roles need different API responses

**Solution:** Role Guards + RLS in Database
- NestJS guards check JWT claims
- Database RLS ensures no SQL injection workarounds
- Defense in depth approach

## 📊 What Would Break First at Scale?

### Critical Bottlenecks (by priority)

1. **Database Connection Pool** ⚠️ CRITICAL
   - Current: Using default Supabase pool
   - Fix: Implement connection pooling (PgBouncer)
   - Symptom: "Too many connections" errors at 100+ concurrent users

2. **N+1 Query Problem** 🔴 HIGH
   - Current: Getting properties might load owner data separately
   - Fix: Implement eager loading / JOINs
   - Symptom: 10x slower queries with 1000 properties

3. **Image Processing** 🟡 MEDIUM
   - Current: Storing full-size images
   - Fix: Image resizing, compression, CDN caching
   - Symptom: Slow load times, high bandwidth costs

4. **No Caching** 🟡 MEDIUM
   - Current: TanStack Query client-side only
   - Fix: Redis cache for popular properties
   - Symptom: Same data fetched repeatedly

5. **Search Performance** 🟡 MEDIUM
   - Current: ILIKE queries on location
   - Fix: Full-text search or Elasticsearch
   - Symptom: Slow queries with 100k+ properties

6. **API Rate Limiting** 🟢 LOW
   - Current: No rate limiting
   - Fix: Implement rate limit middleware
   - Symptom: DDoS vulnerability

### Recommended Improvements

```typescript
// Example: Fix for N+1 query problem
// Before (2 queries):
const properties = await db.properties.find();
properties.forEach(p => p.owner = await db.users.findOne(p.ownerId));

// After (1 query with JOIN):
const properties = await db.properties
  .select('*, owner:user_id(*)')
  .find();
```

## 📈 Scaling Strategy

**Phase 1 (1-10k users):** Current architecture works
**Phase 2 (10k-100k users):**
- Add Redis cache
- Optimize queries with indices
- CDN for images
- Read replicas for database

**Phase 3 (100k+ users):**
- Microservices architecture
- Event-driven (message queues)
- Search service (Elasticsearch)
- File processing queue (Bull/Agenda)

## 🚀 Deployment Architecture

### Frontend
```
Git Push → Vercel → Build → Deploy to CDN → Users
```

### Backend
```
Git Push → Railway → Build → Docker → Run → Users
         ↓
    PostgreSQL (Supabase)
```

### Database
```
Supabase Dashboard → PostgreSQL Cluster → Backups
                  → Storage (Images)
```

## 🔐 Security Measures

✅ **Implemented:**
- JWT authentication
- bcrypt password hashing
- httpOnly cookies
- Row-level security in database
- CORS protection
- Helmet.js headers

❌ **Not Implemented (for MVP):**
- Rate limiting
- CSRF protection
- Input sanitization (class-validator does basic)
- OAuth2 social login
- 2FA

## 📚 Documentation Standards

- Code comments: Only for WHY, not WHAT
- Function signatures: TypeScript provides types
- Complex business logic: Explained with examples
- API endpoints: Documented in Postman collection

## ✅ Done & ❌ Not Done

### Completed
- ✅ Full authentication system
- ✅ Role-based access control
- ✅ Property CRUD operations
- ✅ Soft deletes
- ✅ Favorites feature
- ✅ Pagination and filtering
- ✅ Frontend UI with all pages
- ✅ Production-ready deployment configs

### Not Implemented (Future)
- ❌ Image uploading (use external URLs)
- ❌ Email verification
- ❌ Admin analytics dashboard
- ❌ Messaging between users
- ❌ Reviews/ratings
- ❌ Advanced search
- ❌ Payment processing

## 🎓 Lessons Learned

1. **Zustand > Redux for simple auth:** Much less boilerplate, same functionality
2. **TanStack Query is worth it:** Handles caching complexity automatically
3. **TypeScript catches bugs early:** Especially in API calls
4. **Database design matters:** Good schema prevents 90% of scaling issues
5. **Soft deletes are important:** Don't permanently delete user data

## 📞 Support & Issues

For issues:
1. Check error logs: `npm run dev` shows detailed errors
2. Backend logs: Check Railway/Render dashboard
3. Database logs: Check Supabase dashboard
4. Network: Check browser DevTools → Network tab

## 📄 File Structure

```
Mini-property-listing-platform/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── properties/
│   │   ├── favorites/
│   │   ├── config/
│   │   └── main.ts
│   ├── database/
│   │   └── schema.sql
│   └── BACKEND_README.md
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── lib/
│   └── FRONTEND_README.md
│
├── docs/
│   ├── API.postman_collection.json
│   └── DEPLOYMENT.md
│
└── README.md (this file)
```

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
npm run start:dev
# Runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### Database
1. Create Supabase project
2. Copy SQL from `backend/database/schema.sql`
3. Paste in Supabase SQL Editor
4. Run to create tables

## 📞 Contact & Questions

This is an educational project demonstrating:
- NestJS patterns
- Next.js best practices
- Full-stack TypeScript development
- Production deployment workflows

---

**Built with ❤️ for learning and demonstration purposes.**
