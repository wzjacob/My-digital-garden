import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_key";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 天

export function getAdminSecret(): string | undefined {
  return process.env.ADMIN_SECRET;
}

/** 检查当前请求是否已通过 admin 验证 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const secret = getAdminSecret();
  if (!secret) return false; // 未配置则不保护（本地开发方便）
  const c = await cookies();
  const token = c.get(ADMIN_COOKIE)?.value;
  return token === secret;
}

/** 设置 admin 认证 cookie（登录成功后调用） */
export async function setAdminCookie(secret: string): Promise<void> {
  const c = await cookies();
  c.set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/** 清除 admin cookie（登出） */
export async function clearAdminCookie(): Promise<void> {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}
