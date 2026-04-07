import type { UserRole } from '../../types';
import styles from './RoleBadge.module.css';

interface RoleBadgeProps {
  role: UserRole;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  viewer: 'Viewer',
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const label = ROLE_LABELS[role];

  return (
    <span className={`${styles.badge} ${styles[role]}`}>
      {label}
    </span>
  );
}