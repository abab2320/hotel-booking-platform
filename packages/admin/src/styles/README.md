# 🎨 主题色彩系统使用指南

## 📋 概述

本项目采用 CSS 变量（CSS Custom Properties）实现统一的主题色彩系统，基于 **Ant Design 默认蓝色主题**，配合灰色、黑色点缀，保留红色用于错误提示。

## 🎯 设计理念

- **主题色**: Ant Design 蓝色 (`#1890ff`) - 用于主要交互元素
- **中性色**: 灰色、黑色 - 用于文本、背景、边框
- **功能色**: 
  - 成功 - 绿色 (`#52c41a`)
  - 警告 - 橙色 (`#faad14`)
  - **错误 - 红色 (`#ff4d4f`)** ✅
  - 信息 - 蓝色 (`#1890ff`)

## 📁 文件结构

```
src/styles/
├── theme.css       # 主题变量定义 + 工具类
└── global.css      # 全局样式（引入 theme.css）
```

## 🚀 使用方法

### 1. 在组件中使用 CSS 变量

```css
/* ✅ 推荐：使用 CSS 变量 */
.button {
  background-color: var(--primary-color);
  color: var(--color-white);
  border: 1px solid var(--border-color-base);
}

.button:hover {
  background-color: var(--primary-color-hover);
}

/* ❌ 不推荐：硬编码颜色值 */
.button {
  background-color: #1890ff;
  color: #fff;
  border: 1px solid #d9d9d9;
}
```

### 2. 使用工具类

```html
<!-- 文本颜色 -->
<p class="text-primary">主题色文本</p>
<p class="text-error">错误提示文本</p>
<p class="text-secondary">次要文本</p>

<!-- 背景色 -->
<div class="bg-primary">主题色背景</div>
<div class="bg-white">白色背景</div>
<div class="bg-gray-light">浅灰色背景</div>

<!-- 边框 -->
<div class="border-base">基础边框</div>
<div class="border-primary">主题色边框</div>

<!-- 阴影 -->
<div class="shadow-card">卡片阴影</div>
<div class="shadow-elevated">悬浮阴影</div>

<!-- 间距 -->
<div class="p-md m-lg">中等内边距 + 大外边距</div>
<div class="mt-xl mb-sm">超大上边距 + 小下边距</div>
```

### 3. 在 JSX 中使用内联样式

```tsx
// React 组件中使用
<div style={{ 
  color: 'var(--text-color-primary)',
  backgroundColor: 'var(--background-color-base)',
  padding: 'var(--spacing-md)'
}}>
  内容
</div>
```

## 🎨 主要颜色变量

### 主题色（蓝色系）
```css
--primary-color: #1890ff          /* 主题色 */
--primary-color-hover: #40a9ff    /* 悬停态 */
--primary-color-active: #096dd9   /* 激活态 */
--primary-color-light: #e6f7ff    /* 浅色背景 */
--primary-color-dark: #0050b3     /* 深色 */
```

### 功能色
```css
/* 成功 - 绿色 */
--success-color: #52c41a
--success-color-hover: #73d13d
--success-color-light: #f6ffed

/* 警告 - 橙色 */
--warning-color: #faad14
--warning-color-hover: #ffc53d
--warning-color-light: #fffbe6

/* 错误 - 红色 ⭐ */
--error-color: #ff4d4f
--error-color-hover: #ff7875
--error-color-light: #fff2f0
```

### 中性色（灰色系）
```css
--color-white: #ffffff
--color-black: #000000
--gray-1 ~ --gray-13: #ffffff → #000000  /* 13级灰度 */
```

### 文本色
```css
--text-color-primary: rgba(0, 0, 0, 0.85)      /* 主文本 - 黑色 85% */
--text-color-secondary: rgba(0, 0, 0, 0.65)    /* 次要文本 - 黑色 65% */
--text-color-tertiary: rgba(0, 0, 0, 0.45)     /* 三级文本 - 黑色 45% */
--text-color-disabled: rgba(0, 0, 0, 0.25)     /* 禁用文本 - 黑色 25% */
```

### 背景色
```css
--background-color-base: #f0f2f5      /* 页面背景 - 浅灰 */
--background-color-light: #fafafa     /* 浅色背景 */
--background-color-white: #ffffff     /* 白色背景 */
--component-background: #ffffff       /* 组件背景 */
```

