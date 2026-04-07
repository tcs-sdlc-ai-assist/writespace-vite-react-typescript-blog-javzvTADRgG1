import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPostById, createPost, updatePost } from '../../services/storage.service';
import { BlogForm } from '../../components/BlogForm/BlogForm';
import type { Post, PostForm } from '../../types';

export default function WriteBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEditing = Boolean(id);

  const [existingPost, setExistingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(isEditing);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isEditing || !id) {
      setLoading(false);
      return;
    }

    const post = getPostById(id);

    if (!post) {
      setError('Post not found.');
      setLoading(false);
      return;
    }

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const isAdmin = user.role === 'admin';
    const isOwner = user.id === post.authorId;

    if (!isAdmin && !isOwner) {
      navigate('/blogs', { replace: true });
      return;
    }

    setExistingPost(post);
    setLoading(false);
  }, [id, isEditing, user, navigate]);

  const handleSubmit = useCallback(
    (data: PostForm) => {
      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      if (isEditing && existingPost) {
        updatePost(existingPost.id, {
          title: data.title,
          content: data.content,
        });
      } else {
        const newPost: Post = {
          id: crypto.randomUUID(),
          title: data.title,
          content: data.content,
          createdAt: new Date().toISOString(),
          authorId: user.id,
          authorName: user.displayName,
        };
        createPost(newPost);
      }

      navigate('/blogs', { replace: true });
    },
    [user, isEditing, existingPost, navigate],
  );

  const handleCancel = useCallback(() => {
    navigate('/blogs');
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - var(--header-height))',
          backgroundColor: 'var(--color-bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-2xl) var(--spacing-md)',
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
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - var(--header-height))',
          backgroundColor: 'var(--color-bg-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-2xl) var(--spacing-md)',
          gap: 'var(--spacing-lg)',
        }}
      >
        <span
          style={{
            fontSize: 'var(--font-size-4xl)',
            display: 'block',
          }}
        >
          😕
        </span>
        <h2
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text)',
          }}
        >
          {error}
        </h2>
        <button
          type="button"
          onClick={handleCancel}
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
          Back to Blogs
        </button>
      </div>
    );
  }

  const initialData: PostForm | undefined = existingPost
    ? { title: existingPost.title, content: existingPost.content }
    : undefined;

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
          maxWidth: '720px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '4px',
              width: '100%',
              background: 'var(--gradient-primary)',
            }}
          />
          <div
            style={{
              padding: 'var(--spacing-2xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-xl)',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text)',
                  lineHeight: 'var(--line-height-tight)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </h1>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-normal)',
                }}
              >
                {isEditing
                  ? 'Update your blog post below.'
                  : 'Share your thoughts with the community.'}
              </p>
            </div>

            <BlogForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={isEditing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}