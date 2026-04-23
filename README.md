# Alphabeta Store

## Overview

A fullstack eCommerce platform built with:

- Next.js (Bazaar template)
- NestJS (Backend API)
- PostgreSQL (Database)
- Prisma ORM

## Features

- Authentication (JWT)
- Product management
- Category management
- Admin dashboard
- Payments (COD + Bank Transfer manual review)
- Support tickets
- Wishlist and profile basics

## Project Structure

- frontend/ -> Next.js app (project root)
- backend/ -> NestJS API

## Getting Started

### Option A: Run PostgreSQL with Docker (recommended)

```bash
docker run -d --name alphabeta-pg-dev \
	-e POSTGRES_USER=alphabeta \
	-e POSTGRES_PASSWORD=alphabeta \
	-e POSTGRES_DB=alphabeta \
	-p 5433:5432 \
	postgres:16-alpine
```

### Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
npm run start:dev
```

### Frontend

```bash
cd .
npm install
npm run dev
```

## Environment Variables

Backend:

- DATABASE_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- JWT_ACCESS_EXPIRES_IN
- JWT_REFRESH_EXPIRES_IN
- ADMIN_NAME
- ADMIN_EMAIL
- ADMIN_PASSWORD

Use `backend/.env.example` as the starter template.

## Current Status

- Phase 1: Auth ✅ (API and frontend flow wired)
- Phase 2: Products & Categories ✅
- Phase 3: Cart + Orders ✅
- Phase 4: Payments ✅
- Phase 5: Tickets ✅
- Phase 6: Services ⏳ Pending

Runtime verification (2026-04-23):

- Backend boot: ✅
- Frontend build: ✅
- Register/login/me auth flow: ✅

## Notes

- Do not commit .env files
- Backend runs on port 3001
- Frontend runs on port 3000 (default)
- Legacy Bazaar mock endpoints still exist in `src/__server__` and should be fully removed after finishing service module integration
