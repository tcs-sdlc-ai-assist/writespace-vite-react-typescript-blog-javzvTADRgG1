# Deployment Guide

This document covers deploying WriteSpace to [Vercel](https://vercel.com/) as a static single-page application (SPA).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Vercel Configuration](#vercel-configuration)
- [Environment Variables](#environment-variables)
- [Build Configuration](#build-configuration)
- [Deploying to Vercel](#deploying-to-vercel)
  - [GitHub Integration (Auto-Deploy)](#github-integration-auto-deploy)
  - [Manual Deployment via CLI](#manual-deployment-via-cli)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm 9 or later
- A [Vercel](https://vercel.com/) account
- Repository hosted on GitHub, GitLab, or Bitbucket

## Vercel Configuration

The project includes a `vercel.json` file at the repository root that configures SPA rewrites for client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This catch-all rewrite ensures that all routes (e.g., `/blogs`, `/dashboard`, `/blogs/edit/abc-123`) are served by `index.html`, allowing React Router to handle navigation on the client side.

> **Important:** Without this rewrite rule, navigating directly to any route other than `/` (or refreshing the page on a nested route) would return a 404 error from the server.

## Environment Variables

| Variable         | Description       | Default      | Required |
| ---------------- | ----------------- | ------------ | -------- |
| `VITE_APP_TITLE` | Application title | `WriteSpace` | No       |

### Setting Environment Variables on Vercel

1. Open your project in the [Vercel Dashboard](https://vercel.com/dashboard).
2. Navigate to **Settings** → **Environment Variables**.
3. Add each variable with the appropriate value.
4. Select the environments where the variable should be available (Production, Preview, Development).
5. Click **Save**.

> **Note:** All client-side environment variables must be prefixed with `VITE_` to be exposed by Vite during the build process. Variables without the `VITE_` prefix are only available at build time on the server and will not be bundled into the client code.

## Build Configuration

WriteSpace uses Vite as its build tool. The build settings are defined in `vite.config.ts`:

- **Build Command:** `npm run build`
  - This runs `tsc` (TypeScript compilation) followed by `vite build`.
- **Output Directory:** `dist/`
- **Source Maps:** Enabled for production builds.

To verify the build locally before deploying:

```bash
# Install dependencies
npm install

# Run the production build
npm run build

# Preview the production build locally
npm run preview
```

The preview server will start at [http://localhost:4173](http://localhost:4173).

## Deploying to Vercel

### GitHub Integration (Auto-Deploy)

This is the recommended approach for continuous deployment.

1. **Push your repository** to GitHub (or GitLab/Bitbucket).

2. **Import the project** in the [Vercel Dashboard](https://vercel.com/new):
   - Click **Add New…** → **Project**.
   - Select your Git provider and authorize Vercel if prompted.
   - Choose the WriteSpace repository from the list.

3. **Configure the project settings.** Vercel auto-detects the Vite framework. The default settings work out of the box:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add environment variables** if needed (see [Environment Variables](#environment-variables)).

5. **Click Deploy.** Vercel will build and deploy the application.

Once connected, Vercel will automatically:

- **Deploy to production** on every push to the `main` (or `master`) branch.
- **Create preview deployments** for every pull request, giving you a unique URL to test changes before merging.
- **Run the build command** (`npm run build`) and serve the `dist/` directory as a static site.

### Manual Deployment via CLI

If you prefer deploying from your local machine:

1. **Install the Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Log in to Vercel:**

   ```bash
   vercel login
   ```

3. **Deploy from the project root:**

   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```

4. Follow the prompts to link the project to your Vercel account. The CLI will detect the Vite framework and apply the correct build settings.

## SPA Rewrite Configuration

WriteSpace is a single-page application that uses [React Router v6](https://reactrouter.com/) for client-side routing. All route handling happens in the browser — the server only needs to serve `index.html` for every request.

### How It Works

1. A user navigates to `https://your-app.vercel.app/blogs/edit/abc-123`.
2. Vercel receives the request and matches it against the rewrite rule in `vercel.json`.
3. The `"source": "/(.*)"` pattern matches all paths.
4. Vercel serves `index.html` from the `dist/` directory (the `"destination"`).
5. The browser loads the JavaScript bundle, React Router reads the URL, and renders the correct page component (`WriteBlogPage`).

### Route Map

| Path               | Component            | Access       |
| ------------------ | -------------------- | ------------ |
| `/`                | HomePage             | Public       |
| `/login`           | LoginPage            | Guest only   |
| `/register`        | RegisterPage         | Guest only   |
| `/blogs`           | BlogListPage         | Authenticated |
| `/blogs/create`    | WriteBlogPage        | Authenticated |
| `/blogs/:id`       | ReadBlogPage         | Authenticated |
| `/blogs/edit/:id`  | WriteBlogPage        | Authenticated |
| `/dashboard`       | AdminDashboardPage   | Admin only   |
| `/dashboard/users` | UserManagementPage   | Admin only   |

All of these routes are handled entirely on the client side. The rewrite rule ensures the server never returns a 404 for any of them.

## Troubleshooting

### 404 Errors on Page Refresh or Direct Navigation

**Symptom:** Navigating directly to a route like `/blogs` or refreshing the page on `/dashboard` returns a 404 page.

**Cause:** The server does not have a file at `/blogs/index.html` or `/dashboard/index.html`. Without the SPA rewrite, the server looks for a matching static file and fails.

**Solution:** Ensure `vercel.json` exists at the repository root with the rewrite rule:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Redeploy after adding or modifying this file.

### Build Fails with TypeScript Errors

**Symptom:** The `npm run build` command fails with TypeScript compilation errors.

**Cause:** The build command runs `tsc` before `vite build`. TypeScript strict mode is enabled, so any type errors will block the build.

**Solution:**

1. Run `npm run build` locally to reproduce the error.
2. Fix all TypeScript errors reported by `tsc`.
3. Commit and push the fix. Vercel will automatically rebuild.

### Environment Variables Not Available at Runtime

**Symptom:** `import.meta.env.VITE_APP_TITLE` returns `undefined` in the deployed application.

**Cause:** Environment variables must be prefixed with `VITE_` to be included in the client bundle. Additionally, environment variables are embedded at **build time**, not runtime.

**Solution:**

1. Verify the variable name starts with `VITE_`.
2. Ensure the variable is set in the Vercel Dashboard under **Settings** → **Environment Variables**.
3. Trigger a new deployment after adding or changing environment variables (Vercel does not retroactively inject variables into existing builds).

### Blank Page After Deployment

**Symptom:** The deployed site shows a blank white page with no content.

**Cause:** This is typically caused by incorrect asset paths or a missing `index.html` in the output directory.

**Solution:**

1. Verify the **Output Directory** is set to `dist` in the Vercel project settings.
2. Run `npm run build` locally and inspect the `dist/` directory — it should contain `index.html` and an `assets/` folder with `.js` and `.css` files.
3. Open the browser developer console on the deployed site and check for 404 errors on script or stylesheet requests.
4. Ensure `base` in `vite.config.ts` is not set to a custom path (the default `/` is correct for Vercel).

### Preview Deployments Not Working

**Symptom:** Pull request preview deployments fail or show outdated content.

**Cause:** Vercel creates preview deployments from the pull request branch. If the branch has build errors or is missing dependencies, the preview will fail.

**Solution:**

1. Check the deployment logs in the Vercel Dashboard for the specific preview deployment.
2. Ensure the branch builds successfully locally with `npm run build`.
3. Verify that all dependencies are listed in `package.json` (Vercel runs `npm install` from scratch).

### Slow Initial Page Load

**Symptom:** The first page load takes noticeably longer than expected.

**Cause:** WriteSpace uses code splitting via `React.lazy()` for all page components. The initial bundle is small, but each page loads its own chunk on first navigation.

**Solution:** This is expected behavior and is actually an optimization — users only download the code they need. Subsequent navigations to the same page will be instant because the chunk is cached. No action is required unless the total bundle size is unusually large, in which case run:

```bash
npm run build
```

Vite will output a summary of chunk sizes. Review for any unexpectedly large chunks.