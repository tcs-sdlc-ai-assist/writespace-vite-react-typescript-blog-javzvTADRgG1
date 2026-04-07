import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogForm } from './BlogForm';
import type { PostForm } from '../../types';

describe('BlogForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isEditing: false,
  };

  function renderBlogForm(overrides: Partial<typeof defaultProps & { initialData?: PostForm }> = {}) {
    const props = { ...defaultProps, ...overrides };
    return render(<BlogForm {...props} />);
  }

  describe('rendering', () => {
    it('renders an empty form in create mode', () => {
      renderBlogForm();

      const titleInput = screen.getByLabelText('Title');
      const contentTextarea = screen.getByLabelText('Content');

      expect(titleInput).toBeInTheDocument();
      expect(contentTextarea).toBeInTheDocument();
      expect(titleInput).toHaveValue('');
      expect(contentTextarea).toHaveValue('');
      expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('renders a pre-filled form in edit mode', () => {
      const initialData: PostForm = {
        title: 'Existing Title',
        content: 'Existing content for the post.',
      };

      renderBlogForm({ initialData, isEditing: true });

      const titleInput = screen.getByLabelText('Title');
      const contentTextarea = screen.getByLabelText('Content');

      expect(titleInput).toHaveValue('Existing Title');
      expect(contentTextarea).toHaveValue('Existing content for the post.');
      expect(screen.getByRole('button', { name: 'Update Post' })).toBeInTheDocument();
    });

    it('displays character counters for title and content', () => {
      renderBlogForm();

      expect(screen.getByText('0/100')).toBeInTheDocument();
      expect(screen.getByText('0/2000')).toBeInTheDocument();
    });

    it('displays correct character counts for pre-filled data', () => {
      const initialData: PostForm = {
        title: 'Hello',
        content: 'World',
      };

      renderBlogForm({ initialData, isEditing: true });

      expect(screen.getByText('5/100')).toBeInTheDocument();
      expect(screen.getByText('5/2000')).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('shows error when title is empty on submit', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderBlogForm({ onSubmit });

      const contentTextarea = screen.getByLabelText('Content');
      await user.type(contentTextarea, 'Some valid content');

      await user.click(screen.getByRole('button', { name: 'Create Post' }));

      expect(screen.getByText('Title is required.')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows error when content is empty on submit', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderBlogForm({ onSubmit });

      const titleInput = screen.getByLabelText('Title');
      await user.type(titleInput, 'Valid Title');

      await user.click(screen.getByRole('button', { name: 'Create Post' }));

      expect(screen.getByText('Content is required.')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows errors for both fields when both are empty on submit', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderBlogForm({ onSubmit });

      await user.click(screen.getByRole('button', { name: 'Create Post' }));

      expect(screen.getByText('Title is required.')).toBeInTheDocument();
      expect(screen.getByText('Content is required.')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows error when title contains only whitespace', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderBlogForm({ onSubmit });

      const titleInput = screen.getByLabelText('Title');
      const contentTextarea = screen.getByLabelText('Content');
      await user.type(titleInput, '   ');
      await user.type(contentTextarea, 'Valid content');

      await user.click(screen.getByRole('button', { name: 'Create Post' }));

      expect(screen.getByText('Title is required.')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('shows error when content contains only whitespace', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderBlogForm({ onSubmit });

      const titleInput = screen.getByLabelText('Title');
      const contentTextarea = screen.getByLabelText('Content');
      await user.type(titleInput, 'Valid Title');
      await user.type(contentTextarea, '   ');

      await user.click(screen.getByRole('button', { name: 'Create Post' }));

      expect(screen.getByText('Content is required.')).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('clears title error when user starts typing in title field', async () => {
      const user = userEvent.setup();
      renderBlogForm();

      await user.click(screen.getByRole('button', { name: 'Create Post' }));
      expect(screen.getByText('Title is required.')).toBeInTheDocument();

      const titleInput = screen.getByLabelText('Title');
      await user.type(titleInput, 'A');

      expect(screen.queryByText('Title is required.')).not.toBeInTheDocument();
    });

    it('clears content error when user starts typing in content field', async () => {
      const user = userEvent.setup();
      renderBlogForm();

      await user.click(screen.getByRole('button', { name: 'Create Post' }));
      expect(screen.getByText('Content is required.')).toBeInTheDocument();

      const contentTextarea = screen.getByLabelText('Content');
      await user.type(contentTextarea, 'A');

      expect(screen.queryByText('Content is required.')).not.toBeInTheDocument();
    });
  });

  describe('character counters', () => {
    it('updates title character counter as user types', async () => {
      const user = userEvent.setup();
      renderBlogForm();

      expect(screen.getByText('0/100')).toBeInTheDocument();

      const titleInput = screen.getByLabelText('Title');
      await user.type(titleInput, 'Hello');

      expect(screen.getByText('5/100')).toBeInTheDocument();
    });

    it('updates content character counter as user types', async () => {
      const user = userEvent.setup();
      renderBlogForm();

      expect(screen.getByText('0/2000')).toBeInTheDocument();

      const contentTextarea = screen.getByLabelText('Content');
      await user.type(contentTextarea, 'Test content');

      expect(screen.getByText('12/2000')).toBeInTheDocument();
    });
  });

  describe('form submission', () => {
    it('calls onSubmit with trimmed data when form is valid', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      renderBlogForm({ onSubmit });

      const titleInput = screen.getByLabelText('Title');
      const contentTextarea = screen.getByLabelText('Content');

      await user.type(titleInput, '  My Blog Post  ');
      await user.type(contentTextarea, '  This is the content of my blog post.  ');

      await user.click(screen.getByRole('button', { name: 'Create Post' }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'My Blog Post',
        content: 'This is the content of my blog post.',
      });
    });

    it('calls onSubmit with correct data in edit mode', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const initialData: PostForm = {
        title: 'Original Title',
        content: 'Original content.',
      };

      renderBlogForm({ onSubmit, initialData, isEditing: true });

      const titleInput = screen.getByLabelText('Title');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      await user.click(screen.getByRole('button', { name: 'Update Post' }));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Updated Title',
        content: 'Original content.',
      });
    });
  });

  describe('cancel button', () => {
    it('calls onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      renderBlogForm({ onCancel });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('does not call onSubmit when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      const onCancel = vi.fn();
      renderBlogForm({ onSubmit, onCancel });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});