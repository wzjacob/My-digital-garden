"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { adminLogin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? undefined;
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await adminLogin(password, from);
    if (!result.ok) {
      setMessage(result.message);
      setLoading(false);
    }
    // 成功时会 redirect，不会走到这里
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-semibold">管理后台登录</h1>
          <p className="text-sm text-muted-foreground mt-1">
            请输入管理密码以访问上传与管理功能
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理密码"
            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
            autoFocus
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "验证中…" : "登录"}
          </Button>
        </form>
        {message && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">{message}</p>
        )}
      </div>
    </div>
  );
}
