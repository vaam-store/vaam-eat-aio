# Architecture Overview

This is a food delivery app.

## High-Level System Architecture

The vaam-eat-aio project is a Next.js application using the app-router, React Server/Client Components, and Tailwind CSS with daisyUI. The backend involves tRPC, ZenStack, Prisma, PostgreSQL, Redis, S3-compatible storage, and SMTP email.

### Frontend

- Next.js app-router
- React Server/Client Components
- Tailwind CSS with daisyUI

### Backend

- tRPC for API
- ZenStack for access control and field-level security
- Prisma for database interactions
- PostgreSQL as the database
- Redis for caching
- S3-compatible storage for file storage
- SMTP email for email notifications

### API/Data Flow

- tRPC routers handle API requests
- Schema-driven types ensure type safety
- Prisma Client is used for database access

### Infrastructure

- Docker for containerization
- Vercel for deployment
- Serverless architecture

## Project Structure

The project follows a well-organized directory structure:

```
vaam-eat-aio/
├── docs/                  # Documentation files
│   └── res/               # Resource documentation (ToS, Privacy, FAQ)
├── public/                # Static assets
├── src/                   # Main application code
│   ├── app/               # Next.js app router pages
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (checkout)/    # Checkout flow routes
│   │   ├── (main)/        # Main application routes
│   │   │   ├── @modal/    # Modal route interceptors
│   │   │   ├── cart/      # Shopping cart pages
│   │   │   ├── orders/    # Order management
│   │   │   ├── res/       # Resource pages
│   │   │   ├── search/    # Search functionality
│   │   │   ├── settings/  # User settings
│   │   │   └── v/         # Vendor-specific pages
│   │   ├── (product)/     # Product-specific routes
│   │   ├── (vendor)/      # Vendor management routes
│   │   └── api/           # API routes
│   │       ├── auth/      # Authentication API
│   │       └── trpc/      # tRPC API endpoints
│   ├── components/        # Reusable React components
│   │   ├── app/           # Application-specific components
│   │   ├── auth/          # Authentication components
│   │   ├── button/        # Button components
│   │   ├── cart/          # Shopping cart components
│   │   ├── container/     # Layout containers
│   │   ├── home/          # Homepage components
│   │   ├── list-block/    # List block components
│   │   ├── list-item/     # List item components
│   │   ├── modal/         # Modal components
│   │   ├── navigation/    # Navigation components
│   │   ├── network-status/# Network status components
│   │   ├── orders/        # Order-related components
│   │   ├── search/        # Search components
│   │   ├── section/       # Section components
│   │   ├── settings/      # Settings components
│   │   ├── text/          # Text components
│   │   └── theme-toggle/  # Theme toggle components
│   ├── hooks/             # Custom React hooks
│   ├── server/            # Server-side code
│   │   ├── api/           # API handlers
│   │   │   └── routers/   # tRPC routers
│   │   ├── auth/          # Authentication logic
│   │   ├── email/         # Email functionality
│   │   ├── md/            # Markdown processing
│   │   └── s3/            # S3 storage integration
│   ├── styles/            # Global styles
│   ├── trpc/              # tRPC client setup
│   └── utils/             # Utility functions
└── [config files]         # Various configuration files
```

### Key Directories

- **app/**: Contains all Next.js pages using the app router pattern with route groups for different sections of the application.
- **components/**: Houses all reusable React components organized by functionality.
- **server/**: Contains server-side code including API handlers, authentication, and external service integrations.
- **hooks/**: Custom React hooks for shared client-side logic.
- **trpc/**: tRPC client configuration for type-safe API calls.

## Component/Module Structure and Conventions

- File/folder organization follows Next.js app-router patterns
- React components are organized into separate files and folders
- Components are split into server and client components
- State and data management use React Hooks, Zustand, and TanStack Query
- Forms and validation use Formik and Zod
- Styling uses Tailwind CSS and daisyUI

### Key Conventions

- Strict TypeScript usage
- AirBnB and biome linting rules are followed
- No default exports are used
- Function components are used exclusively

## Distinctive Architectural Decisions and Best Practices

- Security: ZenStack is used for access control and field-level security
- Optimistic UI: tRPC mutation options are used for optimistic updates
- Caching: Redis is used for caching expensive reads
- Database: Prisma Client is used for database interactions, with a single instance per request for multitenancy and row-level security

## Code Quality and Convention Adherence

Recent "small things" fixes demonstrate adherence to code quality and conventions, including:

- Code hygiene improvements
- Linting rule updates
- Naming convention consistency
