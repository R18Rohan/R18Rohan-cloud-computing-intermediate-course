// Tagged Template Literals for string processing and sanitization

export function sanitizeHtml(strings: TemplateStringsArray, ...values: any[]): string {
  // Combines literal string slices with escaped interpolated values
  return strings.reduce((result, currentString, index) => {
    const rawVal = values[index - 1];
    let escaped = '';

    if (rawVal !== undefined) {
      // Escape HTML characters
      escaped = String(rawVal)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    return result + escaped + currentString;
  });
}
