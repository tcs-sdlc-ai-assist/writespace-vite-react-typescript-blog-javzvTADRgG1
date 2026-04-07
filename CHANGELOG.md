# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-01

### Added

- **Public Landing Page**
  - Hero section with gradient background and call-to-action buttons
  - Feature highlights showcasing Write & Share, Community, and Secure & Simple
  - Latest posts section displaying the three most recent blog entries
  - Responsive footer with navigation links and branding

- **Authentication System**
  - Login page with username and password validation
  - Register page with display name, username, password, and confirm password fields
  - Hard-coded admin account (`admin` / `admin123`) for initial platform access
  - Session persistence via localStorage with `currentUser` storage key
  - Automatic redirect after login based on user role (admin to dashboard, viewer to blogs)

- **Role-Based Access Control**
  - Two user roles: `admin` and `viewer`
  - `PrivateRoute` guard redirecting unauthenticated users to `/login`
  - `AdminRoute` guard restricting dashboard access to admin users only
  - `GuestRoute` guard redirecting authenticated users away from login and register pages
  - Role-based navigation links in the NavBar component

- **Blog CRUD Operations**
  - Blog list page with grid layout displaying all posts sorted by creation date
  - Create new blog post with title and content fields
  - Edit existing blog posts (available to post owner and admin users)
  - Delete blog posts with confirmation dialog (available to post owner and admin users)
  - Read blog page with full post content, author info, and action buttons
  - Character counters for title (100 max) and content (2000 max) fields
  - Form validation with inline error messages

- **Admin Dashboard**
  - Statistics overview with cards for total posts, total users, admins, and viewers
  - Recent posts table with view, edit, and delete actions
  - Quick action buttons for creating new posts and managing users
  - Gradient banner header with welcome message

- **User Management**
  - Admin-only user creation form with display name, username, password, role selection
  - Users table displaying all registered users with avatar, role badge, and creation date
  - Delete user functionality with protection against deleting the hard-coded admin or self
  - Duplicate username validation during user creation

- **Avatar System**
  - Emoji-based avatars with role-specific icons (crown for admin, book for viewer)
  - Role-specific accent colors (violet for admin, indigo for viewer)
  - Configurable avatar size with proportional emoji scaling
  - Accessible `role="img"` and `aria-label` attributes

- **Role Badge Component**
  - Pill-shaped badges displaying user role (Admin or Viewer)
  - Role-specific color theming matching the avatar system

- **Post Card Component**
  - Card layout with colored accent bar, author avatar, and metadata
  - Content excerpt with configurable character limit
  - Conditional edit and delete action buttons based on user permissions
  - Rotating accent colors across cards for visual variety

- **Stat Card Component**
  - Dashboard statistics display with icon, value, and title
  - Colored accent bar and icon background matching the stat category
  - Hover animation with elevation effect

- **CSS Modules Theming**
  - Comprehensive CSS custom properties (design tokens) for colors, typography, spacing, shadows, and transitions
  - Global reset and utility classes in `index.css`
  - Component-scoped styles using CSS Modules (`.module.css` files)
  - Responsive breakpoints at 480px, 768px, and 1024px
  - Gradient definitions for primary, secondary, accent, and hero sections
  - Custom scrollbar styling and focus-visible outlines

- **localStorage Persistence**
  - Posts stored under `posts` key with full CRUD support
  - Users stored under `users` key with create and delete support
  - Current user session stored under `currentUser` key
  - Safe JSON parsing with error fallback for corrupt data
  - Storage service with typed functions for all data operations

- **Vercel Deployment**
  - `vercel.json` configuration with SPA rewrite rules
  - Vite build configuration with source maps and dist output directory
  - Client-side routing support via catch-all rewrite to `index.html`

- **Developer Experience**
  - TypeScript strict mode with comprehensive type definitions
  - Vitest test suite with unit tests for services, components, guards, and utilities
  - Testing Library integration for React component testing
  - Lazy-loaded page components with Suspense fallback
  - Code splitting via React.lazy for all route-level components