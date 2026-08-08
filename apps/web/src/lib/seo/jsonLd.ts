// Escapes `<` so a `</script>` (or any tag) inside a CMS-editable string
// value can't close the JSON-LD script tag early and inject markup after it.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
