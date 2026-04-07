import type { Post, User, CurrentUser } from '../types';

const STORAGE_KEYS = {
  POSTS: 'posts',
  USERS: 'users',
  CURRENT_USER: 'currentUser',
} as const;

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (value === null) {
    return fallback;
  }
  try {
    return JSON.parse(value) as T;
  } catch {
    console.error('Failed to parse JSON from localStorage');
    return fallback;
  }
}

export function getPosts(): Post[] {
  const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
  return safeJsonParse<Post[]>(raw, []);
}

export function savePosts(posts: Post[]): void {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

export function getPostById(id: string): Post | null {
  const posts = getPosts();
  return posts.find((post) => post.id === id) ?? null;
}

export function createPost(post: Post): void {
  const posts = getPosts();
  posts.push(post);
  savePosts(posts);
}

export function updatePost(id: string, updates: Partial<Omit<Post, 'id'>>): Post | null {
  const posts = getPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return null;
  }
  const updatedPost: Post = { ...posts[index], ...updates };
  posts[index] = updatedPost;
  savePosts(posts);
  return updatedPost;
}

export function deletePost(id: string): boolean {
  const posts = getPosts();
  const filtered = posts.filter((post) => post.id !== id);
  if (filtered.length === posts.length) {
    return false;
  }
  savePosts(filtered);
  return true;
}

export function getUsers(): User[] {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return safeJsonParse<User[]>(raw, []);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser(): CurrentUser | null {
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return safeJsonParse<CurrentUser | null>(raw, null);
}

export function setCurrentUser(user: CurrentUser): void {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}