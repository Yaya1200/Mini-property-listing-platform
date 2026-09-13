# Mini Multi-Tenant Property Listing Platform - Backend

A NestJS-based REST API for a property listing platform with role-based access control, built with Supabase PostgreSQL database.

## 🚀 Tech Stack

- **Framework:** NestJS (ES Modules)
- **Database:** Supabase PostgreSQL
- **Authentication:** JWT with bcrypt password hashing
- **Authorization:** Role-Based Access Control (RBAC)
- **Validation:** class-validator & class-transformer
- **Security:** Helmet, CORS

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project (free tier available)

## 🔧 Setup

### 1. Environment Variables

Create `.env.local`:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MAX_IMAGE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

### 2. Database Setup

1. Go to Supabase dashboard
2. Create a new project
3. Copy the `database/schema.sql` content
4. Paste into Supabase SQL Editor
5. Run the SQL to create tables and indexes

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run start:dev
```

Server runs on `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── auth/              # Authentication & Authorization
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── strategies/    # JWT strategy
│   ├── guards/        # JWT & Role guards
│   └── decorators/    # @Roles decorator
├── properties/        # Property Management
│   ├── properties.service.ts
│   ├── properties.controller.ts
│   └── properties.module.ts
├── favorites/         # Favorites Management
│   ├── favorites.service.ts
│   ├── favorites.controller.ts
│   └── favorites.module.ts
├── config/           # Configuration
│   ├── app.config.ts
│   └── supabase.ts
├── types/            # TypeScript types & enums
└── app.module.ts     # Root module
```

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **admin** | View all properties, disable any property, view metrics |
| **property_owner** | Create, edit draft, publish, upload images for own properties |
| **regular_user** | View published properties, save favorites, contact owners |

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login (returns JWT)
- `GET /auth/me` - Get current user profile (requires auth)

### Properties
- `GET /properties` - List published properties (pagination, filtering)
- `GET /properties/:id` - Get property details
- `GET /properties/owner/:ownerId` - List properties by owner
- `POST /properties` - Create new property (owner/admin only)
- `PUT /properties/:id` - Update draft property (owner only)
- `POST /properties/:id/publish` - Publish property (owner only)
- `DELETE /properties/:id` - Soft delete property (owner only)

### Favorites
- `GET /favorites` - Get user's favorites (requires auth)
- `POST /favorites/:propertyId` - Add to favorites (requires auth)
- `DELETE /favorites/:propertyId` - Remove from favorites (requires auth)
- `GET /favorites/:propertyId/check` - Check if favorited (requires auth)

## 📊 Database Schema

### Users Table
```sql
- id (UUID, primary key)
- email (VARCHAR, unique)
- name (VARCHAR)
- password_hash (VARCHAR)
- role (VARCHAR: admin, property_owner, regular_user)
- created_at, updated_at, deleted_at
```

### Properties Table
```sql
- id (UUID, primary key)
- owner_id (UUID, foreign key → users)
- title, description, location (VARCHAR, TEXT)
- price (DECIMAL)
- status (VARCHAR: draft, published, archived)
- images (JSONB array)
- created_at, updated_at, deleted_at
```

### Favorites Table
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key → users)
- property_id (UUID, foreign key → properties)
- created_at (TIMESTAMP)
- Unique constraint: (user_id, property_id)
```

## 🔑 Key Features

- ✅ JWT-based authentication with httpOnly cookies
- ✅ Role-Based Access Control (RBAC)
- ✅ Soft deletes with `deletedAt` timestamp
- ✅ Pagination and filtering (location, price range, status)
- ✅ Transactional property publishing
- ✅ Environment-based configuration
- ✅ Proper HTTP status codes
- ✅ CORS and security headers (Helmet)

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm run start:prod
```

### Deployment Platforms
- **Railway.app** - Recommended
- **Render.com**
- **Fly.io**

## 🐛 Troubleshooting

### CORS Issues
- Check `CORS_ORIGIN` env var matches frontend URL
- Ensure credentials: true in frontend API calls

### JWT Validation Errors
- Verify `JWT_SECRET` is set correctly
- Check token expiration (`JWT_EXPIRATION`)
- Ensure token is passed in Authorization header

### Database Connection Issues
- Verify Supabase URL and keys
- Check network access in Supabase settings
- Ensure schema.sql was executed

## 📚 Documentation

API documentation available at `/api-docs` (when Swagger is integrated).

Postman collection: [To be added]

## 🚀 Production Checklist

- [ ] Set unique `JWT_SECRET`
- [ ] Use environment-specific keys for Supabase
- [ ] Enable HTTPS
- [ ] Configure proper CORS origin
- [ ] Enable Row-Level Security (RLS) in Supabase
- [ ] Set up backups and monitoring
- [ ] Use production database connection pool settings
