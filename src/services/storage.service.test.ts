import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUsers,
  saveUsers,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from './storage.service';
import type { Post, User, CurrentUser } from '../types';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string): string | null => store[key] ?? null),
    setItem: vi.fn((key: string, value: string): void => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string): void => {
      delete store[key];
    }),
    clear: vi.fn((): void => {
      store = {};
    }),
    get length(): number {
      return Object.keys(store).length;
    },
    key: vi.fn((_index: number): string | null => null),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

function createMockPost(overrides: Partial<Post> = {}): Post {
  return {
    id: 'post-001',
    title: 'Test Post',
    content: 'Test content for the post.',
    createdAt: '2024-06-15T10:00:00.000Z',
    authorId: 'user-001',
    authorName: 'Test User',
    ...overrides,
  };
}

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

function createMockCurrentUser(overrides: Partial<CurrentUser> = {}): CurrentUser {
  return {
    id: 'user-001',
    displayName: 'Test User',
    username: 'testuser',
    role: 'viewer',
    createdAt: '2024-06-15T10:00:00.000Z',
    ...overrides,
  };
}

describe('storage.service', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('posts');
    });

    it('returns parsed posts from localStorage', () => {
      const mockPosts: Post[] = [
        createMockPost({ id: 'post-001', title: 'First Post' }),
        createMockPost({ id: 'post-002', title: 'Second Post' }),
      ];
      mockLocalStorage.setItem('posts', JSON.stringify(mockPosts));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
      expect(posts).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupt JSON', () => {
      mockLocalStorage.setItem('posts', '{invalid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const posts = getPosts();
      expect(posts).toEqual([]);

      consoleSpy.mockRestore();
    });
  });

  describe('savePosts', () => {
    it('saves posts to localStorage as JSON', () => {
      const mockPosts: Post[] = [createMockPost()];
      savePosts(mockPosts);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('posts', JSON.stringify(mockPosts));
    });

    it('saves an empty array to localStorage', () => {
      savePosts([]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('posts', '[]');
    });
  });

  describe('getPostById', () => {
    it('returns the post when it exists', () => {
      const mockPost = createMockPost({ id: 'post-123' });
      mockLocalStorage.setItem('posts', JSON.stringify([mockPost]));

      const result = getPostById('post-123');
      expect(result).toEqual(mockPost);
    });

    it('returns null when the post does not exist', () => {
      const mockPost = createMockPost({ id: 'post-123' });
      mockLocalStorage.setItem('posts', JSON.stringify([mockPost]));

      const result = getPostById('nonexistent-id');
      expect(result).toBeNull();
    });

    it('returns null when no posts exist', () => {
      const result = getPostById('post-123');
      expect(result).toBeNull();
    });
  });

  describe('createPost', () => {
    it('adds a new post to an empty posts array', () => {
      const newPost = createMockPost({ id: 'new-post-001' });
      createPost(newPost);

      const stored = JSON.parse(mockLocalStorage.getItem('posts')!) as Post[];
      expect(stored).toHaveLength(1);
      expect(stored[0]).toEqual(newPost);
    });

    it('appends a new post to existing posts', () => {
      const existingPost = createMockPost({ id: 'existing-001' });
      mockLocalStorage.setItem('posts', JSON.stringify([existingPost]));

      const newPost = createMockPost({ id: 'new-001', title: 'New Post' });
      createPost(newPost);

      const stored = JSON.parse(mockLocalStorage.getItem('posts')!) as Post[];
      expect(stored).toHaveLength(2);
      expect(stored[0]).toEqual(existingPost);
      expect(stored[1]).toEqual(newPost);
    });
  });

  describe('updatePost', () => {
    it('updates an existing post and returns the updated post', () => {
      const post = createMockPost({ id: 'post-001', title: 'Original Title' });
      mockLocalStorage.setItem('posts', JSON.stringify([post]));

      const result = updatePost('post-001', { title: 'Updated Title' });

      expect(result).not.toBeNull();
      expect(result!.title).toBe('Updated Title');
      expect(result!.content).toBe(post.content);
      expect(result!.id).toBe('post-001');

      const stored = JSON.parse(mockLocalStorage.getItem('posts')!) as Post[];
      expect(stored[0].title).toBe('Updated Title');
    });

    it('updates only the specified fields', () => {
      const post = createMockPost({
        id: 'post-001',
        title: 'Original Title',
        content: 'Original Content',
      });
      mockLocalStorage.setItem('posts', JSON.stringify([post]));

      const result = updatePost('post-001', { content: 'Updated Content' });

      expect(result).not.toBeNull();
      expect(result!.title).toBe('Original Title');
      expect(result!.content).toBe('Updated Content');
    });

    it('returns null when the post does not exist', () => {
      const post = createMockPost({ id: 'post-001' });
      mockLocalStorage.setItem('posts', JSON.stringify([post]));

      const result = updatePost('nonexistent-id', { title: 'Updated' });
      expect(result).toBeNull();
    });

    it('returns null when no posts exist', () => {
      const result = updatePost('post-001', { title: 'Updated' });
      expect(result).toBeNull();
    });

    it('updates the correct post when multiple posts exist', () => {
      const posts: Post[] = [
        createMockPost({ id: 'post-001', title: 'First' }),
        createMockPost({ id: 'post-002', title: 'Second' }),
        createMockPost({ id: 'post-003', title: 'Third' }),
      ];
      mockLocalStorage.setItem('posts', JSON.stringify(posts));

      updatePost('post-002', { title: 'Updated Second' });

      const stored = JSON.parse(mockLocalStorage.getItem('posts')!) as Post[];
      expect(stored[0].title).toBe('First');
      expect(stored[1].title).toBe('Updated Second');
      expect(stored[2].title).toBe('Third');
    });
  });

  describe('deletePost', () => {
    it('deletes an existing post and returns true', () => {
      const posts: Post[] = [
        createMockPost({ id: 'post-001' }),
        createMockPost({ id: 'post-002' }),
      ];
      mockLocalStorage.setItem('posts', JSON.stringify(posts));

      const result = deletePost('post-001');
      expect(result).toBe(true);

      const stored = JSON.parse(mockLocalStorage.getItem('posts')!) as Post[];
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('post-002');
    });

    it('returns false when the post does not exist', () => {
      const posts: Post[] = [createMockPost({ id: 'post-001' })];
      mockLocalStorage.setItem('posts', JSON.stringify(posts));

      const result = deletePost('nonexistent-id');
      expect(result).toBe(false);

      const stored = JSON.parse(mockLocalStorage.getItem('posts')!) as Post[];
      expect(stored).toHaveLength(1);
    });

    it('returns false when no posts exist', () => {
      const result = deletePost('post-001');
      expect(result).toBe(false);
    });

    it('removes only the targeted post from multiple posts', () => {
      const posts: Post[] = [
        createMockPost({ id: 'post-001', title: 'First' }),
        createMockPost({ id: 'post-002', title: 'Second' }),
        createMockPost({ id: 'post-003', title: 'Third' }),
      ];
      mockLocalStorage.setItem('posts', JSON.stringify(posts));

      deletePost('post-002');

      const stored = JSON.parse(mockLocalStorage.getItem('posts')!) as Post[];
      expect(stored).toHaveLength(2);
      expect(stored[0].id).toBe('post-001');
      expect(stored[1].id).toBe('post-003');
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const users = getUsers();
      expect(users).toEqual([]);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('users');
    });

    it('returns parsed users from localStorage', () => {
      const mockUsers: User[] = [
        createMockUser({ id: 'user-001', username: 'alice' }),
        createMockUser({ id: 'user-002', username: 'bob' }),
      ];
      mockLocalStorage.setItem('users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toEqual(mockUsers);
      expect(users).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupt JSON', () => {
      mockLocalStorage.setItem('users', 'not valid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const users = getUsers();
      expect(users).toEqual([]);

      consoleSpy.mockRestore();
    });
  });

  describe('saveUsers', () => {
    it('saves users to localStorage as JSON', () => {
      const mockUsers: User[] = [createMockUser()];
      saveUsers(mockUsers);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('users', JSON.stringify(mockUsers));
    });

    it('saves an empty array to localStorage', () => {
      saveUsers([]);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('users', '[]');
    });
  });

  describe('getCurrentUser', () => {
    it('returns null when no current user is stored', () => {
      const user = getCurrentUser();
      expect(user).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('currentUser');
    });

    it('returns the parsed current user from localStorage', () => {
      const mockUser = createMockCurrentUser();
      mockLocalStorage.setItem('currentUser', JSON.stringify(mockUser));

      const user = getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it('returns null when localStorage contains corrupt JSON for currentUser', () => {
      mockLocalStorage.setItem('currentUser', '{{broken}}');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const user = getCurrentUser();
      expect(user).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('setCurrentUser', () => {
    it('saves the current user to localStorage as JSON', () => {
      const mockUser = createMockCurrentUser();
      setCurrentUser(mockUser);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'currentUser',
        JSON.stringify(mockUser),
      );
    });

    it('saves an admin user correctly', () => {
      const adminUser = createMockCurrentUser({
        id: 'admin-001',
        displayName: 'Administrator',
        username: 'admin',
        role: 'admin',
      });
      setCurrentUser(adminUser);

      const stored = JSON.parse(mockLocalStorage.getItem('currentUser')!) as CurrentUser;
      expect(stored.role).toBe('admin');
      expect(stored.username).toBe('admin');
    });
  });

  describe('clearCurrentUser', () => {
    it('removes the current user from localStorage', () => {
      const mockUser = createMockCurrentUser();
      mockLocalStorage.setItem('currentUser', JSON.stringify(mockUser));

      clearCurrentUser();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser');
      expect(mockLocalStorage.getItem('currentUser')).toBeNull();
    });

    it('does not throw when no current user exists', () => {
      expect(() => clearCurrentUser()).not.toThrow();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('JSON serialization round-trip', () => {
    it('preserves post data through save and retrieve cycle', () => {
      const originalPost = createMockPost({
        id: 'roundtrip-001',
        title: 'Round Trip Test',
        content: 'Content with special chars: <>&"\'',
        createdAt: '2024-12-25T00:00:00.000Z',
        authorId: 'author-001',
        authorName: 'Author Name',
      });

      createPost(originalPost);
      const retrieved = getPostById('roundtrip-001');

      expect(retrieved).toEqual(originalPost);
    });

    it('preserves user data through save and retrieve cycle', () => {
      const originalUsers: User[] = [
        createMockUser({
          id: 'roundtrip-user-001',
          displayName: 'Ünïcödé Üser',
          username: 'unicode_user',
          password: 'p@$$w0rd!',
          role: 'admin',
        }),
      ];

      saveUsers(originalUsers);
      const retrieved = getUsers();

      expect(retrieved).toEqual(originalUsers);
    });
  });
});