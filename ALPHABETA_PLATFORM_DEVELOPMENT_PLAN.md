# Alphabeta Platform MVP Execution Plan

## 1. MVP Goal

Build a simple, production-ready first version of Alphabeta as one company platform.

This is not a SaaS system for now.

Scope for this MVP:

- One business: Alphabeta
- One backend: NestJS
- One database: PostgreSQL
- One ORM: Prisma
- One frontend: Next.js using the existing Bazaar Pro template
- Simple roles: Admin and Customer
- Simple payments: Cash on Delivery and Bank Transfer only

What this document is for:

- It is a real implementation task plan
- It is written for building in phases
- It avoids advanced architecture that slows delivery

## 2. Build Rules

Use these rules throughout development:

- Keep controllers, services, DTOs, and Prisma logic simple
- Do not build multi-tenant logic
- Do not add Redis now
- Do not add BullMQ now
- Do not build microservices
- Do not add external payment or shipping APIs now
- Do not split backend into complex application and domain layers
- Do not over-model features you are not ready to ship

Recommended approach:

- Build one NestJS backend app
- Build one PostgreSQL database
- Reuse Bazaar pages and components where possible
- Replace the current mock API usage step by step

## 3. Simplified System Architecture

```text
Customers / Admin
       |
       v
Next.js Frontend (Bazaar Pro)
       |
       | HTTP / REST API
       v
NestJS Backend
       |
       v
PostgreSQL Database
       |
       v
Prisma ORM
```

### Practical frontend flow

- Public pages show products, categories, services, and basic store information
- Customer pages handle login, cart, checkout, orders, tickets, and service requests
- Admin pages manage products, categories, orders, tickets, services, and manual payment review

### Practical backend flow

- NestJS exposes REST endpoints only
- Prisma handles database queries
- Uploaded files can be stored locally at first or in simple object storage later
- Authentication uses JWT

## 4. What To Reuse From The Current Workspace

The current Bazaar workspace already gives you a large part of the UI shell.

Use it like this:

- Keep public storefront pages that fit product browsing and checkout
- Keep admin dashboard pages that can be adapted for Alphabeta operations
- Remove dependency on mock endpoints under src/__server__ once real APIs are ready
- Replace fake cart and fake order data with backend-driven data in phases

Recommended frontend rule:

- Do not rewrite the whole Bazaar template first
- Connect screens to real APIs one module at a time

Suggested order for replacing mock data:

1. Auth
2. Products and categories
3. Cart and checkout
4. Orders
5. Tickets
6. Services

## 5. MVP Features

### 5.1 Authentication

- Register
- Login
- JWT authentication
- Roles: Admin, Customer

### 5.2 Products

- Categories
- Products
- Product images
- Optional simple variant support

### 5.3 Orders

- Cart
- Checkout
- Order creation
- Order status tracking

### 5.4 Payments

- Cash on Delivery
- Bank transfer with manual review

### 5.5 Support System

- Tickets
- Messages inside tickets

### 5.6 Services

- Simple services list
- Service request form

### 5.7 Optional Later

- Basic subscription system without billing automation

## 6. Simplified Database Schema

Only include tables required for the MVP.

### 6.1 Users and Auth

| Table | Purpose | Main columns |
|---|---|---|
| users | App users | id, name, email, phone nullable, password_hash, role, status, created_at |
| refresh_tokens | Keep login sessions refreshable | id, user_id, token_hash, expires_at, revoked_at, created_at |

Notes:

- Keep role simple as enum for MVP: ADMIN, CUSTOMER
- If you need more roles later, migrate to a dedicated roles table

### 6.2 Catalog

| Table | Purpose | Main columns |
|---|---|---|
| categories | Product categories | id, name, slug, parent_id nullable, is_active, created_at |
| products | Product records | id, category_id, name, slug, description, short_description, price, compare_price nullable, sku nullable, stock_qty, type, status, created_at |
| product_images | Product images | id, product_id, image_url, sort_order |
| product_variants | Optional basic variants | id, product_id, name, value, price nullable, stock_qty nullable |

Notes:

- Product type can be PHYSICAL or DIGITAL if needed
- If digital products are not needed in the first sprint, keep the type column but do not build download logic yet
- Variants should stay simple; do not build a complex attribute engine now

### 6.3 Cart and Orders

| Table | Purpose | Main columns |
|---|---|---|
| carts | Active customer cart | id, user_id nullable, session_id nullable, created_at, updated_at |
| cart_items | Cart lines | id, cart_id, product_id, variant_id nullable, quantity, unit_price |
| addresses | Customer addresses | id, user_id, city, area, street, building nullable, notes nullable, is_default |
| orders | Order header | id, order_number, user_id, customer_name, customer_phone, payment_method, payment_status, order_status, subtotal, delivery_fee, total_amount, address_text, notes nullable, created_at |
| order_items | Order lines | id, order_id, product_id nullable, product_name, sku nullable, quantity, unit_price, total_price |
| order_status_history | Order status log | id, order_id, status, note nullable, created_at |

