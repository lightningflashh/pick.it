# Pickit Backend

Backend API for Pickit e-commerce, built with Express, TypeScript, PostgreSQL (TypeORM), and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Run with Docker (Databases)](#run-with-docker-databases)
- [Run the API Locally](#run-the-api-locally)
- [Scripts](#scripts)
- [Database Migrations](#database-migrations)
- [API Base URL](#api-base-url)
- [API Endpoints (v1)](#api-endpoints-v1)
- [Authentication Flow](#authentication-flow)
- [Validation and Error Format](#validation-and-error-format)
- [Known Notes](#known-notes)

## Overview

This service provides core APIs for:

- User registration, verification, login, logout, token refresh
- Product and category management
- Product variant management (color, size, stock, price)
- Color and size catalog management

The application connects to:

- PostgreSQL for relational data (users, products, orders, etc.)
- MongoDB for additional document data (configured and connected at startup)

## Tech Stack

- Node.js + Express 5
- TypeScript
- TypeORM
- PostgreSQL
- MongoDB Node Driver
- class-validator and class-transformer
- JWT authentication (cookie-based)
- MailerSend (account verification email)

## Project Structure

- src/index.ts: app bootstrap and DB connections
- src/config: environment and database configuration
- src/routes/v1: API route definitions
- src/controllers: request handlers
- src/services: business logic
- src/entities: TypeORM entities
- src/dto: validation DTOs
- src/middlewares: auth, RBAC, error handling
- src/providers: JWT and MailerSend integrations
- src/migrations: TypeORM migrations

## Prerequisites

- Node.js 18+
- Yarn 1.x or 4+ (project currently uses yarn.lock)
- Docker Desktop (optional, for local PostgreSQL and MongoDB)

## Environment Variables

Create a .env file in project root. You can start from .env.example.

Required variables:

- LOCAL_DEV_APP_HOST
- LOCAL_DEV_APP_PORT
- BUILD_MODE
- POSTGRES_URI
- MONGODB_URI
- DATABASE_NAME
- WEBSITE_DOMAIN_DEVELOPMENT
- WEBSITE_DOMAIN_PRODUCTION
- ACCESS_TOKEN_SECRET_SIGNATURE
- ACCESS_TOKEN_LIFE
- REFRESH_TOKEN_SECRET_SIGNATURE
- REFRESH_TOKEN_LIFE
- ADMIN_SENDER_EMAIL
- ADMIN_SENDER_NAME
- MAILER_SEND_API_KEY

Example values:

```env
LOCAL_DEV_APP_HOST=localhost
LOCAL_DEV_APP_PORT=8017
BUILD_MODE=development

POSTGRES_URI=postgresql://pickit:123456@localhost:5432/pickit_db

MONGODB_URI=mongodb://root:123456@127.0.0.1:27017/?authSource=admin
DATABASE_NAME=pickit_db

WEBSITE_DOMAIN_DEVELOPMENT=http://localhost:5173
WEBSITE_DOMAIN_PRODUCTION=https://your-frontend-domain.com

ACCESS_TOKEN_SECRET_SIGNATURE=your_access_secret
ACCESS_TOKEN_LIFE=1h

REFRESH_TOKEN_SECRET_SIGNATURE=your_refresh_secret
REFRESH_TOKEN_LIFE=14 days

ADMIN_SENDER_EMAIL=no-reply@your-domain.com
ADMIN_SENDER_NAME=Pickit
MAILER_SEND_API_KEY=your_mailersend_api_key
```

## Run with Docker (Databases)

Start PostgreSQL and MongoDB using docker-compose:

```bash
docker compose up -d
```

Default docker-compose services:

- PostgreSQL: localhost:5432
- MongoDB: localhost:27017

Stop services:

```bash
docker compose down
```

## Run the API Locally

1. Install dependencies:

```bash
yarn install
```

2. Start development server:

```bash
yarn dev
```

3. API starts at:

- http://localhost:8017 (or your LOCAL_DEV_APP_PORT)
- v1 prefix: /api/v1

## Scripts

- yarn dev: start development server with nodemon + tsx
- yarn build: compile TypeScript to dist
- yarn lint: run ESLint
- yarn lint:fix: auto-fix lint issues
- yarn prettier: check formatting
- yarn prettier:fix: apply formatting
- yarn typeorm: run TypeORM CLI
- yarn migration:generate -d src/config/data-source.ts: generate migration
- yarn migration:run -d src/config/data-source.ts: apply migrations
- yarn migration:revert -d src/config/data-source.ts: revert latest migration

## Database Migrations

Generate a new migration:

```bash
yarn migration:generate --name YourMigrationName
```

Run pending migrations:

```bash
yarn migration:run
```

Revert latest migration:

```bash
yarn migration:revert
```

## API Base URL

- Local base URL: http://localhost:8017/api/v1

## API Endpoints (v1)

### Users

- POST /users/register
- POST /users/verify
- POST /users/login
- DELETE /users/logout
- GET /users/refresh-token

Verify DTO (current validation):

- email: valid email
- token: UUID string

### Products

- POST /products
- GET /products
- GET /products/:id
- PUT /products
- DELETE /products/:id

### Categories

- POST /categories (auth + admin)
- GET /categories
- GET /categories/:id
- PUT /categories/:id (auth + admin)
- DELETE /categories/:id (auth + admin)

### Variants

- POST /variants (auth)
- GET /variants
- GET /variants/:id
- PUT /variants/:id (auth)
- DELETE /variants/:id (auth)

### Colors

- POST /colors (auth)
- GET /colors
- PUT /colors/:id (auth)
- DELETE /colors/:id (auth)

### Sizes

- POST /sizes (auth)
- GET /sizes
- PUT /sizes/:id (auth)
- DELETE /sizes/:id (auth)

## Authentication Flow

1. Register user using POST /users/register.
2. System creates verify token and sends verification email (MailerSend).
3. Verify account with POST /users/verify (email + token).
4. Login via POST /users/login.
5. On successful login, backend sets cookies:
   - accessToken
   - refreshToken
6. Access protected routes with valid accessToken cookie.
7. Refresh access token via GET /users/refresh-token when needed.

## Validation and Error Format

DTO validation middleware returns 400 for invalid payloads:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "constraints": {
        "isEmail": "email must be an email"
      }
    }
  ]
}
```

## Known Notes

- Cookies are configured with secure: true and sameSite: none. For plain HTTP local testing, browsers may block secure cookies. Use HTTPS in development (or adjust cookie settings for local only).
- Both PostgreSQL and MongoDB are initialized before server start. Ensure both are reachable.
- Lint config currently warns on console usage; there are still console logs in runtime code.
