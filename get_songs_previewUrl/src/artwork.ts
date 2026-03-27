export function buildArtworkUrl(template: string, width = 1000, height = 1000): string {
  return template.replaceAll("{w}", String(width)).replaceAll("{h}", String(height));
}
