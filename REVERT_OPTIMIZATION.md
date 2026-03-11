# 优化回退指南

如需回退本次「Apple/GitHub 风格」优化，可执行：

```bash
# 回退所有更改
git checkout -- app/page.tsx app/globals.css lib/constants.ts components/MessageForm.tsx components/taxonomy/CategoryGrid.tsx

# 或逐个文件回退
git checkout -- app/page.tsx
git checkout -- app/globals.css
git checkout -- lib/constants.ts
git checkout -- components/MessageForm.tsx
git checkout -- components/taxonomy/CategoryGrid.tsx
```

本次改动涉及：
- `app/page.tsx` - Hero 字体层次、section 标题
- `app/globals.css` - 霓虹边框柔和版、暗色模式、响应式
- `lib/constants.ts` - 机械与能源描述
- `components/MessageForm.tsx` - 成功动效、触摸区域
- `components/taxonomy/CategoryGrid.tsx` - 分类卡片 hover 动效
