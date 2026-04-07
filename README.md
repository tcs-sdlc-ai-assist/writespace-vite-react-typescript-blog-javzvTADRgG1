# WriteSpace

A modern blogging platform where ideas come to life. Write, share, and discover stories that inspire.

## Features

- **Public Landing Page** — Hero section with gradient background, feature highlights, latest posts, and responsive footer
- **Authentication System** — Login and register with session persistence via localStorage
- **Role-Based Access Control** — Admin and viewer roles with route guards (PrivateRoute, AdminRoute, GuestRoute)
- **Blog CRUD Operations** — Create, read, edit, and delete blog posts with validation and character counters
- **Admin Dashboard** — Statistics overview, recent posts table, and quick action buttons
- **User Management** — Admin-only user creation, users table, and delete functionality with protection rules
- **Avatar System** — Emoji-based avatars with role-specific icons and accent colors
- **Responsive Design** — CSS Modules with custom properties, breakpoints at 480px, 768px, and 1024px
- **Code Splitting** — Lazy-loaded page components with React.lazy and Suspense fallback

## Tech Stack

- **Framework:** [React 18+](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Build Tool:** [Vite 5](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Styling:** CSS Modules with CSS custom properties (design tokens)
- **Persistence:** localStorage (posts, users, currentUser)
- **Testing:** [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Deployment:** [Vercel](https://vercel.com/)

## Folder Structure

```
writespace/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Avatar/
│   │   │   ├── Avatar.tsx
│   │   │   ├── Avatar.module.css
│   │   │   └── Avatar.test.tsx
│   │   ├── BlogForm/
│   │   │   ├── BlogForm.tsx
│   │   │   ├── BlogForm.module.css
│   │   │   └── BlogForm.test.tsx
│   │   ├── NavBar/
│   │   │   ├── NavBar.tsx
│   │   │   └── NavBar.module.css
│   │   ├── PostCard/
│   │   │   ├── PostCard.tsx
│   │   │   └── PostCard.module.css
│   │   ├── RoleBadge/
│   │   │   ├── RoleBadge.tsx
│   │   │   └── RoleBadge.module.css
│   │   └── StatCard/
│   │       ├── StatCard.tsx
│   │       └── StatCard.module.css
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── guards/
│   │   ├── AdminRoute.tsx
│   │   ├── GuestRoute.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── guards.test.tsx
│   ├── pages/
│   │   ├── AdminDashboardPage/
│   │   ├── BlogListPage/
│   │   ├── HomePage/
│   │   ├── LoginPage/
│   │   ├── ReadBlogPage/
│   │   ├── RegisterPage/
│   │   ├── UserManagementPage/
│   │   └── WriteBlogPage/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── auth.service.test.ts
│   │   ├── avatar.service.ts
│   │   ├── storage.service.ts
│   │   └── storage.service.test.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── excerpt.ts
│   │   └── formatDate.ts
│   ├── App.tsx
│   ├── App.module.css
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── CHANGELOG.md
├── README.md
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── vitest.config.ts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later

### Installation

```bash
git clone <repository-url>
cd writespace
npm install
```

### Environment Variables

Copy the example environment file and adjust as needed:

```bash
cp .env.example .env
```

| Variable         | Description       | Default      |
| ---------------- | ----------------- | ------------ |
| `VITE_APP_TITLE` | Application title | `WriteSpace` |

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).

### Build

Create a production build:

```bash
npm run build
```

The output is written to the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run the test suite:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Deployment

### Vercel

The project includes a `vercel.json` configuration with SPA rewrite rules for client-side routing.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/new).
3. Vercel auto-detects the Vite framework. The default settings work out of the box:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy.

All routes are rewritten to `index.html` so that React Router handles navigation on the client.

## Route Map

| Path               | Component            | Access       | Description                  |
| ------------------ | -------------------- | ------------ | ---------------------------- |
| `/`                | HomePage             | Public       | Landing page                 |
| `/login`           | LoginPage            | Guest only   | Sign in form                 |
| `/register`        | RegisterPage         | Guest only   | Registration form            |
| `/blogs`           | BlogListPage         | Authenticated | All posts grid              |
| `/blogs/create`    | WriteBlogPage        | Authenticated | Create a new post           |
| `/blogs/:id`       | ReadBlogPage         | Authenticated | Read a single post          |
| `/blogs/edit/:id`  | WriteBlogPage        | Authenticated | Edit an existing post       |
| `/dashboard`       | AdminDashboardPage   | Admin only   | Statistics and recent posts  |
| `/dashboard/users` | UserManagementPage   | Admin only   | Create and manage users      |

## Roles

### Admin

- Full access to all routes including the admin dashboard and user management.
- Can create, edit, and delete any blog post.
- Can create and delete users (except the hard-coded admin account and themselves).
- Default admin credentials: **username** `admin` / **password** `admin123`.

### Viewer

- Access to blog list, create, read, edit, and delete their own posts.
- Cannot access the admin dashboard or user management pages.
- Registered via the public registration form.

## localStorage Keys

| Key           | Description                          |
| ------------- | ------------------------------------ |
| `posts`       | Array of all blog posts              |
| `users`       | Array of registered users            |
| `currentUser` | Currently authenticated user session |

## License

This project is proprietary and confidential. All rights reserved. No part of this software may be reproduced, distributed, or transmitted in any form without prior written permission.