"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ID
  ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID}`
  : null;

export function MessageForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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

  if (!FORMSPREE_ENDPOINT) {
    return (
      <section className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">留言板</h2>
          <p className="text-sm text-muted-foreground">
            请配置 <code className="bg-muted px-1.5 py-0.5 rounded">NEXT_PUBLIC_FORMSPREE_ID</code> 以启用留言功能。
            <br />
            <a
              href="https://formspree.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline mt-2 inline-block"
            >
              前往 Formspree 免费注册 →
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">留言</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="_gotcha" className="hidden" aria-hidden="true" tabIndex={-1} />
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              昵称
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="您的昵称"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              邮箱
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="your@email.com"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
              留言内容
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              placeholder="写下你想说的..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
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
          <p className="mt-4 text-sm text-green-600 dark:text-green-400">感谢留言，已收到！</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">发送失败，请稍后重试。</p>
        )}
      </div>
    </section>
  );
}
