import type { UserRole } from '../../types';
import { getAvatar } from '../../services/avatar.service';
import styles from './Avatar.module.css';

interface AvatarProps {
  role: UserRole;
  size?: number;
}

export function Avatar({ role, size = 32 }: AvatarProps) {
  const { emoji, color } = getAvatar(role);

  return (
    <div
      className={styles.avatar}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.5}px`,
        backgroundColor: `${color}1a`,
        borderColor: color,
      }}
      role="img"
      aria-label={`${role} avatar`}
    >
      <span className={styles.emoji}>{emoji}</span>
    </div>
  );
}