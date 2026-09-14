# Mini Multi-Tenant Property Listing Platform

A full-stack property listing platform built as a practical assessment for an Intern Staff Developer role.

The platform supports multiple user roles, property management, image uploads, favorites, property publishing, administration, and owner contact functionality.

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* Role-based access control
* Three user roles:

  * `regular_user`
  * `property_owner`
  * `admin`
* Protected API routes
* Role-based frontend dashboards

### Property Management

* Property owners can create properties as drafts
* Owners can edit draft properties
* Owners can publish valid properties
* Published properties cannot be edited
* Property images can be uploaded to Supabase Storage
* Multiple images are supported
* Properties can be filtered and paginated
* Properties support the following states:

  * `draft`
  * `published`
  * `archived`
* Soft deletion is used for property records

### Regular Users

* Browse published properties
* View property details
* Add/remove favorites
* Check favorite status
* Contact property owners

### Administration

* View all properties
* View basic property statistics
* Disable/archive properties

### Frontend

* Responsive Next.js interface
* Public property listing
* Property detail pages
* Role-specific dashboards
* Loading and error states
* Optimistic favorite interactions
* Authentication persistence
* Favorites synchronization across browser tabs

---

# Tech Stack

## Backend

* **NestJS**
* **PostgreSQL via Supabase**
* **JWT**
* **bcrypt**
* **Supabase Storage**
* **Axios / REST API**
* **class-validator** where applicable
* **TypeScript**

## Frontend

* **Next.js 16**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Zustand**
* **TanStack Query**
* **Axios**
* **js-cookie**

## Infrastructure

* **Vercel** — frontend deployment
* **Render** — backend deployment
* **Supabase** — PostgreSQL database and object storage

---

# Why These Technologies?

## NestJS

NestJS provides a structured backend architecture using modules, controllers, services, guards, and dependency injection.

This made it suitable for implementing authentication, role-based authorization, and property-related business logic without putting all logic inside controllers.

## Next.js

Next.js provides routing, server/client rendering capabilities, and a good foundation for building the public property listing and role-based dashboards.

## TanStack Query + Zustand

TanStack Query is used for server-state management such as property data and API requests.

Zustand is used for client-side state such as authentication/user state and favorite-related UI state.

Keeping server state and client state separate makes the frontend easier to reason about.

## Supabase

Supabase provides managed PostgreSQL and object storage.

PostgreSQL fits the relational nature of users, properties, and favorites, while Supabase Storage provides a practical solution for property images.

---

# Architecture

```text
                         ┌─────────────────────┐
                         │       Users         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │      Frontend       │
                         │       Vercel        │
                         └──────────┬──────────┘
                                    │ REST API
                                    ▼
                         ┌─────────────────────┐
                         │       NestJS        │
                         │       Backend       │
                         │       Render        │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                ┌─────────────────┐   ┌─────────────────┐
                │ Supabase        │   │ Supabase        │
                │ PostgreSQL      │   │ Storage         │
                │ Database        │   │ Property Images │
                └─────────────────┘   └─────────────────┘
```

---

# Backend Architecture

The backend follows a modular NestJS structure.

```text
backend/
├── src/
│   ├── auth/
│   ├── properties/
│   ├── favorites/
│   ├── admin/
│   ├── common/
│   ├── app.module.ts
│   └── main.ts
├── package.json
└── ...
```

The API uses:

* Controllers for HTTP endpoints
* Services for business logic
* JWT authentication guards
* Role guards
* Role decorators
* DTO validation
* Supabase for persistence and storage

---

# Authorization Model

| Role           | Permissions                                                           |
| -------------- | --------------------------------------------------------------------- |
| Regular User   | Browse published properties, favorites, contact owners                |
| Property Owner | Create, edit drafts, upload images, publish and manage own properties |
| Admin          | View all properties, view metrics, disable properties                 |

Authorization is enforced on protected backend routes using JWT authentication and role guards.

---

# Property Lifecycle

