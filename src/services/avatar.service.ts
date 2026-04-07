import type { UserRole, AvatarConfig } from '../types';

const AVATAR_MAP: Record<UserRole, AvatarConfig> = {
  admin: {
    emoji: '👑',
    color: '#7c3aed',
  },
  viewer: {
    emoji: '📖',
    color: '#4f46e5',
  },
};

export function getAvatar(role: UserRole): AvatarConfig {
  return AVATAR_MAP[role];
}