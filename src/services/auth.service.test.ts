import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticate, register, getCurrentUser, logout } from './auth.service';
import type { LoginForm, RegisterForm, CurrentUser, User } from '../types';

vi.mock('./storage.service', () => {
  let usersStore: User[] = [];
  let currentUserStore: CurrentUser | null = null;

  return {
    getUsers: vi.fn(() => usersStore),
    saveUsers: vi.fn((users: User[]) => {
      usersStore = users;
    }),
    getCurrentUser: vi.fn(() => currentUserStore),
    setCurrentUser: vi.fn((user: CurrentUser) => {
      currentUserStore = user;
    }),
    clearCurrentUser: vi.fn(() => {
      currentUserStore = null;
    }),
    __resetStore: () => {
      usersStore = [];
      currentUserStore = null;
    },
    __setUsers: (users: User[]) => {
      usersStore = users;
    },
    __setCurrentUser: (user: CurrentUser | null) => {
      currentUserStore = user;
    },
    __getCurrentUser: () => currentUserStore,
  };
});

import * as storageService from './storage.service';

const mockStorage = storageService as unknown as typeof storageService & {
  __resetStore: () => void;
  __setUsers: (users: User[]) => void;
  __setCurrentUser: (user: CurrentUser | null) => void;
  __getCurrentUser: () => CurrentUser | null;
};

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-001',
    displayName: 'Test User',
    username: 'testuser',
    password: 'password123',
    role: 'viewer',
    createdAt: '2024-06-15T10:00:00.000Z',
    ...overrides,
  };
}

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage.__resetStore();
  });

  describe('authenticate', () => {
    it('authenticates the hard-coded admin with correct credentials', () => {
      const form: LoginForm = { username: 'admin', password: 'admin123' };

      const result = authenticate(form);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.id).toBe('admin-001');
      expect(result.user!.displayName).toBe('Administrator');
      expect(result.user!.username).toBe('admin');
      expect(result.user!.role).toBe('admin');
      expect(storageService.setCurrentUser).toHaveBeenCalledWith(result.user);
    });

    it('authenticates a valid localStorage user with correct credentials', () => {
      const mockUser = createMockUser({
        id: 'user-100',
        displayName: 'Alice',
        username: 'alice',
        password: 'alicepass',
        role: 'viewer',
      });
      mockStorage.__setUsers([mockUser]);

      const form: LoginForm = { username: 'alice', password: 'alicepass' };

      const result = authenticate(form);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.id).toBe('user-100');
      expect(result.user!.displayName).toBe('Alice');
      expect(result.user!.username).toBe('alice');
      expect(result.user!.role).toBe('viewer');
      expect(storageService.setCurrentUser).toHaveBeenCalledWith(result.user);
    });

    it('rejects login with incorrect password for admin', () => {
      const form: LoginForm = { username: 'admin', password: 'wrongpassword' };

      const result = authenticate(form);

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBe('Invalid username or password.');
    });

    it('rejects login with incorrect password for a localStorage user', () => {
      const mockUser = createMockUser({ username: 'bob', password: 'bobpass' });
      mockStorage.__setUsers([mockUser]);

      const form: LoginForm = { username: 'bob', password: 'wrongpass' };

      const result = authenticate(form);

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBe('Invalid username or password.');
    });

    it('rejects login with a non-existent username', () => {
      const form: LoginForm = { username: 'nonexistent', password: 'somepass' };

      const result = authenticate(form);

      expect(result.success).toBe(false);
      expect(result.user).toBeUndefined();
      expect(result.error).toBe('Invalid username or password.');
    });

    it('returns error when username is empty', () => {
      const form: LoginForm = { username: '', password: 'somepass' };

      const result = authenticate(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required.');
    });

    it('returns error when username is only whitespace', () => {
      const form: LoginForm = { username: '   ', password: 'somepass' };

      const result = authenticate(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required.');
    });

    it('returns error when password is empty', () => {
      const form: LoginForm = { username: 'admin', password: '' };

      const result = authenticate(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is required.');
    });

    it('returns error when password is only whitespace', () => {
      const form: LoginForm = { username: 'admin', password: '   ' };

      const result = authenticate(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is required.');
    });

    it('trims username and password before matching', () => {
      const form: LoginForm = { username: '  admin  ', password: '  admin123  ' };

      const result = authenticate(form);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.username).toBe('admin');
    });

    it('authenticates a localStorage admin user correctly', () => {
      const adminUser = createMockUser({
        id: 'user-admin-002',
        displayName: 'Second Admin',
        username: 'admin2',
        password: 'admin2pass',
        role: 'admin',
      });
      mockStorage.__setUsers([adminUser]);

      const form: LoginForm = { username: 'admin2', password: 'admin2pass' };

      const result = authenticate(form);

      expect(result.success).toBe(true);
      expect(result.user!.role).toBe('admin');
      expect(result.user!.id).toBe('user-admin-002');
    });

    it('does not include password in the returned CurrentUser', () => {
      const mockUser = createMockUser({
        username: 'charlie',
        password: 'charliepass',
      });
      mockStorage.__setUsers([mockUser]);

      const form: LoginForm = { username: 'charlie', password: 'charliepass' };

      const result = authenticate(form);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect((result.user as Record<string, unknown>)['password']).toBeUndefined();
    });
  });

  describe('register', () => {
    it('registers a new user successfully', () => {
      const form: RegisterForm = {
        displayName: 'New User',
        username: 'newuser',
        password: 'newpass123',
        confirmPassword: 'newpass123',
      };

      const result = register(form);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user!.displayName).toBe('New User');
      expect(result.user!.username).toBe('newuser');
      expect(result.user!.role).toBe('viewer');
      expect(result.user!.id).toBeDefined();
      expect(result.user!.createdAt).toBeDefined();
      expect(storageService.saveUsers).toHaveBeenCalled();
      expect(storageService.setCurrentUser).toHaveBeenCalledWith(result.user);
    });

    it('rejects registration with the admin username', () => {
      const form: RegisterForm = {
        displayName: 'Fake Admin',
        username: 'admin',
        password: 'somepass',
        confirmPassword: 'somepass',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists.');
    });

    it('rejects registration with a duplicate username', () => {
      const existingUser = createMockUser({ username: 'existinguser' });
      mockStorage.__setUsers([existingUser]);

      const form: RegisterForm = {
        displayName: 'Another User',
        username: 'existinguser',
        password: 'somepass',
        confirmPassword: 'somepass',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists.');
    });

    it('returns error when display name is empty', () => {
      const form: RegisterForm = {
        displayName: '',
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name is required.');
    });

    it('returns error when display name is only whitespace', () => {
      const form: RegisterForm = {
        displayName: '   ',
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name is required.');
    });

    it('returns error when display name is too short', () => {
      const form: RegisterForm = {
        displayName: 'A',
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name must be between 2 and 32 characters.');
    });

    it('returns error when display name is too long', () => {
      const form: RegisterForm = {
        displayName: 'A'.repeat(33),
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name must be between 2 and 32 characters.');
    });

    it('returns error when username is empty', () => {
      const form: RegisterForm = {
        displayName: 'Valid Name',
        username: '',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required.');
    });

    it('returns error when username is only whitespace', () => {
      const form: RegisterForm = {
        displayName: 'Valid Name',
        username: '   ',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is required.');
    });

    it('returns error when password is empty', () => {
      const form: RegisterForm = {
        displayName: 'Valid Name',
        username: 'newuser',
        password: '',
        confirmPassword: '',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is required.');
    });

    it('returns error when password is only whitespace', () => {
      const form: RegisterForm = {
        displayName: 'Valid Name',
        username: 'newuser',
        password: '   ',
        confirmPassword: '   ',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password is required.');
    });

    it('returns error when confirmPassword is empty', () => {
      const form: RegisterForm = {
        displayName: 'Valid Name',
        username: 'newuser',
        password: 'pass123',
        confirmPassword: '',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Please confirm your password.');
    });

    it('returns error when passwords do not match', () => {
      const form: RegisterForm = {
        displayName: 'Valid Name',
        username: 'newuser',
        password: 'pass123',
        confirmPassword: 'differentpass',
      };

      const result = register(form);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Passwords do not match.');
    });

    it('trims display name and username before saving', () => {
      const form: RegisterForm = {
        displayName: '  Trimmed Name  ',
        username: '  trimmeduser  ',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(true);
      expect(result.user!.displayName).toBe('Trimmed Name');
      expect(result.user!.username).toBe('trimmeduser');
    });

    it('assigns viewer role to newly registered users', () => {
      const form: RegisterForm = {
        displayName: 'New Viewer',
        username: 'newviewer',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      const result = register(form);

      expect(result.success).toBe(true);
      expect(result.user!.role).toBe('viewer');
    });

    it('does not include password in the returned CurrentUser', () => {
      const form: RegisterForm = {
        displayName: 'No Password',
        username: 'nopassuser',
        password: 'secret123',
        confirmPassword: 'secret123',
      };

      const result = register(form);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect((result.user as Record<string, unknown>)['password']).toBeUndefined();
    });

    it('adds the new user to the existing users list', () => {
      const existingUser = createMockUser({ id: 'existing-001', username: 'existing' });
      mockStorage.__setUsers([existingUser]);

      const form: RegisterForm = {
        displayName: 'Second User',
        username: 'seconduser',
        password: 'pass123',
        confirmPassword: 'pass123',
      };

      register(form);

      const saveUsersCall = vi.mocked(storageService.saveUsers).mock.calls[0][0];
      expect(saveUsersCall).toHaveLength(2);
      expect(saveUsersCall[0].username).toBe('existing');
      expect(saveUsersCall[1].username).toBe('seconduser');
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no user is stored', () => {
      const user = getCurrentUser();
      expect(user).toBeNull();
      expect(storageService.getCurrentUser).toHaveBeenCalled();
    });

    it('returns the stored current user', () => {
      const mockCurrentUser: CurrentUser = {
        id: 'user-001',
        displayName: 'Stored User',
        username: 'storeduser',
        role: 'viewer',
        createdAt: '2024-06-15T10:00:00.000Z',
      };
      mockStorage.__setCurrentUser(mockCurrentUser);

      const user = getCurrentUser();

      expect(user).toEqual(mockCurrentUser);
    });
  });

  describe('logout', () => {
    it('clears the current user from storage', () => {
      const mockCurrentUser: CurrentUser = {
        id: 'user-001',
        displayName: 'Logged In User',
        username: 'loggedin',
        role: 'viewer',
        createdAt: '2024-06-15T10:00:00.000Z',
      };
      mockStorage.__setCurrentUser(mockCurrentUser);

      logout();

      expect(storageService.clearCurrentUser).toHaveBeenCalled();
      expect(mockStorage.__getCurrentUser()).toBeNull();
    });

    it('does not throw when no user is logged in', () => {
      expect(() => logout()).not.toThrow();
      expect(storageService.clearCurrentUser).toHaveBeenCalled();
    });
  });
});