Notes:

- Save product name and pricing snapshot in order_items
- Do not depend on live product data after order creation
- Use address_text snapshot in orders to keep checkout simple

### 6.4 Payments

| Table | Purpose | Main columns |
|---|---|---|
| payment_transactions | Manual payment records | id, order_id, payment_method, amount, status, reference_number nullable, notes nullable, created_at |
| bank_transfer_receipts | Uploaded proof for bank transfer | id, payment_transaction_id, file_url, uploaded_by, reviewed_by nullable, review_status, created_at |

Notes:

- Cash on Delivery does not need provider integration
- Bank transfer is manual review only in MVP

### 6.5 Support

| Table | Purpose | Main columns |
|---|---|---|
| tickets | Support tickets | id, ticket_number, user_id, subject, status, priority, created_at |
| ticket_messages | Messages inside ticket | id, ticket_id, sender_id, message, created_at |

Notes:

- Keep ticket status simple: OPEN, IN_PROGRESS, CLOSED
- Do not build live chat sockets for MVP

### 6.6 Services

| Table | Purpose | Main columns |
|---|---|---|
| services | Published services | id, name, slug, description, base_price nullable, is_active, created_at |
| service_requests | Customer requests for services | id, service_id, user_id, customer_name, customer_phone, preferred_date nullable, address_text, notes nullable, status, created_at |

Notes:

- Service status can be PENDING, CONTACTED, COMPLETED, CANCELLED

### 6.7 Optional Later Table

| Table | Purpose | Main columns |
|---|---|---|
| subscriptions | Optional later feature | id, user_id or customer_id, plan_name, start_date, end_date, status |

Do not build this table until the core MVP is stable unless there is a clear short-term need.

## 7. Minimal Relationships

```text
users
  ├── refresh_tokens
  ├── addresses
  ├── orders
  ├── tickets
  └── service_requests

categories
  └── products
        ├── product_images
        └── product_variants

carts
  └── cart_items

orders
  ├── order_items
  ├── order_status_history
  └── payment_transactions
          └── bank_transfer_receipts

tickets
  └── ticket_messages

services
  └── service_requests
```

## 8. Clean NestJS Folder Structure

Keep the backend structure small and obvious.

```text
backend/
  prisma/
    schema.prisma
    migrations/
    seed.ts

  src/
    main.ts
    app.module.ts

    config/
      env.validation.ts

    common/
      decorators/
      dto/
      guards/
      filters/
      interceptors/
      utils/

    prisma/
      prisma.module.ts
      prisma.service.ts

    auth/
      auth.controller.ts
      auth.service.ts
      auth.module.ts
      dto/
      guards/
      strategies/

    users/
      users.controller.ts
      users.service.ts
      users.module.ts
      dto/

    categories/
      categories.controller.ts
      categories.service.ts
      categories.module.ts
      dto/

    products/
      products.controller.ts
      products.service.ts
      products.module.ts
      dto/

    cart/
      cart.controller.ts
      cart.service.ts
      cart.module.ts
      dto/

    orders/
      orders.controller.ts
      orders.service.ts
      orders.module.ts
      dto/

    payments/
      payments.controller.ts
      payments.service.ts
      payments.module.ts
      dto/

    tickets/
      tickets.controller.ts
      tickets.service.ts
      tickets.module.ts
      dto/

    services/
      services.controller.ts
      services.service.ts
      services.module.ts
      dto/

    uploads/
      uploads.controller.ts
      uploads.service.ts
      uploads.module.ts
```

Rules for this structure:

- One folder per feature
- Keep DTOs inside each feature
- Keep business logic in services
- Keep database access through Prisma service
- Do not create extra layers unless the codebase becomes hard to manage

## 9. API Endpoints By Module

Base prefix: /api/v1

### 9.1 Auth

- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me

### 9.2 Users

- GET /users/me
- PATCH /users/me
- GET /users/me/addresses
- POST /users/me/addresses
- PATCH /users/me/addresses/:id
- DELETE /users/me/addresses/:id

### 9.3 Categories

- GET /categories
- GET /categories/:slug
- POST /categories
- PATCH /categories/:id
- DELETE /categories/:id

### 9.4 Products

- GET /products
- GET /products/:slug
- POST /products
- PATCH /products/:id
- DELETE /products/:id
- POST /products/:id/images
- DELETE /products/:id/images/:imageId
- POST /products/:id/variants
- PATCH /products/:id/variants/:variantId
- DELETE /products/:id/variants/:variantId

### 9.5 Cart

- GET /cart
- POST /cart/items
- PATCH /cart/items/:id
- DELETE /cart/items/:id
- DELETE /cart/clear

