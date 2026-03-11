"use client";

import { useState, FormEvent } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : null;

export function MessageForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const canSubmit = !!FORMSPREE_ENDPOINT;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section>
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 md:p-8">
        <p className="text-muted-foreground mb-6 leading-relaxed">
          或许你有些思考或建议乃至批判性的建议？这对我也许会很宝贵。
        </p>
        {!canSubmit && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mb-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-3 py-2">
            本地预览：在项目根目录创建 <code>.env.local</code>，添加 <code>NEXT_PUBLIC_FORMSPREE_ID=你的表单ID</code> 即可启用发送（从 Vercel 环境变量复制）。
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="_gotcha" className="hidden" aria-hidden="true" tabIndex={-1} />
          <div className="neon-border-wrapper">
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              placeholder="写下你想说的..."
              className="neon-textarea w-full rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none resize-none bg-card"
            />
          </div>
          <Button
            type="submit"
            disabled={status === "sending" || !canSubmit}
            className="w-full sm:w-auto min-h-12 px-6 py-3 sm:min-h-10 sm:py-2 touch-manipulation"
          >
            {status === "sending" ? (
              "发送中..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                发送留言
              </>
            )}
          </Button>
        </form>
        {status === "success" && (
          <div
            className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 animate-in fade-in slide-in-from-bottom-2 duration-300"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>感谢留言，已收到！</span>
          </div>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">发送失败，请稍后重试。</p>
        )}
      </div>
    </section>
  );
}
