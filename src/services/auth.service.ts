import type { LoginForm, RegisterForm, CurrentUser, User } from '../types';
import {
  getUsers,
  saveUsers,
  getCurrentUser as getStoredCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from './storage.service';

interface AuthResult {
  success: boolean;
  user?: CurrentUser;
  error?: string;
}

interface RegisterResult {
  success: boolean;
  user?: CurrentUser;
  error?: string;
}

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
} as const;

const HARD_CODED_ADMIN: CurrentUser = {
  id: 'admin-001',
  displayName: 'Administrator',
  username: 'admin',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

export function authenticate(form: LoginForm): AuthResult {
  const { username, password } = form;

  if (!username || !username.trim()) {
    return { success: false, error: 'Username is required.' };
  }

  if (!password || !password.trim()) {
    return { success: false, error: 'Password is required.' };
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (
    trimmedUsername === ADMIN_CREDENTIALS.username &&
    trimmedPassword === ADMIN_CREDENTIALS.password
  ) {
    setCurrentUser(HARD_CODED_ADMIN);
    return { success: true, user: HARD_CODED_ADMIN };
  }

  const users = getUsers();
  const matchedUser = users.find(
    (u) => u.username === trimmedUsername && u.password === trimmedPassword,
  );

  if (!matchedUser) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const currentUser: CurrentUser = {
    id: matchedUser.id,
    displayName: matchedUser.displayName,
    username: matchedUser.username,
    role: matchedUser.role,
    createdAt: matchedUser.createdAt,
  };

  setCurrentUser(currentUser);
  return { success: true, user: currentUser };
}

export function register(form: RegisterForm): RegisterResult {
  const { displayName, username, password, confirmPassword } = form;

  if (!displayName || !displayName.trim()) {
    return { success: false, error: 'Display name is required.' };
  }

  const trimmedDisplayName = displayName.trim();

  if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 32) {
    return { success: false, error: 'Display name must be between 2 and 32 characters.' };
  }

  if (!username || !username.trim()) {
    return { success: false, error: 'Username is required.' };
  }

  const trimmedUsername = username.trim();

  if (!password || !password.trim()) {
    return { success: false, error: 'Password is required.' };
  }

  if (!confirmPassword || !confirmPassword.trim()) {
    return { success: false, error: 'Please confirm your password.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  if (trimmedUsername === ADMIN_CREDENTIALS.username) {
    return { success: false, error: 'Username already exists.' };
  }

  const users = getUsers();
  const existingUser = users.find((u) => u.username === trimmedUsername);

  if (existingUser) {
    return { success: false, error: 'Username already exists.' };
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    displayName: trimmedDisplayName,
    username: trimmedUsername,
    password: password.trim(),
    role: 'viewer',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const currentUser: CurrentUser = {
    id: newUser.id,
    displayName: newUser.displayName,
    username: newUser.username,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };

  setCurrentUser(currentUser);
  return { success: true, user: currentUser };
}

export function getCurrentUser(): CurrentUser | null {
  return getStoredCurrentUser();
}

export function logout(): void {
  clearCurrentUser();
}