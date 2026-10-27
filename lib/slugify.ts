// Turns a note title or wikilink target into a URL-safe slug,
// e.g. "Ideas: Flowing (Big)" -> "ideas-flowing-big"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`'"!?()[\]{},.:;@#$%^&*~<>]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}
