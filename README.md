# Digital Garden

个人数字花园 - 基于 Next.js 14 的静态博客，支持 MDX、代码高亮、数学公式与 Light/Dark 主题。

## 技术栈

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: next-mdx-remote + gray-matter
- **Animation**: Framer Motion

## 快速开始

```bash
# 推荐：内网访问（本机 + 同一局域网设备）
./start_dev.sh

# 或手动执行
npm install
npm run dev:lan    # 开发模式，监听 0.0.0.0:3000
```

其他命令：

```bash
npm run dev       # 仅本机 localhost:3000
npm run build     # 构建
npm start         # 生产模式（仅本机）
npm run start:lan # 生产模式，内网可访问
```

## 目录结构

```
├── app/                    # Next.js App Router
├── components/             # 组件
│   ├── layout/            # Navbar, Footer, ThemeProvider
│   ├── mdx/               # MDX 渲染与自定义组件
│   ├── cards/             # 文章卡片
│   └── taxonomy/          # 分类、标签、面包屑
├── content/posts/         # MDX 文章（按分类分目录）
│   ├── digital/           # 数字化与工程管理
│   ├── herb/              # 本草与中医
│   ├── metaphysics/       # 玄学与哲学
│   ├── hardware/          # 硬核理工与机械
│   └── journey/           # 行路与提升
├── lib/                   # 工具与内容加载
└── public/                # 静态资源
```

## 写作规范

在 `content/posts/{category}/` 下创建 `.mdx` 文件，frontmatter 示例：

```yaml
---
title: 文章标题
description: 简短描述（可选）
date: 2025-02-28
category: digital   # digital | herb | metaphysics | hardware | journey
slug: my-post       # 可选，URL 友好标识。不填则用文件名（中文名可能 404）
tags:
  - 标签1
  - 标签2
draft: false        # true 时构建排除
---
```

> **中文/特殊字符文件名**：建议添加 `slug: 英文短名`，否则 URL 可能出现 404。

## 环境变量

- `NEXT_PUBLIC_SITE_URL`: 站点 URL，用于 sitemap/robots（默认 https://example.com）
- `NEXT_PUBLIC_FORMSPREE_ID`: Formspree 表单 ID，用于首页留言板

## 外网部署

详见 [DEPLOY.md](./DEPLOY.md)，推荐使用 Vercel 一键部署。

## License

MIT
