import { useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authenticate } from '../../services/auth.service';
import type { LoginForm } from '../../types';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});

  const validate = useCallback((): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [username, password]);

  const handleUsernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
    setFieldErrors((prev) => ({ ...prev, username: undefined }));
  }, []);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError('');
    setFieldErrors((prev) => ({ ...prev, password: undefined }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      const form: LoginForm = {
        username: username.trim(),
        password: password.trim(),
      };

      const result = authenticate(form);

      if (!result.success || !result.user) {
        setError(result.error ?? 'Login failed. Please try again.');
        return;
      }

      login(result.user);

      if (result.user.role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    },
    [username, password, validate, login, navigate],
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - var(--header-height))',
        padding: 'var(--spacing-xl) var(--spacing-md)',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
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
          <div style={{ textAlign: 'center' }}>
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
              Welcome Back
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              Sign in to your WriteSpace account
            </p>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--color-error)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xs)',
              }}
            >
              <label
                htmlFor="login-username"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text)',
                  lineHeight: 'var(--line-height-normal)',
                }}
              >
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Enter your username"
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface)',
                  border: `1px solid ${fieldErrors.username ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  outline: 'none',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = fieldErrors.username
                    ? 'var(--color-error)'
                    : 'var(--color-border-focus)';
                  e.currentTarget.style.boxShadow = fieldErrors.username
                    ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                    : '0 0 0 3px rgba(79, 70, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = fieldErrors.username
                    ? 'var(--color-error)'
                    : 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {fieldErrors.username && (
                <span
                  role="alert"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-error)',
                    lineHeight: 'var(--line-height-normal)',
                  }}
                >
                  {fieldErrors.username}
                </span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xs)',
              }}
            >
              <label
                htmlFor="login-password"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text)',
                  lineHeight: 'var(--line-height-normal)',
                }}
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-normal)',
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface)',
                  border: `1px solid ${fieldErrors.password ? 'var(--color-error)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  outline: 'none',
                  transition: 'border-color 150ms ease, box-shadow 150ms ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = fieldErrors.password
                    ? 'var(--color-error)'
                    : 'var(--color-border-focus)';
                  e.currentTarget.style.boxShadow = fieldErrors.password
                    ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                    : '0 0 0 3px rgba(79, 70, 229, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = fieldErrors.password
                    ? 'var(--color-error)'
                    : 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {fieldErrors.password && (
                <span
                  role="alert"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-error)',
                    lineHeight: 'var(--line-height-normal)',
                  }}
                >
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: 'var(--spacing-md) var(--spacing-xl)',
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
              Sign In
            </button>
          </form>

          <p
            style={{
              textAlign: 'center',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-normal)',
            }}
          >
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
              style={{
                color: 'var(--color-text-link)',
                fontWeight: 'var(--font-weight-semibold)',
                textDecoration: 'none',
              }}
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}