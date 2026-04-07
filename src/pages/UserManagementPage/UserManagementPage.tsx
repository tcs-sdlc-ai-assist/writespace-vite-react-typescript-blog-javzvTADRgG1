import { useState, useMemo, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUsers, saveUsers } from '../../services/storage.service';
import { Avatar } from '../../components/Avatar/Avatar';
import { RoleBadge } from '../../components/RoleBadge/RoleBadge';
import { formatDate } from '../../utils/formatDate';
import type { User, UserRole, CreateUserForm } from '../../types';

const HARD_CODED_ADMIN_ID = 'admin-001';

interface FieldErrors {
  displayName?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>('viewer');
  const [error, setError] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const allUsers = useMemo(() => {
    const hardCodedAdmin: User = {
      id: HARD_CODED_ADMIN_ID,
      displayName: 'Administrator',
      username: 'admin',
      password: '',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
    };
    return [hardCodedAdmin, ...users];
  }, [users]);

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

    if (role !== 'admin' && role !== 'viewer') {
      newErrors.role = 'Role must be admin or viewer.';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [displayName, username, password, confirmPassword, role]);

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

  const handleRoleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as UserRole);
    setError('');
    setFieldErrors((prev) => ({ ...prev, role: undefined }));
  }, []);

  const handleCreateUser = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      const trimmedUsername = username.trim();

      if (trimmedUsername === 'admin') {
        setError('Username already exists.');
        return;
      }

      const currentUsers = getUsers();
      const existingUser = currentUsers.find((u) => u.username === trimmedUsername);

      if (existingUser) {
        setError('Username already exists.');
        return;
      }

      const _form: CreateUserForm = {
        displayName: displayName.trim(),
        username: trimmedUsername,
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
        role,
      };

      const newUser: User = {
        id: crypto.randomUUID(),
        displayName: _form.displayName,
        username: _form.username,
        password: _form.password,
        role: _form.role,
        createdAt: new Date().toISOString(),
      };

      currentUsers.push(newUser);
      saveUsers(currentUsers);
      setUsers(currentUsers);

      setDisplayName('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('viewer');
      setError('');
      setFieldErrors({});
    },
    [displayName, username, password, confirmPassword, role, validate],
  );

  const handleDeleteUser = useCallback(
    (userId: string) => {
      if (userId === HARD_CODED_ADMIN_ID) {
        return;
      }

      if (currentUser && userId === currentUser.id) {
        return;
      }

      const userToDelete = allUsers.find((u) => u.id === userId);
      if (!userToDelete) {
        return;
      }

      const confirmed = window.confirm(
        `Are you sure you want to delete user "${userToDelete.displayName}"?`,
      );
      if (!confirmed) {
        return;
      }

      const currentUsers = getUsers();
      const filtered = currentUsers.filter((u) => u.id !== userId);
      saveUsers(filtered);
      setUsers(filtered);
    },
    [currentUser, allUsers],
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

  const handleFocus = (hasError: boolean) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = hasError
      ? 'var(--color-error)'
      : 'var(--color-border-focus)';
    e.currentTarget.style.boxShadow = hasError
      ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
      : '0 0 0 3px rgba(79, 70, 229, 0.1)';
  };

  const handleBlur = (hasError: boolean) => (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = hasError
      ? 'var(--color-error)'
      : 'var(--color-border)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--header-height))',
        backgroundColor: 'var(--color-bg-secondary)',
      }}
    >
      {/* Banner */}
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
            User Management
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: 'var(--line-height-relaxed)',
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            Manage users, assign roles, and control access to the platform.
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
        {/* Create User Form */}
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
            Create New User
          </h2>
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
                height: '4px',
                width: '100%',
                background: 'var(--gradient-primary)',
              }}
            />
            <div
              style={{
                padding: 'var(--spacing-xl)',
              }}
            >
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
                    marginBottom: 'var(--spacing-lg)',
                  }}
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={handleCreateUser}
                noValidate
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
                    htmlFor="create-displayName"
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
                    id="create-displayName"
                    type="text"
                    value={displayName}
                    onChange={handleDisplayNameChange}
                    placeholder="Enter display name"
                    autoComplete="off"
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
                    htmlFor="create-username"
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
                    id="create-username"
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Choose a username"
                    autoComplete="off"
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
                    htmlFor="create-password"
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
                    id="create-password"
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
                    htmlFor="create-confirmPassword"
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
                    id="create-confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm password"
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

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-xs)',
                  }}
                >
                  <label
                    htmlFor="create-role"
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text)',
                      lineHeight: 'var(--line-height-normal)',
                    }}
                  >
                    Role
                  </label>
                  <select
                    id="create-role"
                    value={role}
                    onChange={handleRoleChange}
                    style={{
                      ...inputStyle(!!fieldErrors.role),
                      cursor: 'pointer',
                      appearance: 'auto',
                    }}
                    onFocus={handleFocus(!!fieldErrors.role)}
                    onBlur={handleBlur(!!fieldErrors.role)}
                  >
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                  {fieldErrors.role && (
                    <span
                      role="alert"
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-error)',
                        lineHeight: 'var(--line-height-normal)',
                      }}
                    >
                      {fieldErrors.role}
                    </span>
                  )}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                  }}
                >
                  <button
                    type="submit"
                    style={{
                      width: '100%',
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
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Users Table */}
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
            All Users ({allUsers.length})
          </h2>

          {allUsers.length > 0 ? (
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
                        User
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
                        Username
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
                        Role
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
                        Created
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
                    {allUsers.map((u) => {
                      const isHardCodedAdmin = u.id === HARD_CODED_ADMIN_ID;
                      const isSelf = currentUser !== null && u.id === currentUser.id;
                      const canDelete = !isHardCodedAdmin && !isSelf;

                      return (
                        <tr
                          key={u.id}
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
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                              }}
                            >
                              <Avatar role={u.role} size={32} />
                              <span
                                style={{
                                  fontSize: 'var(--font-size-sm)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: 'var(--color-text)',
                                  lineHeight: 'var(--line-height-normal)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '200px',
                                }}
                              >
                                {u.displayName}
                              </span>
                            </div>
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
                            {u.username}
                          </td>
                          <td
                            style={{
                              padding: 'var(--spacing-md) var(--spacing-lg)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <RoleBadge role={u.role} />
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
                            {formatDate(u.createdAt)}
                          </td>
                          <td
                            style={{
                              padding: 'var(--spacing-md) var(--spacing-lg)',
                              textAlign: 'right',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={!canDelete}
                              aria-label={`Delete ${u.displayName}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--font-size-sm)',
                                lineHeight: 1,
                                cursor: canDelete ? 'pointer' : 'not-allowed',
                                border: 'none',
                                background: 'none',
                                opacity: canDelete ? 1 : 0.35,
                                transition: 'background-color 150ms ease, transform 150ms ease',
                              }}
                              onMouseEnter={(e) => {
                                if (canDelete) {
                                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                                  e.currentTarget.style.transform = 'scale(1.1)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (canDelete) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.transform = 'scale(1)';
                                }
                              }}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
                👥
              </span>
              <h3
                style={{
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text)',
                  marginBottom: 'var(--spacing-sm)',
                }}
              >
                No users yet
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--line-height-relaxed)',
                }}
              >
                Create the first user using the form above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}