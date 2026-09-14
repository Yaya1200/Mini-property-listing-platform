# Deployment Guide

## Overview

The application is deployed using the following architecture:

```text
                         ┌──────────────┐
                         │    GitHub    │
                         └──────┬───────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
                  ▼                           ▼
            ┌───────────┐               ┌───────────┐
            │  Vercel   │               │   Render  │
            │ Frontend  │ ──── API ───► │  Backend  │
            └───────────┘               └─────┬─────┘
                                              │
                                              ▼
                                       ┌──────────────┐
                                       │   Supabase   │
                                       │ PostgreSQL + │
                                       │   Storage    │
                                       └──────────────┘
```

### Services

| Component      | Platform            |
| -------------- | ------------------- |
| Frontend       | Vercel              |
| Backend        | Render              |
| Database       | Supabase PostgreSQL |
| Image Storage  | Supabase Storage    |
| Source Control | GitHub              |

### Production URLs

**Frontend**

```text
https://mini-property-listing-platform-eight.vercel.app
```

**Backend API**

```text
https://mini-property-listing-platform-4i5u.onrender.com
```

---

# 1. Prerequisites

Before deploying, make sure you have:

* A GitHub repository containing the project
* A Supabase project
* A Render account
* A Vercel account
* The application working locally
* Database tables already created in Supabase
* Supabase Storage bucket configured for property images

Do not commit `.env`, `.env.local`, or other files containing secrets.

---

# 2. Repository Structure

The project uses a monorepo structure:

```text
Mini-property-listing-platform/

├── backend/
├── frontend/
├── docs/
├── README.md
└── DEPLOYMENT.md
```

Before pushing to GitHub, check the repository:

```bash
git status
```

Environment files and generated directories should not be committed.

The `.gitignore` should include entries such as:

```text
.env
.env.local
.env.*.local
node_modules
.next
dist
```

Commit and push changes:

```bash
git add .
git commit -m "Prepare project for deployment"
git push
```

---

# 3. Deploy the Backend to Render

The NestJS backend is deployed as a Render Web Service.

## Create the Web Service

1. Open Render.
2. Create a new **Web Service**.
3. Connect the GitHub repository.
4. Select the `Mini-property-listing-platform` repository.
5. Configure the service.

### Render Configuration

Because the backend is located inside the `backend` directory:

```text
Root Directory:
backend
```

Use:

```text
Language:
Node
```

Build command:

```bash
npm install && npm run build
```

Production start command:

```bash
npm run start:prod
```

The start command should use the production NestJS process rather than the development/watch process.

---

# 4. Backend Environment Variables

The following environment variables are configured in Render:

```env
NODE_ENV=production
PORT=<Render-provided-port>

SUPABASE_URL=<your-supabase-project-url>
SUPABASE_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_KEY=<your-supabase-service-role-key>

JWT_SECRET=<your-production-jwt-secret>
JWT_EXPIRATION=7d

CORS_ORIGIN=https://mini-property-listing-platform-eight.vercel.app

MAX_IMAGE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

### Important

Never place actual secret values in this document or in GitHub.

The Supabase service-role key and JWT secret must remain private environment variables.

Render provides the `PORT` environment variable for the deployed service.

The NestJS application should listen on the provided port and on `0.0.0.0`.

Example:

```ts
const port = process.env.PORT || 3003;

await app.listen(port, '0.0.0.0');
```

---

# 5. Production Backend

The deployed backend is available at:

```text
https://mini-property-listing-platform-4i5u.onrender.com
```

The backend exposes routes for:

```text
/auth/register
/auth/login
/auth/me

/properties
/properties/:id
/properties/owner/:ownerId
/properties/:id/publish
/properties/:id/contact

/favorites
/favorites/:propertyId

/properties/admin/all
/properties/admin/metrics
/properties/admin/:id/disable

/admin/users
/admin/properties
/admin/metrics
```

---

# 6. Test the Production Backend

Before or during frontend deployment, the backend can be tested independently using its production URL:

```text
https://mini-property-listing-platform-4i5u.onrender.com
```

Test public endpoints such as:

```text
GET /properties
GET /properties/:id
```

Test authentication:

```text
POST /auth/register
POST /auth/login
GET /auth/me
```

Test protected functionality:

```text
GET /properties/owner/:ownerId
POST /properties/:id/publish
GET /favorites
POST /favorites/:propertyId
DELETE /favorites/:propertyId

GET /properties/admin/all
GET /properties/admin/metrics
```

The Postman collection in `docs/API.postman_collection.json` can be used for API testing.

For production API testing, set:

```text
baseUrl =
https://mini-property-listing-platform-4i5u.onrender.com
```

---

# 7. Deploy the Frontend to Vercel

The Next.js frontend is deployed separately from the backend.

## Create the Project

1. Open Vercel.
2. Import the GitHub repository.
3. Select the project.
4. Configure the frontend directory.

Because the frontend is located inside `frontend`:

```text
Root Directory:

