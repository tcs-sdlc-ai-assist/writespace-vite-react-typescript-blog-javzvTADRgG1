import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NavBar } from './components/NavBar/NavBar';
import { GuestRoute } from './guards/GuestRoute';
import { PrivateRoute } from './guards/PrivateRoute';
import { AdminRoute } from './guards/AdminRoute';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const BlogListPage = lazy(() => import('./pages/BlogListPage/BlogListPage'));
const WriteBlogPage = lazy(() => import('./pages/WriteBlogPage/WriteBlogPage'));
const ReadBlogPage = lazy(() => import('./pages/ReadBlogPage/ReadBlogPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage/AdminDashboardPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage/UserManagementPage'));

function Layout() {
  return (
    <>
      <NavBar />
      <Suspense
        fallback={
          <div
            style={{
              minHeight: 'calc(100vh - var(--header-height))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-bg-secondary)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Loading...
            </p>
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public route */}
            <Route path="/" element={<HomePage />} />

            {/* Guest-only routes */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Private routes (authenticated users) */}
            <Route element={<PrivateRoute />}>
              <Route path="/blogs" element={<BlogListPage />} />
              <Route path="/blogs/create" element={<WriteBlogPage />} />
              <Route path="/blogs/:id" element={<ReadBlogPage />} />
              <Route path="/blogs/edit/:id" element={<WriteBlogPage />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard" element={<AdminDashboardPage />} />
              <Route path="/dashboard/users" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}