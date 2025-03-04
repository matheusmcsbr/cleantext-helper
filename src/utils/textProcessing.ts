
/**
 * Converts formatted text into plain text by removing formatting
 * and retaining only paragraphs
 */
export const cleanText = (input: string): string => {
  if (!input) return '';
  
  // Replace HTML tags with appropriate content
  let plainText = input
    // First handle specific HTML elements
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi, '')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    // Remove all other HTML tags
    .replace(/<[^>]*>/g, '')
    // Decode HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  
  // Remove multiple consecutive line breaks and whitespace
  plainText = plainText
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
  
  return plainText;
};

/**
 * Counts words in text
 */
export const wordCount = (text: string): number => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

/**
 * Counts characters in text
 */
export const charCount = (text: string): number => {
  if (!text) return 0;
  return text.length;
};
