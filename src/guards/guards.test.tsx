import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { GuestRoute } from './GuestRoute';
import type { AuthContextType, CurrentUser } from '../types';

const mockAuthValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockAuthValue,
}));

function setAuth(overrides: Partial<AuthContextType>) {
  Object.assign(mockAuthValue, {
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  });
}

const viewerUser: CurrentUser = {
  id: 'user-001',
  displayName: 'Test Viewer',
  username: 'viewer',
  role: 'viewer',
  createdAt: '2024-06-15T10:00:00.000Z',
};

const adminUser: CurrentUser = {
  id: 'admin-001',
  displayName: 'Administrator',
  username: 'admin',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

describe('PrivateRoute', () => {
  beforeEach(() => {
    setAuth({});
  });

  it('renders child route when user is authenticated', () => {
    setAuth({ user: viewerUser, isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to /login', () => {
    setAuth({ user: null, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders child route when admin user is authenticated', () => {
    setAuth({ user: adminUser, isAuthenticated: true, isAdmin: true });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  beforeEach(() => {
    setAuth({});
  });

  it('renders child route when user is an admin', () => {
    setAuth({ user: adminUser, isAuthenticated: true, isAdmin: true });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<div>Admin Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/blogs" element={<div>Blogs Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to /login', () => {
    setAuth({ user: null, isAuthenticated: false, isAdmin: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<div>Admin Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/blogs" element={<div>Blogs Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
  });

  it('redirects non-admin authenticated users to /blogs', () => {
    setAuth({ user: viewerUser, isAuthenticated: true, isAdmin: false });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<div>Admin Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/blogs" element={<div>Blogs Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });
});

describe('GuestRoute', () => {
  beforeEach(() => {
    setAuth({});
  });

  it('renders child route when user is not authenticated', () => {
    setAuth({ user: null, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });

  it('redirects authenticated users to /', () => {
    setAuth({ user: viewerUser, isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects authenticated admin users to /', () => {
    setAuth({ user: adminUser, isAuthenticated: true, isAdmin: true });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<div>Login Page</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('renders register route when user is not authenticated', () => {
    setAuth({ user: null, isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/register" element={<div>Register Page</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Register Page')).toBeInTheDocument();
    expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
  });

  it('redirects authenticated users away from register to /', () => {
    setAuth({ user: viewerUser, isAuthenticated: true });

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/register" element={<div>Register Page</div>} />
          </Route>
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Register Page')).not.toBeInTheDocument();
  });
});