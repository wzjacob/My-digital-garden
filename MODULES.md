# 项目模块说明

本文档列出数字花园的各功能模块，便于你针对性地指挥 AI 进行修改和优化。

---

## 1. 内容加载模块

| 路径 | 作用 |
|------|------|
| `lib/content/loader.ts` | 从 `content/posts/` 读取 MDX，解析 frontmatter，提供 `getAllPosts`、`getPostBySlug`、`getAllPostsIncludingDrafts`、`getPostByFileSlug` |
| `lib/content/types.ts` | 重新导出 `types/content.ts` 中的 Post、PostFrontmatter 等类型 |
| `lib/content/taxonomy.ts` | 分类与标签的辅助逻辑（如 `getCategoryInfo`） |
| `types/content.ts` | Post、PostFrontmatter、CategoryInfo 等类型定义 |

**常用修改场景**：新增 frontmatter 字段、改文章筛选逻辑、支持新分类。

---

## 2. 上传与编辑模块

| 路径 | 作用 |
|------|------|
| `lib/actions/upload.ts` | Server Actions：`uploadArticle`、`uploadMedia`、`createLinkPost`、`updateArticle`、`deleteArticle` |
| `app/upload/page.tsx` | 上传页入口 |
| `app/upload/UploadPageClient.tsx` | 上传页 UI（文章 / 媒体 / 链接三个标签） |
| `components/upload/ArticleUploadFlow.tsx` | 文章上传流程：选文件 → 填 frontmatter → 保存 |
| `components/upload/UploadZone.tsx` | 媒体上传的拖拽区 |

**常用修改场景**：改上传规则、支持更多格式、自定义 frontmatter 表单。

---

## 3. 内容管理模块

| 路径 | 作用 |
|------|------|
| `app/manage/page.tsx` | 管理页：文章列表 |
| `app/manage/ManageClient.tsx` | 列表展示、编辑 / 删除 / 预览入口 |
| `app/manage/edit/[...slug]/page.tsx` | 编辑页入口，按文件路径加载文章 |
| `app/manage/edit/[...slug]/EditForm.tsx` | 编辑表单（frontmatter + 正文） |

**常用修改场景**：调整列表样式、增加筛选、批量操作。

---

## 4. 内容展示模块

| 路径 | 作用 |
|------|------|
| `app/(content)/post/[...slug]/page.tsx` | 文章详情页 |
| `app/(content)/category/[slug]/page.tsx` | 分类列表页 |
| `app/(content)/tag/[slug]/page.tsx` | 标签列表页 |
| `components/mdx/MDXRenderer.tsx` | 将 Markdown/MDX 转为 React 组件 |
| `components/mdx/MDXComponents.tsx` | MDX 组件映射（img、video、pre、blockquote、table 等） |

**常用修改场景**：改文章布局、改代码高亮、调整图片 / 视频样式。

---

## 5. 布局与导航

| 路径 | 作用 |
|------|------|
| `app/layout.tsx` | 根布局（字体、ThemeProvider、Navbar、Footer） |
| `app/(content)/layout.tsx` | 内容区布局 |
| `components/layout/Navbar.tsx` | 导航栏（分类、上传、管理、主题切换） |
| `components/layout/Footer.tsx` | 页脚 |
| `components/layout/ThemeProvider.tsx` | 明暗主题 |

**常用修改场景**：改导航结构、增删入口、改主题。

---

## 6. 配置与常量

| 路径 | 作用 |
|------|------|
| `lib/constants.ts` | `CATEGORIES`、`SITE_NAME`、`SITE_URL` |
| `next.config.js` | Next.js 配置（trailingSlash、optimizePackageImports 等） |

**常用修改场景**：新增分类、改站点名、改构建优化。

---

## 7. 其他组件

| 路径 | 作用 |
|------|------|
| `components/cards/PostCard.tsx` | 文章卡片（首页、分类页） |
| `components/taxonomy/CategoryGrid.tsx` | 分类网格 |
| `components/taxonomy/Breadcrumb.tsx` | 面包屑 |
| `components/mdx/Callout.tsx` | 引用块样式 |
| `components/mdx/TableWrapper.tsx` | 表格横向滚动 |

---

## 8. 内容与资源路径

| 路径 | 作用 |
|------|------|
| `content/posts/{category}/*.mdx` | 文章源文件 |
| `public/media/YYYY-MM/*` | 上传的图片、视频（可通过 `/media/2025-02/xxx.png` 引用） |

---

## 使用指引

- **改上传逻辑** → 看 `lib/actions/upload.ts`、`ArticleUploadFlow.tsx`
- **改编辑 404 或路径** → 看 `ManageClient` 中的 `fileSlug`、`getPostByFileSlug`
- **改文章展示样式** → 看 `MDXComponents.tsx`、`post/[...slug]/page.tsx`
- **改导航或入口** → 看 `Navbar.tsx`
- **改分类结构** → 看 `lib/constants.ts`、`loader.ts`