### 9.6 Orders

- POST /checkout
- GET /orders/my
- GET /orders/my/:id
- POST /orders/:id/cancel
- GET /admin/orders
- GET /admin/orders/:id
- PATCH /admin/orders/:id/status

### 9.7 Payments

- GET /payment-methods
- POST /payments/orders/:orderId/cod
- POST /payments/orders/:orderId/bank-transfer
- POST /payments/orders/:orderId/bank-transfer/receipt
- GET /admin/payments
- PATCH /admin/payments/:id/review

### 9.8 Tickets

- GET /tickets
- POST /tickets
- GET /tickets/:id
- POST /tickets/:id/messages
- PATCH /admin/tickets/:id/status

### 9.9 Services

- GET /services
- POST /services
- PATCH /services/:id
- DELETE /services/:id
- POST /service-requests
- GET /service-requests/my
- GET /admin/service-requests
- PATCH /admin/service-requests/:id/status

### 9.10 Uploads

- POST /uploads/product-image
- POST /uploads/payment-receipt

## 10. Execution Plan By Phase

The goal is to finish one usable block at a time.

Each phase below includes:

- clear tasks
- exactly what to build
- expected output

---

## Phase 1: Project Setup + Auth

### Goal

Set up the backend foundation and connect the frontend to real authentication.

### Tasks

1. Create the NestJS backend project
2. Add Prisma and connect PostgreSQL
3. Configure environment variables
4. Add global validation and basic error handling
5. Create user and refresh token tables
6. Seed one admin account
7. Build register and login APIs
8. Add JWT auth guard
9. Add role guard for admin-only routes
10. Connect login and register pages from Bazaar frontend
11. Add current user endpoint and session handling on frontend

### Build exactly

- NestJS app running with Prisma
- User registration for customers
- Admin login
- Customer login
- JWT access token and refresh token flow
- Protected route check for admin pages

### Expected output

- Backend can start and connect to database
- Customer can register and log in
- Admin can log in
- Frontend can call auth APIs instead of mock logic
- Protected pages no longer rely on fake auth state

### Done criteria

- POST /auth/register works
- POST /auth/login works
- GET /auth/me works
- Admin route protection works

---

## Phase 2: Products + Categories

### Goal

Make the product catalog real and manageable from admin.

### Tasks

1. Create categories table and CRUD
2. Create products table and CRUD
3. Create product images table and image upload flow
4. Add optional basic product variants table
5. Add product listing filters:
   - category
   - search
   - status
6. Connect product pages in frontend to real APIs
7. Build simple admin product management pages
8. Build admin category management pages

### Build exactly

- Admin can add categories
- Admin can add products
- Admin can upload product images
- Public storefront can list products and open product details
- Optional simple variant support if needed for launch

### Expected output

- Real product catalog stored in PostgreSQL
- Public product pages pull real data
- Admin can create and edit catalog content

### Done criteria

- GET /products returns database data
- GET /products/:slug returns database data
- Admin can create and update products
- Product images display correctly in frontend

---

## Phase 3: Cart + Orders

### Goal

Allow customers to add items to cart, checkout, and create orders.

### Tasks

1. Create carts and cart_items tables
2. Support guest cart by session_id or local frontend state
3. Support customer cart after login
4. Build cart APIs
5. Create addresses table
6. Build checkout endpoint
7. Create orders, order_items, and order_status_history tables
8. Snapshot order items during checkout
9. Add customer order history page
10. Add admin order list and order details page

### Build exactly

- Add to cart
- Update quantity
- Remove item
- Checkout form
- Create order from cart
- Save order with item snapshots
- Show order history for customer
- Show order management for admin

### Expected output

- Customer can place an order from real product data
- Admin can see incoming orders
- Orders remain correct even if product data changes later

### Done criteria

- Cart endpoints work end to end
- Checkout creates orders successfully
- Customer can view own orders
- Admin can update order status

---

## Phase 4: Payments (COD + Bank Transfer)

### Goal

Add simple payment methods without external integrations.

### Tasks

1. Create payment_transactions table
2. Create bank_transfer_receipts table
3. Add payment method selection during checkout
4. Support Cash on Delivery flow
5. Support Bank Transfer flow with manual receipt upload
6. Add admin payment review page
7. Allow admin to mark payment as approved or rejected
8. Update order payment_status after review

### Build exactly

- COD as a selectable payment method
- Bank transfer as a selectable payment method
- Receipt upload after order placement or during payment step
- Admin review screen for manual payment validation

### Expected output

- Orders can be created with payment method attached
- Bank transfer receipts are stored and reviewable
- Admin can manually confirm payments

### Done criteria

- COD orders work with no provider integration
- Bank transfer receipt upload works
- Admin payment review updates payment and order status correctly

