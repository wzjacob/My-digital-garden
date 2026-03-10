/**
 * 用 Base64 编码 fileSlug，避免 URL 路径中的编码问题（尤其是 Windows 与中文文件名）
 */

export function fileSlugToKey(fileSlug: string): string {
  return Buffer.from(fileSlug, "utf-8").toString("base64url");
}

export function keyToFileSlug(key: string): string | null {
  try {
    return Buffer.from(key, "base64url").toString("utf-8");
  } catch {
    return null;
  }
}
