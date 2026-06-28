/**
 * 构建页面完整 URL
 * @param prefix 路径前缀，如 '/categories/' 或 ''
 * @param slug   路径标识，如 'dev-notes' 或 '/archives.html'
 * @param suffix 路径后缀，如 '.html' 或 ''
 */
export function getFullURL(
  prefix: string = '',
  slug: string = '',
  suffix: string = ''
): string {
  const site = import.meta.env.SITE || 'http://localhost:4321';
  const base = import.meta.env.BASE_URL || '/';
  const url = new URL(base, site);

  // 正确拼接 prefix 和 slug，确保用 / 分隔
  const segment = [prefix, slug]
    .filter(Boolean)
    .map(s => s.replace(/^\/+/, '').replace(/\/+$/, ''))
    .filter(Boolean)
    .join('/');

  // 避免给空路径加 suffix
  if (!segment) {
    return url.href;
  }

  // 拼接路径，并压缩多余斜杠
  const basePath = url.pathname.replace(/\/+$/, '');
  const suffixSafe = suffix && !segment.endsWith(suffix) ? suffix : '';
  url.pathname = `${basePath}/${segment}${suffixSafe}`.replace(/\/{2,}/g, '/');

  return url.href;
}

/**
 * 构建文章页 URL
 */
export function getPostURL(slug: string): string {
  return getFullURL('', slug, '.html');
}

/**
 * 判断是否为外部链接（http:// 或 https:// 开头）
 * 用于决定是否添加 target="_blank" rel="noopener noreferrer"
 */
export function isExternalLink(url: string): boolean {
  return /^https?:\/\//i.test(url);
}
