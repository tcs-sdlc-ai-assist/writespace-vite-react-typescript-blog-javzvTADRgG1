import type { Post, CurrentUser } from '../../types';
import { Avatar } from '../Avatar/Avatar';
import { getExcerpt } from '../../utils/excerpt';
import { formatDate } from '../../utils/formatDate';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
  index: number;
  currentUser: CurrentUser | null;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const ACCENT_COLORS = [
  '#4f46e5',
  '#7c3aed',
  '#2563eb',
  '#059669',
  '#d97706',
  '#dc2626',
  '#0891b2',
  '#7c3aed',
] as const;

function getAccentColor(index: number): string {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}

export function PostCard({ post, index, currentUser, onEdit, onDelete }: PostCardProps) {
  const accentColor = getAccentColor(index);
  const excerpt = getExcerpt(post.content, 150);
  const formattedDate = formatDate(post.createdAt);

  const isAdmin = currentUser?.role === 'admin';
  const isOwner = currentUser !== null && currentUser.id === post.authorId;
  const canEdit = isAdmin || isOwner;
  const canDelete = isAdmin || isOwner;

  const authorRole = post.authorId === 'admin-001' ? 'admin' as const : 'viewer' as const;

  return (
    <div className={styles.card}>
      <div
        className={styles.accent}
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <Avatar role={authorRole} size={36} />
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{post.authorName}</span>
              <span className={styles.date}>{formattedDate}</span>
            </div>
          </div>
          {(canEdit || canDelete) && (
            <div className={styles.actions}>
              {canEdit && (
                <button
                  className={styles.editButton}
                  onClick={() => onEdit(post.id)}
                  aria-label={`Edit ${post.title}`}
                >
                  ✏️
                </button>
              )}
              {canDelete && (
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(post.id)}
                  aria-label={`Delete ${post.title}`}
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{post.title}</h3>
          <p className={styles.excerpt}>{excerpt}</p>
        </div>
      </div>
    </div>
  );
}