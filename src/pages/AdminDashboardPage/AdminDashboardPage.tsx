import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPosts, deletePost, getUsers } from '../../services/storage.service';
import { StatCard } from '../../components/StatCard/StatCard';
import { formatDate } from '../../utils/formatDate';
import { getExcerpt } from '../../utils/excerpt';
import type { Post, User } from '../../types';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>(() => getPosts());
  const users = useMemo<User[]>(() => getUsers(), []);

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminsCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const viewersCount = users.filter((u) => u.role === 'viewer').length;

  const recentPosts = useMemo((): Post[] => {
    return [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [posts]);

  const handleNewPost = useCallback(() => {
    navigate('/blogs/create');
  }, [navigate]);

  const handleManageUsers = useCallback(() => {
    navigate('/dashboard/users');
  }, [navigate]);

  const handleViewPost = useCallback(
    (postId: string) => {
      navigate(`/blogs/${postId}`);
    },
    [navigate],
  );

  const handleEditPost = useCallback(
    (postId: string) => {
      navigate(`/blogs/edit/${postId}`);
    },
    [navigate],
  );

  const handleDeletePost = useCallback(
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

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      {/* Gradient Banner Header */}
      <section
        style={{
          background: 'var(--gradient-hero)',
          padding: 'var(--spacing-2xl) var(--spacing-md)',
          color: 'var(--color-text-inverse)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max-width)',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-text-inverse)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Admin Dashboard
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 'var(--line-height-relaxed)',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            Welcome back, {user?.displayName ?? 'Admin'}. Here&apos;s an overview of your platform.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div
        style={{
          maxWidth: 'var(--container-max-width)',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 'var(--spacing-2xl) var(--spacing-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-2xl)',
        }}
      >
        {/* Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-xl)',
          }}
        >
          <StatCard title="Total Posts" value={totalPosts} icon="📝" color="#4f46e5" />
          <StatCard title="Total Users" value={totalUsers} icon="👥" color="#7c3aed" />
          <StatCard title="Admins" value={adminsCount} icon="👑" color="#059669" />
          <StatCard title="Viewers" value={viewersCount} icon="📖" color="#d97706" />
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text)',
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            Quick Actions
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={handleNewPost}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
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
            <button
              type="button"
              onClick={handleManageUsers}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)',
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
              👥 Manage Users
            </button>
          </div>
        </div>

        {/* Recent Posts Table */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text)',
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            Recent Posts
          </h2>

          {recentPosts.length > 0 ? (
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  overflowX: 'auto',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-tertiary)',
                      }}
                    >
                      <th
                        style={{
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          textAlign: 'left',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-secondary)',
                          textTransform: 'uppercase',
                          letterSpacing: 'var(--letter-spacing-wide)',
                          lineHeight: 'var(--line-height-normal)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Title
                      </th>
                      <th
                        style={{
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          textAlign: 'left',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-secondary)',
                          textTransform: 'uppercase',
                          letterSpacing: 'var(--letter-spacing-wide)',
                          lineHeight: 'var(--line-height-normal)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Author
                      </th>
                      <th
                        style={{
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          textAlign: 'left',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-secondary)',
                          textTransform: 'uppercase',
                          letterSpacing: 'var(--letter-spacing-wide)',
                          lineHeight: 'var(--line-height-normal)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          padding: 'var(--spacing-md) var(--spacing-lg)',
                          textAlign: 'right',
                          fontSize: 'var(--font-size-xs)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-secondary)',
                          textTransform: 'uppercase',
                          letterSpacing: 'var(--letter-spacing-wide)',
                          lineHeight: 'var(--line-height-normal)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPosts.map((post) => (
                      <tr
                        key={post.id}
                        style={{
                          borderBottom: '1px solid var(--color-border-light)',
                          transition: 'background-color 150ms ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-lg)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text)',
                            lineHeight: 'var(--line-height-normal)',
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={post.title}
                        >
                          {getExcerpt(post.title, 50)}
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-lg)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 'var(--line-height-normal)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {post.authorName}
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-lg)',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 'var(--font-weight-normal)',
                            color: 'var(--color-text-tertiary)',
                            lineHeight: 'var(--line-height-normal)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatDate(post.createdAt)}
                        </td>
                        <td
                          style={{
                            padding: 'var(--spacing-md) var(--spacing-lg)',
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 'var(--spacing-xs)',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleViewPost(post.id)}
                              aria-label={`View ${post.title}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
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
                              👁️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditPost(post.id)}
                              aria-label={`Edit ${post.title}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
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
                            <button
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              aria-label={`Delete ${post.title}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                Create the first post to get started!
              </p>
              <button
                type="button"
                onClick={handleNewPost}
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
    </div>
  );
}