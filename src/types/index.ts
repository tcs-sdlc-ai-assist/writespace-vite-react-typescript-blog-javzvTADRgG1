export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  displayName: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export type CurrentUser = Omit<User, 'password'>;

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  displayName: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface PostForm {
  title: string;
  content: string;
}

export interface CreateUserForm {
  displayName: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface AvatarConfig {
  emoji: string;
  color: string;
}

export interface AuthContextType {
  user: CurrentUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: CurrentUser) => void;
  logout: () => void;
}