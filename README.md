# Pick!t Backend

A comprehensive e-commerce backend API built with Express, TypeScript, PostgreSQL (TypeORM), and MongoDB. Pickit provides full-featured product catalog, shopping cart, order management, and coupon system capabilities.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Scripts](#scripts)
- [Database Migrations](#database-migrations)
- [API Documentation](#api-documentation)
- [Authentication Flow](#authentication-flow)
## Overview

Pick!t Backend is a full-featured e-commerce API that provides:

**User Management**
- User registration with email verification
- JWT-based authentication (access & refresh tokens)
- Cookie-based session management
- Account verification via MailerSend

**Product Catalog**
- Product and category management
- Product variants with color, size, and pricing options
- Product inventory tracking
- Advanced product filtering and pagination

**Shopping & Orders**
- Shopping cart management with add/update/remove items
- Complete order management system
- Order status tracking (pending, confirmed, shipped, delivered)
- Payment status tracking (pending, completed, failed, refunded)
- Order history and user-specific order retrieval

**Discount & Promotions**
- Coupon code system with percentage and fixed discounts
- Usage limits and validity period management
- Automatic coupon application during checkout
- Coupon validation and expiry handling
- Remaining usage tracking

**Payment Integration**
- VNPAY payment gateway integration
- Secure payment URL generation
- IPN (Instant Payment Notification) handling
- Payment status query and reconciliation (DR)
- Support for multiple payment methods

**Core Features**
- PostgreSQL for relational data persistence
- MongoDB integration for flexible document storage
- RBAC (Role-Based Access Control)
- Comprehensive error handling
- Input validation with class-validator
- API versioning support (v1, v2 ready)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Language | TypeScript |
| Databases | PostgreSQL (TypeORM) + MongoDB |
| Validation | class-validator, class-transformer |
| Authentication | JWT (cookies) |
| Email | MailerSend API |
| HTTP Status | http-status-codes |
| Linting | ESLint |
| Formatting | Prettier |

## Features

**Authentication & Authorization**
- User registration and email verification
- JWT-based access and refresh tokens
- Role-based access control (RBAC)
- Secure cookie handling

**Product Management**
- Full CRUD operations for products
- Category organization
- Color and size catalogs
- Product variant management with pricing

**Shopping**
- Shopping cart management
- Add/update/remove cart items
- Cart persistence per user

**Orders**
- Create orders from cart
- Order status tracking
- Payment status management
- Order history retrieval
- Order detail inspection

**Promotions**
- Create and manage coupon codes
- Percentage and fixed discount types
- Usage limits and validity periods
- Coupon application at checkout
- Automatic usage tracking

**Payment Processing**
- VNPAY payment gateway integration
- Multiple payment methods (bank transfer, card, wallet)
- Secure payment URL generation with HMAC signature
- Payment status tracking and reconciliation
- IPN webhook handling for transaction confirmation
- Transaction query and monitoring

**API Features**
- RESTful API design
- Comprehensive pagination support
- Advanced filtering and sorting
- Consistent error responses
- Request validation

## Project Structure

```
src/
├── index.ts                 # Application entry point, server setup
├── config/                  # Configuration files
│   ├── cors.ts             # CORS middleware setup
│   ├── data-source.ts      # TypeORM data source configuration
│   ├── environment.ts      # Environment variables validation
│   ├── mongodb.ts          # MongoDB connection setup
│   └── postgresql.ts       # PostgreSQL connection setup
├── routes/                  # API route definitions
│   └── v1/
│       ├── index.ts        # API v1 router aggregator
│       ├── userRoute.ts
│       ├── productRoute.ts
│       ├── categoryRoute.ts
│       ├── colorRoute.ts
│       ├── sizeRoute.ts
│       ├── productVariantRoute.ts
│       ├── cartRoute.ts
│       ├── orderRoute.ts
│       └── couponRoute.ts
├── controllers/            # Request handlers
│   ├── userController.ts
│   ├── productController.ts
│   ├── categoryController.ts
│   ├── colorController.ts
│   ├── sizeController.ts
│   ├── productVariantController.ts
│   ├── cartController.ts
│   ├── orderController.ts
│   ├── couponController.ts
│   └── orderController.ts (includes payment methods)
├── services/              # Business logic
│   ├── userService.ts
│   ├── productService.ts
│   ├── categoryService.ts
│   ├── colorService.ts
│   ├── sizeService.ts
│   ├── productVariantService.ts
│   ├── cartService.ts
│   ├── orderService.ts
│   ├── couponService.ts
│   └── paymentService.ts
├── entities/              # TypeORM entities
│   ├── Base.ts           # Base entity with timestamps
│   ├── User.ts
│   ├── Product.ts
│   ├── Category.ts
│   ├── Color.ts
│   ├── Size.ts
│   ├── ProductVariant.ts
│   ├── Cart.ts
│   ├── CartItem.ts
│   ├── Order.ts
│   ├── OrderItem.ts
│   ├── OrderCoupon.ts
│   ├── Coupon.ts
│   └── [enum files]      # Enums for statuses
├── dto/                   # Validation DTOs
│   ├── Create*Dto.ts
│   ├── Update*Dto.ts
│   └── [other DTOs]
├── middlewares/           # Express middlewares
│   ├── authMiddleware.ts
│   ├── rbacMiddleware.ts
│   └── errorHandlingMiddleware.ts
├── providers/            # External service integrations
│   ├── JwtProvider.ts
│   └── MailerSendProvider.ts
├── types/               # TypeScript type definitions
│   ├── Auth/
│   ├── Product/
│   └── ProductVariant/
├── utils/              # Utility functions
│   ├── ApiError.ts    # Custom error class
│   ├── constants.ts
│   ├── formatters.ts
│   └── ...
├── validation/         # Validation utilities
│   └── ValidateDto.ts
└── migrations/         # Database migrations
    └── [migration files]
```

## Prerequisites

- **Node.js** 18.0.0 or higher
- **Yarn** 1.x or 4+ (project uses yarn.lock)
- **Docker Desktop** (recommended for PostgreSQL and MongoDB)
- **Git** for version control

## Environment Variables

Create a `.env` file in the project root. You can copy from `.env.example` as a starting point.

### Server Configuration

```env
LOCAL_DEV_APP_HOST=localhost          # Server host
LOCAL_DEV_APP_PORT=8017               # Server port
BUILD_MODE=development                # development or production
```

### Database Configuration

```env
# PostgreSQL
POSTGRES_URI=postgresql://user:password@host:port/database

# MongoDB
MONGODB_URI=mongodb://user:password@host:port/?authSource=admin
DATABASE_NAME=database_name
```

### Frontend Configuration

```env
WEBSITE_DOMAIN_DEVELOPMENT=http://localhost:5173
WEBSITE_DOMAIN_PRODUCTION=https://your-frontend-domain.com
```

### JWT Authentication

```env
ACCESS_TOKEN_SECRET_SIGNATURE=your_access_secret_key
ACCESS_TOKEN_LIFE=1h                  # e.g., 15m, 1h, 24h

REFRESH_TOKEN_SECRET_SIGNATURE=your_refresh_secret_key
REFRESH_TOKEN_LIFE=14 days            # e.g., 7 days, 30 days
```

### Email Configuration (MailerSend)

```env
ADMIN_SENDER_EMAIL=noreply@yourdomain.com
ADMIN_SENDER_NAME=Pickit
MAILER_SEND_API_KEY=your_mailersend_api_key
```

### Payment Configuration (VNPAY)

```env
VNPAY_TMNCODE=your_terminal_code          # Terminal code from VNPAY
VNPAY_HASHSECRET=your_hash_secret         # Hash secret key from VNPAY
VNPAY_URL=https://sandbox.vnpayment.vn/paygate/pay   # VNPAY payment gateway URL
VNPAY_RETURNURL=http://localhost:3000/payment-return  # Return URL after payment
VNPAY_API=https://api.vnpayment.vn/merchant_webapi/api/transaction  # VNPAY API endpoint
```

### Example .env File

```env
# Server
LOCAL_DEV_APP_HOST=localhost
LOCAL_DEV_APP_PORT=8017
BUILD_MODE=development

# Database
POSTGRES_URI=postgresql://pickit:123456@localhost:5432/pickit_db
MONGODB_URI=mongodb://root:123456@127.0.0.1:27017/?authSource=admin
DATABASE_NAME=pickit_db

# Frontend
WEBSITE_DOMAIN_DEVELOPMENT=http://localhost:5173
WEBSITE_DOMAIN_PRODUCTION=https://example.com

# JWT
ACCESS_TOKEN_SECRET_SIGNATURE=your_super_secret_access_key_123
ACCESS_TOKEN_LIFE=1h

REFRESH_TOKEN_SECRET_SIGNATURE=your_super_secret_refresh_key_456
REFRESH_TOKEN_LIFE=14 days

# Email
ADMIN_SENDER_EMAIL=noreply@pickit.com
ADMIN_SENDER_NAME=Pickit Store
MAILER_SEND_API_KEY=your_mailersend_api_key

# Payment (VNPAY)
VNPAY_TMNCODE=1234567890
VNPAY_HASHSECRET=your_vnpay_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paygate/pay
VNPAY_RETURNURL=http://localhost:8017/payment-return
VNPAY_API=https://api.vnpayment.vn/merchant_webapi/api/transaction
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/lightningflashh/pick.it.git
cd pickit-be
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or open with your preferred editor
```

### 4. Start Databases with Docker

```bash
# Start PostgreSQL and MongoDB containers
docker compose up -d

# Verify containers are running
docker ps
```

### 5. Run Database Migrations

```bash
yarn migration:run
```

### 6. Start Development Server

```bash
yarn dev
```

The API will be available at: `http://localhost:8017/api/v1`

## Running the Application

### Development Mode

```bash
yarn dev
```

Starts the server with hot-reload using nodemon and tsx.

### Production Build

```bash
# Compile TypeScript to JavaScript
yarn build

# Start the compiled application
node dist/index.js
```

### Stop Databases

```bash
docker compose down
```

### Logs and Debugging

- Server logs are printed to console in development mode
- Check `.env` configuration if databases don't connect
- Ensure ports 5432 (PostgreSQL) and 27017 (MongoDB) are available

## Scripts

### Development & Build

| Command | Description |
|---------|-------------|
| `yarn dev` | Start dev server with hot-reload (nodemon + tsx) |
| `yarn build` | Compile TypeScript to JavaScript in dist/ |
| `yarn start` | Run compiled application |

### Linting & Formatting

| Command | Description |
|---------|-------------|
| `yarn lint` | Run ESLint to check code quality |
| `yarn lint:fix` | Auto-fix ESLint issues |
| `yarn prettier` | Check code formatting |
| `yarn prettier:fix` | Apply Prettier formatting |

### Database Migrations

| Command | Description |
|---------|-------------|
| `yarn migration:generate -n MigrationName` | Generate a new migration |
| `yarn migration:run` | Apply pending migrations |
| `yarn migration:revert` | Revert the latest migration |

### TypeORM CLI

| Command | Description |
|---------|-------------|
| `yarn typeorm` | Run TypeORM CLI commands |
| `yarn typeorm migration:show` | Show migration status |

**Example usage:**
```bash
# Generate a new migration after entity changes
yarn migration:generate -n AddNewColumn

# Run all pending migrations
yarn migration:run

# Revert last migration if needed
yarn migration:revert
```

## Database Migrations

Migrations ensure your database schema stays synchronized with entity changes.

### Workflow

1. **Make Entity Changes**
   - Modify or create new entities in `src/entities/`

2. **Generate Migration**
   ```bash
   yarn migration:generate -n DescribeYourChange
   ```
   TypeORM will compare current schema with entities and generate SQL

3. **Review Migration**
   - Check the generated file in `src/migrations/`
   - Verify the SQL looks correct

4. **Apply Migration**
   ```bash
   yarn migration:run
   ```
   This runs all pending migrations in order

5. **Commit Changes**
   - Commit both entity changes and migration files

### Common Scenarios

**Adding a new column:**
```typescript
// Entity change
@Column({ type: 'varchar', length: 255, nullable: true })
new_field!: string;

// Generate and run
yarn migration:generate -n AddNewFieldToProduct
yarn migration:run
```

**Creating a new entity:**
```bash
# Create entity in src/entities/
# Then generate migration
yarn migration:generate -n CreateNewEntity
yarn migration:run
```

**Reverting to previous state:**
```bash
yarn migration:revert
```

> **Note**: In production, always test migrations in a development environment first.

## API Documentation

### Base URL

```
http://localhost:8017/api/v1
```

### Authentication

Most endpoints require an access token passed via HTTP-only cookies. Obtain tokens through the authentication flow.

### Response Format

**Success Response (200, 201):**
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Paginated Response:**
```json
{
  "message": "Get items success",
  "data": [ /* items */ ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

**Error Response (4xx, 5xx):**
```json
{
  "statusCode": 400,
  "message": "Error description"
}
```

### Endpoints Overview

#### User Management

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/register` | x | Register new user |
| POST | `/users/verify` | x | Verify email account |
| POST | `/users/login` | x | Login and get tokens |
| POST | `/users/logout` | x | Clear authentication cookies |
| GET | `/users/refresh-token` | x | Refresh access token |

**Register Payload:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/products` | ✓ | Create new product |
| GET | `/products` | x | List all products (paginated) |
| GET | `/products/:id` | x | Get product details |
| PUT | `/products` | ✓ | Update product |
| DELETE | `/products/:id` | ✓ | Delete product |

**Query Parameters for GET /products:**
```
page=1&limit=10&name=keyword&status=true&sortBy=created_at&order=DESC
```

#### Categories

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/categories` | ✓ Admin | Create category |
| GET | `/categories` | x | List categories |
| GET | `/categories/:id` | x | Get category details |
| PUT | `/categories/:id` | ✓ Admin | Update category |
| DELETE | `/categories/:id` | ✓ Admin | Delete category |

#### Colors

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/colors` | ✓ | Create color |
| GET | `/colors` | x | List all colors |
| PUT | `/colors/:id` | ✓ | Update color |
| DELETE | `/colors/:id` | ✓ | Delete color |

#### Sizes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/sizes` | ✓ | Create size |
| GET | `/sizes` | x | List all sizes |
| PUT | `/sizes/:id` | ✓ | Update size |
| DELETE | `/sizes/:id` | ✓ | Delete size |

#### Product Variants

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/variants` | ✓ | Create variant |
| GET | `/variants` | x | List variants (paginated) |
| GET | `/variants/:id` | x | Get variant details |
| PUT | `/variants/:id` | ✓ | Update variant |
| DELETE | `/variants/:id` | ✓ | Delete variant |

#### 🛒 Shopping Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/carts/add` | ✓ | Add item to cart |
| GET | `/carts/my-cart` | ✓ | Get user's cart |
| PUT | `/carts/update` | ✓ | Update cart item quantity |
| DELETE | `/carts/remove` | ✓ | Remove item from cart |

#### Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | ✓ | Create new order |
| GET | `/orders` | x | List all orders (admin) |
| GET | `/orders/:id` | ✓ | Get order details |
| GET | `/orders/user/orders` | ✓ | Get current user's orders |
| PUT | `/orders` | ✓ | Update order (status, address) |
| DELETE | `/orders/:id` | ✓ | Cancel order |

**Create Order Payload:**
```json
{
  "items": [
    {
      "variant_id": "uuid",
      "product_name": "Product Name",
      "price": 99.99,
      "quantity": 2
    }
  ],
  "shipping_address": "123 Main St, City, Country",
  "note": "Optional delivery notes",
  "coupon_codes": ["SUMMER20", "FREE5"]
}
```

**Order Response:**
```json
{
  "order_id": "uuid",
  "status": "pending",
  "payment_status": "pending",
  "total_price": 199.98,
  "discount_amount": 30.00,
  "final_price": 169.98,
  "items": [ /* order items */ ],
  "coupons": [ /* applied coupons */ ]
}
```

#### Coupons

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/coupons` | ✓ Admin | Create coupon |
| GET | `/coupons` | x | List coupons (paginated) |
| GET | `/coupons/:id` | x | Get coupon details |
| GET | `/coupons/code/:code` | x | Validate coupon code |
| PUT | `/coupons` | ✓ Admin | Update coupon |
| DELETE | `/coupons/:id` | ✓ Admin | Delete coupon |

**Create Coupon Payload:**
```json
{
  "code": "SUMMER20",
  "discount_type": "PERCENTAGE",
  "discount_value": 20,
  "max_discount": 50,
  "min_order_value": 100,
  "start_date": "2026-05-01T00:00:00Z",
  "end_date": "2026-08-31T23:59:59Z",
  "usage_limit": 100
}
```

**Coupon Response:**
```json
{
  "coupon_id": 1,
  "code": "SUMMER20",
  "discount_type": "PERCENTAGE",
  "discount_value": 20,
  "remaining_uses": 75,
  "is_active": true,
  "is_expired": false,
  "start_date": "2026-05-01T00:00:00Z",
  "end_date": "2026-08-31T23:59:59Z"
}
```

#### 💳 Payment (VNPAY)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders/payment/create-payment-url` | ✓ | Generate VNPAY payment URL |
| GET | `/orders/payment/vnpay-return` | x | VNPAY return callback |
| POST | `/orders/payment/vnpay-ipn` | x | VNPAY IPN webhook |
| POST | `/orders/payment/query-dr` | ✓ | Query payment status |

**Create Payment URL Payload:**
```json
{
  "amount": 100000,
  "bankCode": "NCB",
  "language": "vn"
}
```

**Parameters:**
- `amount` (required): Payment amount in VND (integer)
- `bankCode` (optional): Bank code for specific bank payment. Leave empty to show all banks
  - Common codes: `NCB`, `AGRIBANK`, `SACOMBANK`, `SHB`, `BIDV`, `VIETINBANK`, `VIETCOMBANK`, `EXIMBANK`
- `language` (optional): UI language - `vn` or `en` (default: `vn`)

**Response:**
Redirects to VNPAY payment gateway (HTTP 301/302)

**Query Payment Status Payload:**
```json
{
  "orderId": "123456",
  "transDate": "20260426"
}
```

**Parameters:**
- `orderId` (required): Your order ID from payment URL creation
- `transDate` (required): Transaction date in format YYYYMMDD

**Query Payment Response:**
```json
{
  "vnp_ResponseCode": "00",
  "vnp_TransactionStatus": "00",
  "vnp_Amount": 100000,
  "vnp_BankCode": "NCB",
  "vnp_TransactionDate": "20260426141530"
}
```

**Response Codes:**
- `00` - Success / Payment received
- `01` - Bank maintenance
- `02` - Card/Account issue
- `97` - Invalid checksum/signature
- `99` - Other errors

### Query Parameters

Most GET endpoints support:

| Parameter | Type | Example |
|-----------|------|---------|
| `page` | number | `?page=2` |
| `limit` | number | `?limit=20` |
| `sortBy` | string | `?sortBy=created_at` |
| `order` | string | `?order=DESC` (or ASC) |

### Status Values

**Order Status:**
- `pending` - Order created, awaiting payment
- `confirmed` - Payment confirmed
- `shipped` - Order dispatched
- `delivered` - Order delivered

**Payment Status:**
- `pending` - Awaiting payment
- `completed` - Payment successful
- `failed` - Payment failed
- `refunded` - Refund processed

**Discount Type:**
- `PERCENTAGE` - Percentage-based discount
- `FIXED` - Fixed amount discount

## Authentication Flow

### Complete Authentication Workflow

```
User Registration
       ↓
Email Verification
       ↓
Login
       ↓
Set Access & Refresh Tokens (Cookies)
       ↓
Access Protected Routes
       ↓
Token Expires? → Refresh Token → New Access Token
       ↓
Logout (Clear Cookies)
```

## Testing Guide

For comprehensive testing instructions including order flow and payment testing, see [POSTMAN_TESTING_GUIDE.md](POSTMAN_TESTING_GUIDE.md).

### Quick Payment Testing in Postman

1. **Setup Environment** - Configure Postman environment with `base_url`, `user_id`, and `access_token`

2. **Create Payment URL:**
   ```
   POST {{base_url}}/orders/payment/create-payment-url
   Body: { "amount": 100000, "bankCode": "", "language": "vn" }
   ```

3. **Query Payment Status:**
   ```
   POST {{base_url}}/orders/payment/query-dr
   Body: { "orderId": "123456", "transDate": "20260426" }
   ```

4. **VNPAY Simulation** - Use VNPAY sandbox environment to test payments without real transactions

---

## Support & Contributing

For issues, feature requests, or contributions, please visit the [GitHub repository](https://github.com/lightningflashh/pick.it).

## License

This project is licensed under the MIT License.