---

## Phase 5: Support System (Tickets)

### Goal

Allow customers to open support tickets and continue the conversation.

### Tasks

1. Create tickets table
2. Create ticket_messages table
3. Build create ticket endpoint
4. Build ticket list and ticket details endpoints
5. Build add message endpoint
6. Build customer ticket pages in frontend
7. Build admin ticket list and ticket details pages
8. Allow admin to update ticket status

### Build exactly

- Customer creates ticket
- Customer sends messages inside ticket
- Admin reads and replies
- Admin changes ticket status

### Expected output

- Support workflow works without live chat complexity
- Ticket conversations are stored clearly in database

### Done criteria

- Ticket creation works
- Messages are persisted correctly
- Admin can manage ticket status

---

## Phase 6: Services

### Goal

Add service publishing and customer service requests.

### Tasks

1. Create services table
2. Create service_requests table
3. Build admin CRUD for services
4. Build public services list page
5. Build service request form
6. Build admin service request management page
7. Allow admin to update service request status

### Build exactly

- Admin can create installation and maintenance services
- Customer can browse services
- Customer can submit service request
- Admin can track service requests

### Expected output

- Alphabeta can manage product-related services in the same platform

### Done criteria

- Services list works
- Service request submission works
- Admin can manage service requests

---

## Phase 7: Optional Improvements

### Goal

Add useful improvements only after the MVP is stable.

### Candidate improvements

1. Basic subscriptions table if needed by business model
2. Better product filtering and sorting
3. Basic dashboard analytics
4. Email notifications for order and ticket updates
5. Better file storage strategy
6. Product reviews if needed
7. Discount or coupon support

### Build exactly

- Only choose improvements that solve an active business problem

### Expected output

- Stable improvements without slowing the main delivery path

## 11. Suggested Development Order Inside The Workspace

Use this execution order so the frontend stays stable while backend work progresses.

### Step 1

Create backend project in a sibling backend folder.

### Step 2

Create Prisma schema and first migrations for:

- users
- refresh_tokens
- categories
- products
- product_images
- product_variants

### Step 3

Wire auth pages and product pages in the current Next.js app.

### Step 4

Add cart and orders.

### Step 5

Add manual payments.

### Step 6

Add tickets.

### Step 7

Add services.

### Step 8

Remove old mock dependencies that are no longer used.

## 12. What To Ignore Now

Do not build these in MVP:

- Multi-tenant store system
- Store approval workflows
- Vendor dashboards as separate business ownership logic
- Subscription billing automation
- Payment gateway integrations
- Shipping carrier APIs
- Realtime chat
- Redis caching
- Queue workers
- Event-driven architecture
- Microservices
- Advanced reporting
- Complex RBAC permissions matrix
- Complex product attribute engine

If the business later needs them, add them after the core system is stable.

## 13. What To Build Later

These are valid later upgrades, but not now:

1. More roles such as support staff or manager
2. Advanced inventory controls
3. Coupons and discounts
4. Product reviews and ratings
5. Digital product download flow
6. Shipping fee matrix by city
7. SMS and email notifications
8. Payment gateway integrations for local providers
9. Admin dashboard analytics
10. Basic subscription system

## 14. Common Mistakes To Avoid

### Product mistakes

- Do not build a complex variant system too early
- Do not add too many product fields before real usage proves they are needed
- Do not store only image arrays in product JSON; keep product_images as a separate table

### Order mistakes

- Do not calculate old orders from current product prices
- Do not skip order status history
- Do not make checkout depend on too many optional fields

### Auth mistakes

- Do not keep plain JWT logic scattered across controllers
- Do not store plain refresh tokens in the database
- Do not mix admin-only logic into public routes

### Project mistakes

- Do not rewrite the Bazaar UI from scratch
- Do not introduce abstraction before repeated code appears
- Do not build future features before the MVP flow works end to end
- Do not wait for perfect architecture before shipping usable modules

## 15. Definition Of MVP Done

The Alphabeta MVP is done when all of the following are true:

- Customer can register and log in
- Admin can log in and manage products and categories
- Public users can browse products
- Customer can add products to cart and place an order
- Customer can choose Cash on Delivery or Bank Transfer
- Admin can review manual bank transfer payments
- Customer can create support tickets and exchange messages
- Customer can submit service requests
- Main Bazaar frontend screens use real backend APIs instead of mock data for these flows

## 16. Final Execution Advice

Build the platform vertically, not horizontally.

That means:

- finish one real user flow at a time
- connect frontend and backend early
- ship working modules before adding optional architecture

Best implementation order:

1. Auth working end to end
2. Products working end to end
3. Cart and checkout working end to end
4. Orders and payment review working end to end
5. Tickets working end to end
6. Services working end to end

If a decision does not make the current MVP easier to build or safer to run, postpone it.
