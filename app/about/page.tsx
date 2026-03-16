import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "关于",
  description: "关于本站与作者",
};

const AvatarModel = nextDynamic(
  () => import("@/components/about/AvatarModel").then((m) => m.AvatarModel),
  {
    ssr: false,
    loading: () => (
      <div className="w-full max-w-xs mx-auto aspect-[4/5] rounded-xl bg-muted/30 animate-pulse" />
    ),
  }
);

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold tracking-tight">关于</h1>

        <div className="mt-10 flex flex-col sm:flex-row gap-10 items-center sm:items-start">
          <div className="shrink-0">
            <AvatarModel />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed" style={{ lineHeight: 1.75 }}>
              这里是 Digital Garden，一个个人数字花园。静心耕耘，缓慢生长——感谢您光临小花园。
            </p>
            <p className="mt-4 text-zinc-800 dark:text-zinc-200 leading-relaxed" style={{ lineHeight: 1.75 }}>
              记录数字化与工程管理、本草与中医、玄学与哲学、硬核理工与机械、行路与提升等方面的思考与实践。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
