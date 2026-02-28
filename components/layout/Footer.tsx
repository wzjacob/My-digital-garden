"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const FOOTER_LINKS = [
  { href: "/about/", label: "关于" },
  { href: "/category/digital/", label: "数字化" },
  { href: "/category/herb/", label: "本草" },
  { href: "/category/metaphysics/", label: "玄学" },
  { href: "/category/hardware/", label: "硬核理工" },
  { href: "/category/journey/", label: "行路" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50 mt-auto animate-in fade-in duration-500">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <Link href="/" className="font-semibold text-foreground hover:underline">
              {SITE_NAME}
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Digital Garden · 静心耕耘，缓慢生长
            </p>
            <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
              <a
                href="mailto:wangzijunjacob@gmail.com"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                wangzijunjacob@gmail.com
              </a>
              <a
                href="tel:13051692001"
                className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                13051692001
              </a>
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {year} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
