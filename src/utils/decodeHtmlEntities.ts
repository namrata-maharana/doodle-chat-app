export function decodeHtmlEntities(text: string): string {
  const parsed = new DOMParser().parseFromString(text, 'text/html')
  return parsed.documentElement.textContent ?? text
}
