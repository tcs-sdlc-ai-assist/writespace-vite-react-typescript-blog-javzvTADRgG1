import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPosts, deletePost } from '../../services/storage.service';
import { PostCard } from '../../components/PostCard/PostCard';
import type { Post } from '../../types';

export default function BlogListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>(() => getPosts());

  const sortedPosts = useMemo((): Post[] => {
    return [...posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [posts]);

  const handleEdit = useCallback(
    (postId: string) => {
      navigate(`/blogs/edit/${postId}`);
    },
    [navigate],
  );

  const handleDelete = useCallback(
    (postId: string) => {
      const post = posts.find((p) => p.id === postId);
      if (!post) {
        return;
      }

      const confirmed = window.confirm(`Are you sure you want to delete "${post.title}"?`);
      if (!confirmed) {
        return;
      }

      const success = deletePost(postId);
      if (success) {
        setPosts(getPosts());
      }
    },
    [posts],
  );

  const handleCreatePost = useCallback(() => {
    navigate('/blogs/create');
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--color-bg-secondary)',
        padding: 'var(--spacing-2xl) var(--spacing-md)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max-width)',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-2xl)',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text)',
                lineHeight: 'var(--line-height-tight)',
                letterSpacing: 'var(--letter-spacing-tight)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              Blog Posts
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'} published
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreatePost}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--spacing-sm) var(--spacing-xl)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-inverse)',
              background: 'var(--gradient-primary)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✍️ New Post
          </button>
        </div>

        {sortedPosts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'var(--spacing-xl)',
            }}
          >
            {sortedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                currentUser={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--spacing-3xl) var(--spacing-md)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-4xl)',
                display: 'block',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              📝
            </span>
            <h3
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              No posts yet
            </h3>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-relaxed)',
                marginBottom: 'var(--spacing-xl)',
              }}
            >
              Be the first to share your thoughts with the community!
            </p>
            <button
              type="button"
              onClick={handleCreatePost}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-inverse)',
                background: 'var(--gradient-primary)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                transition: 'opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Create Your First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}