```text
             ┌──────────────┐
             │     Draft    │
             └──────┬───────┘
                    │
              Publish validation
                    │
                    ▼
             ┌──────────────┐
             │   Published  │
             └──────┬───────┘
                    │
              Admin disables
                    │
                    ▼
             ┌──────────────┐
             │   Archived   │
             └──────────────┘
```

A property must contain the required information and at least one image before it can be published.

Published properties cannot be edited through the normal property update flow.

---

# API Overview

Base URL for local development:

```text
http://localhost:3003
```

Main API groups:

```text
/auth
/properties
/favorites
```

See:

```text
docs/API.postman_collection.json
```

for the complete Postman collection.

---

# Environment Variables

Create a `.env` file inside the backend:

```env
NODE_ENV=development
PORT=3003

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=7d

CORS_ORIGIN=http://localhost:3000

MAX_IMAGE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
```

For the frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

Do not commit `.env` files or secret keys to Git.

---

# Local Development

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd Mini-property-listing-platform
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

Configure the backend `.env` file.

Start the backend:

```bash
npm run start:dev
```

The API runs on:

```text
http://localhost:3003
```

## 3. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3003
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

# Deployment

The planned deployment architecture is:

```text
GitHub
   │
   ├── frontend/
   │       │
   │       ▼
   │     Vercel
   │
   └── backend/
           │
           ▼
         Render
           │
           ▼
        Supabase
      ┌────┴────┐
      │         │
   Database   Storage
```

The production frontend should use:

```env
NEXT_PUBLIC_API_URL=https://<your-render-backend>.onrender.com
```

The backend CORS configuration should allow the deployed Vercel frontend URL.

Production secrets should be configured through the hosting provider's environment-variable settings rather than committed to the repository.

---

# Technical Decisions

## 1. JWT Authentication

JWT authentication was selected because the application requires a lightweight authentication mechanism for a REST API.

The frontend persists the authentication token using a cookie and sends the token as a Bearer token when making authenticated API requests.

The backend validates the JWT before allowing access to protected endpoints.

## 2. PostgreSQL

PostgreSQL was selected because the application contains relational data such as users, properties, and favorites.

## 3. Supabase Storage

Property images are stored in Supabase Storage rather than directly in the database.

The database stores the image URLs associated with each property.

## 4. REST API

A REST API provides a clear separation between the Next.js frontend and NestJS backend.

## 5. Zustand + TanStack Query

TanStack Query handles API/server state while Zustand handles client-side application state.

## 6. Soft Deletion

Property records use deletion/archive state rather than immediately removing records from the database.

This helps preserve historical data and prevents accidental permanent deletion.

---

# Important Business Rules

### Publishing

A property can only be published when:

* Title is provided
* Description is provided
* Location is provided
* Price is greater than zero
* At least one image exists
* Property is currently a draft

### Editing

Published properties cannot be edited through the normal update endpoint.

### Ownership

Property owners can manage only their own properties.

### Administration

Administrators can view the complete property list and disable properties.

---

# Error Handling

The API uses HTTP status codes to communicate request results.

Examples include:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
```

The frontend displays appropriate loading and error states for API operations.

---

# Current Limitations / Future Improvements

The following features could be added in a larger production system:

* API rate limiting
* CSRF protection depending on the final authentication architecture
* OAuth/social login
* Two-factor authentication
* Advanced property search
* Full-text search
* Image resizing/optimization pipeline
* Automated tests with broader coverage
* Centralized logging and monitoring
* Redis caching for high-traffic endpoints
* More advanced analytics
* Refresh-token rotation

These are intentionally outside the scope of the current practical assessment.

---

# Documentation

API documentation:

```text
docs/API.postman_collection.json
```

Deployment notes:

```text
DEPLOYMENT.md
```

---

# Project Status

The core application functionality is implemented and tested locally.

Completed:

* Authentication
* Role-based authorization
* Property creation
* Property editing
* Property publishing
* Property image uploads
* Property listing and filtering
* Favorites
* Contact owner functionality
* Admin property management
* Admin metrics
* Responsive frontend
* Loading/error states
* API documentation