frontend
```

Vercel automatically detects the Next.js framework.

The backend should **not** be deployed through Vercel.

---

# 8. Frontend Environment Variables

The production frontend uses the deployed Render backend.

Configure the following Vercel environment variables:

```env
NEXT_PUBLIC_API_URL=https://mini-property-listing-platform-4i5u.onrender.com
NEXT_PUBLIC_APP_URL=https://mini-property-listing-platform-eight.vercel.app
```

These variables should be configured for the **Production** environment.

### Local Development

For local development, the frontend continues to use:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

The local values should remain in the local environment file and should not be used for the Vercel production deployment.

### Important

Because `NEXT_PUBLIC_*` variables are used by the Next.js frontend during the build, the application must be redeployed after changing these values.

---

# 9. Production Frontend

The deployed frontend is available at:

```text
https://mini-property-listing-platform-eight.vercel.app
```

The frontend communicates with the backend through:

```text
https://mini-property-listing-platform-4i5u.onrender.com
```

The production architecture is therefore:

```text
Browser
   │
   ▼
Vercel
   │
   │ HTTPS API requests
   ▼
Render / NestJS
   │
   ▼
Supabase
```

---

# 10. Configure Backend CORS

After deploying the frontend, configure the Render backend to allow requests from the production Vercel frontend.

The Render environment variable should be:

```env
CORS_ORIGIN=https://mini-property-listing-platform-eight.vercel.app
```

Do not use:

```env
CORS_ORIGIN=http://localhost:3000
```

for the production backend.

After changing the CORS environment variable, allow Render to redeploy the service.

---

# 11. Supabase Configuration

The deployed backend continues to use the project's Supabase PostgreSQL database and Supabase Storage.

The backend uses:

```env
SUPABASE_URL=<project-url>
SUPABASE_KEY=<anon-key>
SUPABASE_SERVICE_KEY=<service-role-key>
```

Property images are stored in Supabase Storage.

The database stores the image URLs associated with properties.

### Security

The Supabase service-role key must only exist on the backend.

It must never be exposed through:

```text
NEXT_PUBLIC_*
```

or committed to GitHub.

---

# 12. Production Authentication

The frontend communicates with the deployed NestJS API using the production API URL.

Authenticated requests include the JWT as a Bearer token.

The frontend API client reads the authentication token from the cookie and attaches it to authenticated API requests.

The authentication token is persisted using a client-accessible cookie in the current implementation.

The production environment uses a strong, unique `JWT_SECRET`.

---

# 13. Production Verification

After both deployments are complete, test the application from the production frontend.

## Public User

* Open the homepage
* View published properties
* Open a property detail page
* Register
* Login
* Add a property to favorites
* Remove a favorite
* Refresh the page
* Test favorite synchronization between browser tabs
* Contact a property owner

## Property Owner

* Login as a property owner
* Open the owner dashboard
* Create a draft property
* Upload one or more images
* Edit the draft
* Publish the property
* Confirm it appears in public listings
* Attempt to edit the published property
* Confirm published-property editing is blocked

## Admin

* Login as an administrator
* Open the admin dashboard
* View all properties
* Verify metrics
* Disable/archive a property
* Confirm the property state changes correctly

---

# 14. Production Error Testing

Test common error cases.

## Authentication

Test:

```text
Invalid login
Missing JWT
Expired/invalid JWT
```

Expected behavior:

```text
401 Unauthorized
```

## Authorization

Try accessing functionality belonging to another role.

Expected behavior:

```text
403 Forbidden
```

## Invalid Property

Request a property that does not exist.

Expected behavior:

```text
404 Not Found
```

## Invalid Publishing

Try publishing a property without the required information or images.

Expected behavior:

```text
400 Bad Request
```

---



# 16. Current Production URLs

These are the current deployment URLs:

```text
Frontend:
https://mini-property-listing-platform-eight.vercel.app

Backend API:
https://mini-property-listing-platform-4i5u.onrender.com
```

For Postman production testing:

```text
baseUrl =
https://mini-property-listing-platform-4i5u.onrender.com
```

---

# 17. Updating the Application

The project is connected to GitHub.

For normal updates:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

A push to the `main` branch triggers the connected deployment services to build and deploy the updated application.

After deployment, verify:

1. Render backend deployment succeeds.
2. Vercel frontend deployment succeeds.
3. The production frontend can communicate with the production API.
4. Authentication still works.
5. Core property, favorite, owner, and admin functionality still works.

---

# 18. Future Deployment Improvements

For a larger production system, the deployment could be extended with:

* CI/CD pipelines
* Automated tests before deployment
* Preview environments
* API rate limiting
* Centralized logging
* Monitoring and alerts
* Redis caching
* CDN/image optimization
* Automated database migrations
* Refresh-token rotation

These improvements are outside the scope of the current practical assessment.
