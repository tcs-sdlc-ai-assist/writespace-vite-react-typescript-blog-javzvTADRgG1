export function getExcerpt(content: string, maxLength: number = 150): string {
  if (!content) {
    return '';
  }

  if (content.length <= maxLength) {
    return content;
  }

  return content.slice(0, maxLength).trimEnd() + '...';
}