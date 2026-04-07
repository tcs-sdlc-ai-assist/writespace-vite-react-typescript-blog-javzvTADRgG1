import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../Avatar/Avatar';
import { RoleBadge } from '../RoleBadge/RoleBadge';
import styles from './NavBar.module.css';

export function NavBar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>✍️</span>
          <span className={styles.logoText}>WriteSpace</span>
        </Link>

        <div className={styles.links}>
          {isAuthenticated && user ? (
            <>
              <Link to="/blogs" className={styles.navLink}>
                Blogs
              </Link>
              {isAdmin && (
                <Link to="/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
              )}
              <div className={styles.userSection}>
                <Avatar role={user.role} size={32} />
                <span className={styles.displayName}>{user.displayName}</span>
                <RoleBadge role={user.role} />
                <button
                  type="button"
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/register" className={styles.registerLink}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
```

Wait, I need to also create the CSS module file. But the instructions say to generate only the specified file. Let me re-read... The task says to generate `src/components/NavBar/NavBar.tsx`. But it imports `./NavBar.module.css` which doesn't exist yet. This will cause a build error with CSS modules since Vite handles missing CSS module imports gracefully (it won't fail the build, it'll just have empty styles).

Actually, with Vite and CSS modules, importing a non-existent `.module.css` file WILL cause a build error. Let me reconsider - I should only output the file requested. But the CSS module import would break the build...

Looking at the existing codebase pattern, every component has a corresponding `.module.css` file. Since I can only generate the one file requested, I need to make the component work without the CSS module, OR include the CSS module import knowing Vite will fail.

The safest approach: use inline styles or utility classes from `index.css` instead of a CSS module, since I can only generate one file. But that breaks the existing pattern...

Let me re-read the instructions: "Generate the complete code for this file." - singular file. I'll use the CSS module import pattern to match the codebase, and use the styles object which will be empty if the CSS file doesn't exist yet. Actually in Vite, importing a non-existent file IS a build error.

I'll write it without the CSS module import, using inline styles to ensure it compiles:

```tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../Avatar/Avatar';
import { RoleBadge } from '../RoleBadge/RoleBadge';

const navStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 200,
  backgroundColor: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
};

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 'var(--container-max-width)',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 'var(--spacing-md)',
  paddingRight: 'var(--spacing-md)',
  height: 'var(--header-height)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-sm)',
  textDecoration: 'none',
  color: 'var(--color-text)',
  fontWeight: 700,
  fontSize: 'var(--font-size-xl)',
  letterSpacing: 'var(--letter-spacing-tight)',
};

const logoIconStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-2xl)',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
};

const linksStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-md)',
};

const navLinkStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  textDecoration: 'none',
  padding: 'var(--spacing-xs) var(--spacing-sm)',
  borderRadius: 'var(--radius-md)',
  transition: 'color 150ms ease, background-color 150ms ease',
};

const registerLinkStyle: React.CSSProperties = {
  ...navLinkStyle,
  color: 'var(--color-text-inverse)',
  background: 'var(--gradient-primary)',
  padding: 'var(--spacing-xs) var(--spacing-md)',
  borderRadius: 'var(--radius-lg)',
  fontWeight: 600,
};

const userSectionStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--spacing-sm)',
};

const displayNameStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 600,
  color: 'var(--color-text)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '120px',
};

const logoutButtonStyle: React.CSSProperties = {
  fontSize: 'var(--font-size-sm)',
  fontWeight: 600,
  color: 'var(--color-error)',
  background: 'none',
  border: '1px solid var(--color-error)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--spacing-xs) var(--spacing-md)',
  cursor: 'pointer',
  transition: 'background-color 150ms ease, color 150ms ease',
};

export function NavBar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>
          <span style={logoIconStyle}>✍️</span>
          <span>WriteSpace</span>
        </Link>

        <div style={linksStyle}>
          {isAuthenticated && user ? (
            <>
              <Link to="/blogs" style={navLinkStyle}>
                Blogs
              </Link>
              {isAdmin && (
                <Link to="/dashboard" style={navLinkStyle}>
                  Dashboard
                </Link>
              )}
              <div style={userSectionStyle}>
                <Avatar role={user.role} size={32} />
                <span style={displayNameStyle}>{user.displayName}</span>
                <RoleBadge role={user.role} />
                <button
                  type="button"
                  style={logoutButtonStyle}
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={navLinkStyle}>
                Login
              </Link>
              <Link to="/register" style={registerLinkStyle}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}