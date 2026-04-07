import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  describe('admin role', () => {
    it('renders crown emoji for admin role', () => {
      render(<Avatar role="admin" />);

      const avatar = screen.getByRole('img', { name: 'admin avatar' });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('👑');
    });

    it('applies violet accent color for admin role', () => {
      render(<Avatar role="admin" />);

      const avatar = screen.getByRole('img', { name: 'admin avatar' });
      expect(avatar).toHaveStyle({ borderColor: '#7c3aed' });
      expect(avatar).toHaveStyle({ backgroundColor: '#7c3aed1a' });
    });
  });

  describe('viewer role', () => {
    it('renders book emoji for viewer role', () => {
      render(<Avatar role="viewer" />);

      const avatar = screen.getByRole('img', { name: 'viewer avatar' });
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('📖');
    });

    it('applies indigo accent color for viewer role', () => {
      render(<Avatar role="viewer" />);

      const avatar = screen.getByRole('img', { name: 'viewer avatar' });
      expect(avatar).toHaveStyle({ borderColor: '#4f46e5' });
      expect(avatar).toHaveStyle({ backgroundColor: '#4f46e51a' });
    });
  });

  describe('size prop', () => {
    it('renders with default size of 32px when no size prop is provided', () => {
      render(<Avatar role="viewer" />);

      const avatar = screen.getByRole('img', { name: 'viewer avatar' });
      expect(avatar).toHaveStyle({ width: '32px', height: '32px' });
      expect(avatar).toHaveStyle({ fontSize: '16px' });
    });

    it('renders with custom size when size prop is provided', () => {
      render(<Avatar role="admin" size={48} />);

      const avatar = screen.getByRole('img', { name: 'admin avatar' });
      expect(avatar).toHaveStyle({ width: '48px', height: '48px' });
      expect(avatar).toHaveStyle({ fontSize: '24px' });
    });

    it('renders with a small size', () => {
      render(<Avatar role="viewer" size={20} />);

      const avatar = screen.getByRole('img', { name: 'viewer avatar' });
      expect(avatar).toHaveStyle({ width: '20px', height: '20px' });
      expect(avatar).toHaveStyle({ fontSize: '10px' });
    });

    it('renders with a large size', () => {
      render(<Avatar role="admin" size={64} />);

      const avatar = screen.getByRole('img', { name: 'admin avatar' });
      expect(avatar).toHaveStyle({ width: '64px', height: '64px' });
      expect(avatar).toHaveStyle({ fontSize: '32px' });
    });
  });

  describe('accessibility', () => {
    it('has correct aria-label for admin role', () => {
      render(<Avatar role="admin" />);

      const avatar = screen.getByRole('img', { name: 'admin avatar' });
      expect(avatar).toHaveAttribute('aria-label', 'admin avatar');
    });

    it('has correct aria-label for viewer role', () => {
      render(<Avatar role="viewer" />);

      const avatar = screen.getByRole('img', { name: 'viewer avatar' });
      expect(avatar).toHaveAttribute('aria-label', 'viewer avatar');
    });
  });
});