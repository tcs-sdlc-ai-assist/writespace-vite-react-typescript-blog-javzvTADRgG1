import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPosts } from '../../services/storage.service';
import { PostCard } from '../../components/PostCard/PostCard';
import type { Post } from '../../types';

const FEATURES = [
  {
    icon: '✍️',
    title: 'Write & Share',
    description: 'Create beautiful blog posts and share your thoughts with the world. Express yourself freely.',
    color: '#4f46e5',
  },
  {
    icon: '👥',
    title: 'Community',
    description: 'Join a growing community of writers and readers. Engage with content that matters to you.',
    color: '#7c3aed',
  },
  {
    icon: '🔒',
    title: 'Secure & Simple',
    description: 'Your content is safe with role-based access control. Simple interface, powerful features.',
    color: '#059669',
  },
] as const;

const MAX_LATEST_POSTS = 3;

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  const latestPosts = useMemo((): Post[] => {
    const allPosts = getPosts();
    return [...allPosts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, MAX_LATEST_POSTS);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'var(--gradient-hero)',
          padding: 'var(--spacing-3xl) var(--spacing-md)',
          textAlign: 'center',
          color: 'var(--color-text-inverse)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max-width)',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-5xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-text-inverse)',
            }}
          >
            Welcome to WriteSpace
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 'var(--line-height-relaxed)',
              color: 'rgba(255, 255, 255, 0.85)',
              maxWidth: '600px',
            }}
          >
            A modern blogging platform where ideas come to life. Write, share, and discover stories that inspire.
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 'var(--spacing-md)',
            }}
          >
            {!isAuthenticated && (
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--spacing-md) var(--spacing-2xl)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-primary)',
                  backgroundColor: 'var(--color-text-inverse)',
                  borderRadius: 'var(--radius-lg)',
                  textDecoration: 'none',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                Get Started
              </Link>
            )}
            <Link
              to="/blogs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-md) var(--spacing-2xl)',
                fontSize: 'var(--font-size-base)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-inverse)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: 'var(--radius-lg)',
                textDecoration: 'none',
                transition: 'background-color 150ms ease',
              }}
            >
              Browse Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-md)',
          backgroundColor: 'var(--color-bg-secondary)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max-width)',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-text)',
              marginBottom: 'var(--spacing-2xl)',
            }}
          >
            Why WriteSpace?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-xl)',
            }}
          >
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-md)',
                  padding: 'var(--spacing-xl)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 'var(--spacing-md)',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-lg)',
                    backgroundColor: `${feature.color}1a`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-2xl)',
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text)',
                    lineHeight: 'var(--line-height-tight)',
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--line-height-relaxed)',
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section
        style={{
          padding: 'var(--spacing-3xl) var(--spacing-md)',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max-width)',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--line-height-tight)',
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-text)',
              marginBottom: 'var(--spacing-2xl)',
            }}
          >
            Latest Posts
          </h2>
          {latestPosts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--spacing-xl)',
              }}
            >
              {latestPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  currentUser={user}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--spacing-3xl) var(--spacing-md)',
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
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
                }}
              >
                Be the first to share your thoughts with the community!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--color-text-inverse)',
          padding: 'var(--spacing-2xl) var(--spacing-md)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max-width)',
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: 'var(--letter-spacing-tight)',
            }}
          >
            <span>✍️</span>
            <span>WriteSpace</span>
          </div>
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xl)',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link
              to="/"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Home
            </Link>
            <Link
              to="/blogs"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Blogs
            </Link>
            <Link
              to="/login"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Register
            </Link>
          </nav>
          <p
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'rgba(255, 255, 255, 0.5)',
              lineHeight: 'var(--line-height-normal)',
            }}
          >
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}