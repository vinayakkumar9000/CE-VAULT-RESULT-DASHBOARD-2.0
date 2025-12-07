/**
 * Escape special regex characters in a string to prevent regex injection attacks
 * @param str - The string to escape
 * @returns The escaped string safe for use in MongoDB $regex queries
 */
export function escapeRegex(str: string): string {
  // Escape special regex characters: . * + ? ^ $ { } ( ) | [ ] \
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
