import { useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../services/auth.service';
import type { RegisterForm } from '../../types';

interface FieldErrors {
  displayName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validate = useCallback((): boolean => {
    const newErrors: FieldErrors = {};

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedDisplayName) {
      newErrors.displayName = 'Display name is required.';
    } else if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 32) {
      newErrors.displayName = 'Display name must be between 2 and 32 characters.';
    }

    if (!trimmedUsername) {
      newErrors.username = 'Username is required.';
    }

    if (!trimmedPassword) {
      newErrors.password = 'Password is required.';
    }

    if (!trimmedConfirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (trimmedPassword !== trimmedConfirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [displayName, username, password, confirmPassword]);

  const handleDisplayNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
    setError('');
    setFieldErrors((prev) => ({ ...prev, displayName: undefined }));
  }, []);

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

  const handleConfirmPasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError('');
    setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      const form: RegisterForm = {
        displayName: displayName.trim(),
        username: username.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      };

      const result = register(form);

      if (!result.success || !result.user) {
        setError(result.error ?? 'Registration failed. Please try again.');
        return;
      }

      login(result.user);
      navigate('/blogs', { replace: true });
    },
    [displayName, username, password, confirmPassword, validate, login, navigate],
  );

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-normal)',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-surface)',
    border: `1px solid ${hasError ? 'var(--color-error)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-lg)',
    outline: 'none',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
  });

  const handleFocus = (hasError: boolean) => (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = hasError
      ? 'var(--color-error)'
      : 'var(--color-border-focus)';
    e.currentTarget.style.boxShadow = hasError
      ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
      : '0 0 0 3px rgba(79, 70, 229, 0.1)';
  };

  const handleBlur = (hasError: boolean) => (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = hasError
      ? 'var(--color-error)'
      : 'var(--color-border)';
    e.currentTarget.style.boxShadow = 'none';
  };

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
              Create Account
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              Join WriteSpace and start writing today
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
                htmlFor="register-displayName"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text)',
                  lineHeight: 'var(--line-height-normal)',
                }}
              >
                Display Name
              </label>
              <input
                id="register-displayName"
                type="text"
                value={displayName}
                onChange={handleDisplayNameChange}
                placeholder="Enter your display name"
                autoComplete="name"
                style={inputStyle(!!fieldErrors.displayName)}
                onFocus={handleFocus(!!fieldErrors.displayName)}
                onBlur={handleBlur(!!fieldErrors.displayName)}
              />
              {fieldErrors.displayName && (
                <span
                  role="alert"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-error)',
                    lineHeight: 'var(--line-height-normal)',
                  }}
                >
                  {fieldErrors.displayName}
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
                htmlFor="register-username"
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
                id="register-username"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Choose a username"
                autoComplete="username"
                style={inputStyle(!!fieldErrors.username)}
                onFocus={handleFocus(!!fieldErrors.username)}
                onBlur={handleBlur(!!fieldErrors.username)}
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
                htmlFor="register-password"
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
                id="register-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Create a password"
                autoComplete="new-password"
                style={inputStyle(!!fieldErrors.password)}
                onFocus={handleFocus(!!fieldErrors.password)}
                onBlur={handleBlur(!!fieldErrors.password)}
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

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-xs)',
              }}
            >
              <label
                htmlFor="register-confirmPassword"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text)',
                  lineHeight: 'var(--line-height-normal)',
                }}
              >
                Confirm Password
              </label>
              <input
                id="register-confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                style={inputStyle(!!fieldErrors.confirmPassword)}
                onFocus={handleFocus(!!fieldErrors.confirmPassword)}
                onBlur={handleBlur(!!fieldErrors.confirmPassword)}
              />
              {fieldErrors.confirmPassword && (
                <span
                  role="alert"
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-error)',
                    lineHeight: 'var(--line-height-normal)',
                  }}
                >
                  {fieldErrors.confirmPassword}
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
              Create Account
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
            Already have an account?{' '}
            <a
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
              style={{
                color: 'var(--color-text-link)',
                fontWeight: 'var(--font-weight-semibold)',
                textDecoration: 'none',
              }}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}