### 边框色
```css
--border-color-base: #d9d9d9          /* 基础边框 - 灰色 */
--border-color-light: #e8e8e8         /* 浅色边框 */
--border-color-dark: #bfbfbf          /* 深色边框 */
```

## 📐 其他变量

### 圆角
```css
--border-radius-sm: 2px
--border-radius-base: 4px
--border-radius-lg: 8px
```

### 间距
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-xxl: 48px
```

### 字体
```css
--font-size-sm: 12px
--font-size-base: 14px
--font-size-lg: 16px
--font-size-xl: 20px
--font-size-xxl: 24px

--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### 阴影
```css
--box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.15)
--box-shadow-card: ...      /* 卡片阴影 */
--box-shadow-elevated: ...  /* 悬浮阴影 */
--box-shadow-hover: ...     /* 悬停阴影 */
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **优先使用 CSS 变量**
```css
.error-message {
  color: var(--error-color);
  font-size: var(--font-size-sm);
}
```

2. **使用语义化变量名**
```css
/* ✅ 好 */
color: var(--text-color-secondary);

/* ❌ 不好 */
color: var(--gray-7);
```

3. **使用工具类快速开发**
```html
<div class="bg-white p-lg shadow-card rounded">
  <h2 class="text-primary font-semibold mb-md">标题</h2>
  <p class="text-secondary">内容</p>
</div>
```

### ❌ 避免做法

1. **不要硬编码颜色**
```css
/* ❌ 避免 */
.button {
  background-color: #1890ff;
}

/* ✅ 使用变量 */
.button {
  background-color: var(--primary-color);
}
```

2. **不要混用颜色系统**
```css
/* ❌ 避免混用 */
.card {
  background: #fff;              /* 硬编码 */
  border: 1px solid var(--border-color-base);  /* 变量 */
}

/* ✅ 统一使用变量 */
.card {
  background: var(--color-white);
  border: 1px solid var(--border-color-base);
}
```

## 🔄 迁移现有代码

### 步骤 1: 识别硬编码颜色
```bash
# 搜索 hex 颜色代码
grep -r "#[0-9a-fA-F]\{3,6\}" src/
```

### 步骤 2: 查找对应变量
| 硬编码颜色 | 对应变量 | 用途 |
|-----------|---------|------|
| `#1890ff` | `--primary-color` | 主题色 |
| `#ff4d4f` | `--error-color` | 错误色 ⭐ |
| `#52c41a` | `--success-color` | 成功色 |
| `#ffffff`, `#fff` | `--color-white` | 白色 |
| `#000000`, `#000` | `--color-black` | 黑色 |
| `#f0f2f5` | `--background-color-base` | 页面背景 |
| `#d9d9d9` | `--border-color-base` | 边框色 |

### 步骤 3: 替换并测试
```css
/* 替换前 */
.error-text {
  color: #ff4d4f;
}

/* 替换后 */
.error-text {
  color: var(--error-color);
}
```

## 📊 颜色使用场景

### 主题蓝色 (`--primary-color`)
- 主按钮背景
- 链接文字
- 选中状态
- 品牌元素
- 进度条
- 开关激活态

### 错误红色 (`--error-color`) ⭐
- 错误提示文本
- 表单验证错误
- 删除按钮（危险操作）
- 错误状态标签
- 警告图标

### 灰色系
- 页面背景: `--background-color-base` (#f0f2f5)
- 组件背景: `--component-background` (#ffffff)
- 边框: `--border-color-base` (#d9d9d9)
- 次要文本: `--text-color-secondary`
- 禁用状态: `--text-color-disabled`

### 黑色
- 主要文本: `--text-color-primary` (rgba(0,0,0,0.85))
- 标题文字
- 重要信息

## 🌓 未来扩展：深色模式

预留了深色模式支持：

```css
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #1890ff;
    --background-color-base: #141414;
    --text-color-primary: rgba(255, 255, 255, 0.85);
    /* ... 其他深色主题变量 */
  }
}
```

## 📚 参考资源

- [Ant Design 色彩系统](https://ant.design/docs/spec/colors-cn)
- [CSS Variables (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)

---

**更新日期**: 2026-02-12  
**版本**: v1.0.0
