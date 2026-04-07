import { useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import type { PostForm } from '../../types';
import styles from './BlogForm.module.css';

interface BlogFormProps {
  initialData?: PostForm;
  onSubmit: (data: PostForm) => void;
  onCancel: () => void;
  isEditing: boolean;
}

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 2000;

export function BlogForm({ initialData, onSubmit, onCancel, isEditing }: BlogFormProps) {
  const [title, setTitle] = useState<string>(initialData?.title ?? '');
  const [content, setContent] = useState<string>(initialData?.content ?? '');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const validate = useCallback((): boolean => {
    const newErrors: { title?: string; content?: string } = {};

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Title is required.';
    } else if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      newErrors.title = `Title must be ${TITLE_MAX_LENGTH} characters or less.`;
    }

    if (!trimmedContent) {
      newErrors.content = 'Content is required.';
    } else if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      newErrors.content = `Content must be ${CONTENT_MAX_LENGTH} characters or less.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, content]);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setErrors((prev) => ({ ...prev, title: undefined }));
  }, []);

  const handleContentChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setErrors((prev) => ({ ...prev, content: undefined }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      onSubmit({
        title: title.trim(),
        content: content.trim(),
      });
    },
    [title, content, validate, onSubmit],
  );

  const contentLength = content.length;
  const isContentNearLimit = contentLength > CONTENT_MAX_LENGTH * 0.9;
  const isContentOverLimit = contentLength > CONTENT_MAX_LENGTH;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="blog-title" className={styles.label}>
          Title
        </label>
        <input
          id="blog-title"
          type="text"
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter your post title..."
          maxLength={TITLE_MAX_LENGTH}
          autoComplete="off"
        />
        {errors.title && (
          <span className={styles.error} role="alert">
            {errors.title}
          </span>
        )}
        <span className={styles.charCount}>
          {title.length}/{TITLE_MAX_LENGTH}
        </span>
      </div>

      <div className={styles.field}>
        <label htmlFor="blog-content" className={styles.label}>
          Content
        </label>
        <textarea
          id="blog-content"
          className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
          value={content}
          onChange={handleContentChange}
          placeholder="Write your post content..."
          rows={12}
        />
        {errors.content && (
          <span className={styles.error} role="alert">
            {errors.content}
          </span>
        )}
        <span
          className={`${styles.charCount} ${isContentOverLimit ? styles.charCountOver : isContentNearLimit ? styles.charCountWarn : ''}`}
        >
          {contentLength}/{CONTENT_MAX_LENGTH}
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}