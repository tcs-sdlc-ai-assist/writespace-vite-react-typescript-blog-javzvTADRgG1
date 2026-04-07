import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPostById, deletePost } from '../../services/storage.service';
import { Avatar } from '../../components/Avatar/Avatar';
import { RoleBadge } from '../../components/RoleBadge/RoleBadge';
import { formatDate } from '../../utils/formatDate';
import type { Post } from '../../types';

export default function ReadBlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const foundPost = getPostById(id);

    if (!foundPost) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setPost(foundPost);
    setLoading(false);
  }, [id]);

  const isAdmin = user?.role === 'admin';
  const isOwner = user !== null && post !== null && user.id === post.authorId;
  const canEdit = isAdmin || isOwner;
  const canDelete = isAdmin || isOwner;

  const authorRole = post?.authorId === 'admin-001' ? ('admin' as const) : ('viewer' as const);

  const handleEdit = useCallback(() => {
    if (post) {
      navigate(`/blogs/edit/${post.id}`);
    }
  }, [post, navigate]);

  const handleDelete = useCallback(() => {
    if (!post) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete "${post.title}"?`);
    if (!confirmed) {
      return;
    }

    const success = deletePost(post.id);
    if (success) {
      navigate('/blogs', { replace: true });
    }
  }, [post, navigate]);

  const handleBack = useCallback(() => {
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

  if (notFound || !post) {
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
          Post not found
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--line-height-relaxed)',
          }}
        >
          The post you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button
          type="button"
          onClick={handleBack}
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

  const formattedDate = formatDate(post.createdAt);

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
            {/* Header with author info and actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--spacing-md)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  minWidth: 0,
                }}
              >
                <Avatar role={authorRole} size={40} />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-xs)',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text)',
                        lineHeight: 'var(--line-height-tight)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {post.authorName}
                    </span>
                    <RoleBadge role={authorRole} />
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-normal)',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 'var(--line-height-normal)',
                    }}
                  >
                    {formattedDate}
                  </span>
                </div>
              </div>

              {(canEdit || canDelete) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    flexShrink: 0,
                  }}
                >
                  {canEdit && (
                    <button
                      type="button"
                      onClick={handleEdit}
                      aria-label={`Edit ${post.title}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        lineHeight: 1,
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        transition: 'background-color 150ms ease, transform 150ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-50)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      ✏️
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      aria-label={`Delete ${post.title}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                        lineHeight: 1,
                        cursor: 'pointer',
                        border: 'none',
                        background: 'none',
                        transition: 'background-color 150ms ease, transform 150ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Post title */}
            <h1
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text)',
                lineHeight: 'var(--line-height-tight)',
                letterSpacing: 'var(--letter-spacing-tight)',
              }}
            >
              {post.title}
            </h1>

            {/* Post content */}
            <div
              style={{
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-normal)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-relaxed)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {post.content}
            </div>

            {/* Back button */}
            <div
              style={{
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-xl)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-bg-tertiary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                ← Back to Blogs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}