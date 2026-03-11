"use server";

import { setAdminCookie, clearAdminCookie, getAdminSecret } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function adminLogin(
  password: string,
  from?: string
): Promise<{ ok: boolean; message: string }> {
  const secret = getAdminSecret();
  if (!secret) {
    return { ok: false, message: "未配置管理密码，请在环境变量中设置 ADMIN_SECRET" };
  }
  if (password.trim() !== secret) {
    return { ok: false, message: "密码错误" };
  }
  await setAdminCookie(secret);
  const target = from && (from.startsWith("/upload") || from.startsWith("/manage"))
    ? from
    : "/manage";
  redirect(target);
}

export async function adminLogout(): Promise<void> {
  await clearAdminCookie();
  redirect("/");
}
