# 梓郡的Digital Garden - 外网部署指南

## 一、部署到 Vercel（推荐，免费）

### 1. 准备代码仓库

```bash
cd /home/trt-wzj/WorkStuff/digital-garden
git init
git add .
git commit -m "Initial commit"
```

将代码推送到 GitHub：
- 在 GitHub 创建新仓库，如 `digital-garden`
- 关联并推送：`git remote add origin https://github.com/你的用户名/digital-garden.git && git push -u origin main`

### 2. 部署到 Vercel

1. 打开 [vercel.com](https://vercel.com)，使用 GitHub 登录
2. 点击 **Add New → Project**，选择你的 `digital-garden` 仓库
3. 无需修改配置，直接点击 **Deploy**
4. 约 1～2 分钟后即可获得公网地址，如 `https://digital-garden-xxx.vercel.app`

### 3. 配置环境变量（可选）

在 Vercel 项目 **Settings → Environment Variables** 中添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SITE_URL` | `https://你的域名.vercel.app` | 用于 sitemap、SEO |
| `NEXT_PUBLIC_FORMSPREE_ID` | 你的 Formspree 表单 ID | 启用留言板功能 |

### 4. 启用留言板

1. 打开 [formspree.io](https://formspree.io) 免费注册
2. 创建新表单，获取 **Form ID**（形如 `xyzwabcd`）
3. 在 Vercel 环境变量中设置：`NEXT_PUBLIC_FORMSPREE_ID=xyzwabcd`
4. 重新部署后，留言会发送到你的 Formspree 绑定的邮箱

### 5. 自定义域名（可选）

在 Vercel 项目 **Settings → Domains** 中添加你的域名，按提示配置 DNS 即可。

---

## 二、其他部署方式

- **Netlify**：导入 GitHub 仓库，构建命令 `npm run build`，发布目录 `out`（需在 next.config 中设置 `output: "export"`）
- **自建服务器**：`npm run build && npm start`，需 Node.js 环境

---

## 三、部署后检查

- [ ] 首页标题为「梓郡的Digital Garden」
- [ ] 副标题含「感谢你的光临」
- [ ] 页脚显示邮箱 wangzijunjacob@gmail.com、手机 13051692001
- [ ] 留言模块正常显示（配置 Formspree 后）
- [ ] 各分类与文章可正常访问
