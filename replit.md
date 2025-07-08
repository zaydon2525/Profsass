# École Connect - Educational Management System

## Overview

École Connect is a comprehensive educational management system built with a modern full-stack architecture. It provides private authentication, role-based access control, and complete academic tracking capabilities. The system supports four user roles: Admin, Professor, Student, and Parent, with hierarchical user creation and permission management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling with dark/light theme support
- **Wouter** for client-side routing
- **TanStack Query** for server state management and caching
- **React Hook Form** with **Zod** validation for form handling
- **Radix UI** components for accessible UI primitives
- **Recharts** for data visualization and charts

### Backend Architecture
- **Node.js** with Express.js server
- **TypeScript** throughout for type consistency
- **Session-based authentication** with express-session
- **PostgreSQL** database with Drizzle ORM
- **Neon Database** (@neondatabase/serverless) for serverless PostgreSQL
- **bcrypt** for password hashing

### Database Architecture
- **Drizzle ORM** with PostgreSQL dialect
- Schema-first approach with shared types between client and server
- Automatic migrations support via drizzle-kit
- UUID primary keys for all entities

## Key Components

### Authentication System
- **Private authentication** (no public registration)
- **Role-based access control** with 4 levels: Admin, Professor, Student, Parent
- **Hierarchical user creation**: Admin creates Professors, Professors create Students
- **Mandatory password change** on first login
- **Session management** with secure cookies

### User Management
- **Admin dashboard** for managing professors and system overview
- **Professor interface** for managing students and course content
- **Role-based permissions** controlling access to features
- **User activity tracking** and audit logs

### Academic Management
- **Groups/Classes management** with academic year tracking
- **Subject assignment** to groups with professor associations
- **Course materials** upload and management system
- **Grading system** with progress tracking and analytics
- **File upload** support for course materials (PDF, images, videos)

### UI/UX Features
- **Responsive design** supporting mobile, tablet, and desktop
- **Dark/light theme** with persistence
- **Toast notifications** for user feedback
- **Role-specific dashboards** with customized navigation
- **Loading states** and error handling throughout

## Data Flow

### Authentication Flow
1. User attempts to access protected route
2. Auth middleware checks session for valid user ID
3. User data retrieved from database and cached
4. Role-based route protection applied
5. Appropriate dashboard rendered based on user role

### User Creation Flow
1. Authenticated user with appropriate role accesses creation form
2. Form validation with Zod schema
3. Password hashing with bcrypt
4. Database insertion with audit trail
5. Real-time UI updates via TanStack Query invalidation

### File Upload Flow
1. Drag-and-drop or file selection interface
2. Client-side validation (file type, size limits)
3. File upload to storage system (currently mocked for Supabase)
4. Metadata stored in database with file associations
5. Real-time updates to materials list

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store
- **bcrypt**: Password hashing
- **zod**: Schema validation
- **date-fns**: Date manipulation and formatting

### UI Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing
- **recharts**: Chart components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for managing variant classes

### Development Dependencies
- **typescript**: Type checking
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **esbuild**: Fast bundler for production

## Deployment Strategy

### Development Setup
- **Vite development server** with hot module replacement
- **TypeScript compilation** with shared types
- **Environment variables** for database configuration
- **Development middleware** for error handling and logging

### Production Build
- **Vite build** for optimized frontend bundle
- **esbuild** for fast server-side bundling
- **Static file serving** from Express server
- **Environment-based configuration** for different deployment targets

### Database Management
- **Drizzle migrations** for schema changes
- **Connection pooling** via Neon serverless
- **Database push** command for development schema updates

### File Storage
- **Placeholder implementation** for file uploads
- **Prepared for Supabase integration** for production file storage
- **Client-side file validation** and upload progress tracking

The system is designed to be easily deployable on platforms like Replit, Vercel, or traditional hosting with PostgreSQL database support.