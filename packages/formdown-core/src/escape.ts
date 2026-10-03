/** Escape text for use in HTML content or a double- or single-quoted attribute value. */
export function escapeHtml(text: unknown): string {
    return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}
