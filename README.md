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
- Real API integration (no mock data)

## Project Structure

- frontend/ -> Next.js app (project root)
- backend/ -> NestJS API

## Getting Started

### Backend

```bash
cd backend
npm install
npm run prisma:migrate:dev
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

## Current Status

- Phase 1: Auth ✅
- Phase 2: Products & Categories ✅
- Phase 3: Cart (in progress)

## Notes

- Do not commit .env files
- Backend runs on port 3001
- Frontend runs on port 3000 or 3001 depending on setup
