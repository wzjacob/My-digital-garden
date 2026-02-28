import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">页面未找到</p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md bg-foreground px-6 py-3 text-background hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
}
