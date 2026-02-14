# 🎨 主题色彩系统使用指南

## 📋 概述

本项目采用 CSS 变量（CSS Custom Properties）实现统一的主题色彩系统，基于 **Ant Design v5 Design Token 体系**，为企业级商家后台管理系统设计，风格理性、稳重、具有科技感。

## 🎯 设计理念

- **主题色**: 企业蓝 (`#1668DC`) - 用于主要交互元素
- **中性色**: 灰色系 - 用于文本、背景、边框
- **侧边栏**: 深色系统 - 稳重的深蓝灰配色
- **功能色**: 
  - 成功 - 绿色 (`#52C41A`)
  - 警告 - 橙色 (`#FAAD14`)
  - 错误 - 红色 (`#FF4D4F`)
  - 信息 - 企业蓝 (`#1668DC`)

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
  background-color: var(--primary);
  color: #FFFFFF;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: var(--motion-duration) var(--motion-ease);
}

.button:hover {
  background-color: var(--primary-hover);
}

/* ❌ 不推荐：硬编码颜色值 */
.button {
  background-color: #1668DC;
  color: #fff;
  border: 1px solid #E5E6EB;
}
```

### 2. 使用组件适配样式

主题文件已经为常用 Ant Design 组件提供了样式适配，直接使用即可：

```tsx
import { Button, Card, Table, Tag, Alert } from 'antd';

// 组件会自动应用主题样式
<Button type="primary">主按钮</Button>
<Card>卡片内容</Card>
<Tag color="success">成功标签</Tag>
```

### 3. 在 JSX 中使用内联样式

```tsx
// React 组件中使用
<div style={{ 
  color: 'var(--text)',
  backgroundColor: 'var(--bg-layout)',
  padding: '24px',
  borderRadius: 'var(--radius)'
}}>
  内容
</div>
```

## 🎨 主要颜色变量

### 主色系（企业蓝）
```css
--primary: #1668DC              /* 主题色 */
--primary-hover: #1A75E8        /* 悬停态 */
--primary-active: #1458B8       /* 激活态 */
--primary-bg: #E8F3FF           /* 浅色背景 */
--primary-border: #91C4F5       /* 边框色 */
```

### 功能色
```css
/* 成功 - 绿色 */
--success: #52C41A
--success-hover: #73D13D
--success-bg: #F6FFED
--success-border: #B7EB8F

/* 警告 - 橙色 */
--warning: #FAAD14
--warning-hover: #FFC53D
--warning-bg: #FFFBE6
--warning-border: #FFE58F

/* 错误 - 红色 */
--error: #FF4D4F
--error-hover: #FF7875
--error-bg: #FFF2F0
--error-border: #FFCCC7

/* 信息 - 企业蓝 */
--info: #1668DC
--info-hover: #1A75E8
--info-bg: #E8F3FF
--info-border: #91C4F5
```

### 中性色（文本）
```css
--text: #1F1F1F                 /* 一级文字 - 深灰 */
--text-secondary: #595959       /* 二级文字 - 中灰 */
--text-tertiary: #8C8C8C        /* 弱文字 - 浅灰 */
--text-disabled: #BFBFBF        /* 禁用文字 - 极浅灰 */
```

### 中性色（背景）
```css
--bg-layout: #F5F7FA            /* 页面背景 */
--bg-container: #FFFFFF         /* 容器背景 - 白色 */
--bg-elevated: #FFFFFF          /* 悬浮背景 - 白色 */
--bg-spotlight: #FAFAFA         /* 高亮背景 - 极浅灰 */
```

### 中性色（边框）
```css
--border: #E5E6EB               /* 边框色 */
--border-secondary: #F0F0F0     /* 分割线 */
```

### 侧边栏深色系统
```css
--sider-bg: #0F1B2D             /* 侧边栏背景 - 深蓝灰 */
--sider-bg-selected: #112A45    /* 选中背景 - 中蓝灰 */
--sider-text: #D6E4FF          /* 文字颜色 - 淡蓝 */
--sider-text-hover: #FFFFFF     /* 悬停文字 - 白色 */
```

## 📐 其他变量

### 字体
```css
--font-size: 14px               /* 基础字号 */
--font-size-sm: 12px           /* 小字号 */
--font-size-lg: 16px           /* 大字号 */
--font-size-xl: 20px           /* 超大字号 */
--line-height: 1.5715          /* 行高 */
```

### 圆角
```css
--radius: 6px                   /* 基础圆角 */
--radius-sm: 4px               /* 小圆角 */
--radius-lg: 8px               /* 大圆角 */
```

### 阴影
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)
--shadow: 0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.03)
--shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15)
```

### 动画
```css
--motion-ease: cubic-bezier(0.645, 0.045, 0.355, 1)
--motion-duration: 0.3s
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **优先使用 CSS 变量**
```css
.error-message {
  color: var(--error);
  font-size: var(--font-size-sm);
  padding: 8px 12px;
  background-color: var(--error-bg);
  border-radius: var(--radius);
}
```

2. **使用语义化变量名**
```css
/* ✅ 好 - 语义清晰 */
color: var(--text-secondary);
background: var(--bg-layout);

/* ❌ 不好 - 难以维护 */
color: #595959;
background: #F5F7FA;
```

3. **组合使用状态色**
```css
.success-tag {
  color: var(--success);
  background-color: var(--success-bg);
  border: 1px solid var(--success-border);
}

.warning-alert {
  color: var(--warning);
  background-color: var(--warning-bg);
  border-left: 4px solid var(--warning);
}
```

4. **使用动画变量保持一致性**
```css
.button {
  transition: var(--motion-duration) var(--motion-ease);
}

.card {
  transition: all var(--motion-duration) var(--motion-ease);
}
```

### ❌ 避免做法

1. **不要硬编码颜色**
```css
/* ❌ 避免 */
.button {
  background-color: #1668DC;
  color: #FFFFFF;
}

/* ✅ 使用变量 */
.button {
  background-color: var(--primary);
  color: #FFFFFF;  /* 纯色可以使用 hex */
}
```

2. **不要混用颜色系统**
```css
/* ❌ 避免混用 */
.card {
  background: #fff;                          /* 硬编码 */
  border: 1px solid var(--border);          /* 变量 */
}

/* ✅ 统一使用变量 */
.card {
  background: var(--bg-container);
  border: 1px solid var(--border);
}
```

3. **不要自定义相似颜色**
```css
/* ❌ 避免 - 创建了新的蓝色 */
.custom-button {
  background: #1890ff;  /* 与主题色不一致 */
}

/* ✅ 使用主题色 */
.custom-button {
  background: var(--primary);
}
```

## 🔄 迁移现有代码

### 步骤 1: 识别硬编码颜色
```bash
# 搜索 hex 颜色代码
grep -r "#[0-9a-fA-F]\{3,6\}" src/
```

### 步骤 2: 查找对应变量

#### 主色系
| 硬编码颜色 | 对应变量 | 用途 |
|-----------|---------|------|
| `#1668DC` | `--primary` | 主题色 |
| `#1A75E8` | `--primary-hover` | 主题色悬停 |
| `#1458B8` | `--primary-active` | 主题色激活 |
| `#E8F3FF` | `--primary-bg` | 主题色背景 |

#### 状态色
| 硬编码颜色 | 对应变量 | 用途 |
|-----------|---------|------|
| `#52C41A` | `--success` | 成功色 |
| `#FAAD14` | `--warning` | 警告色 |
| `#FF4D4F` | `--error` | 错误色 |
| `#F6FFED` | `--success-bg` | 成功背景 |
| `#FFFBE6` | `--warning-bg` | 警告背景 |
| `#FFF2F0` | `--error-bg` | 错误背景 |

#### 中性色
| 硬编码颜色 | 对应变量 | 用途 |
|-----------|---------|------|
| `#FFFFFF`, `#fff` | `#FFFFFF` | 白色（直接使用） |
| `#1F1F1F` | `--text` | 一级文字 |
| `#595959` | `--text-secondary` | 二级文字 |
| `#8C8C8C` | `--text-tertiary` | 弱文字 |
| `#BFBFBF` | `--text-disabled` | 禁用文字 |
| `#F5F7FA` | `--bg-layout` | 页面背景 |
| `#FAFAFA` | `--bg-spotlight` | 高亮背景 |
| `#E5E6EB` | `--border` | 边框色 |
| `#F0F0F0` | `--border-secondary` | 分割线 |

#### 侧边栏
| 硬编码颜色 | 对应变量 | 用途 |
|-----------|---------|------|
| `#0F1B2D` | `--sider-bg` | 侧边栏背景 |
| `#112A45` | `--sider-bg-selected` | 侧边栏选中 |
| `#D6E4FF` | `--sider-text` | 侧边栏文字 |

### 步骤 3: 替换并测试
```css
/* 替换前 */
.error-text {
  color: #FF4D4F;
  background: #FFF2F0;
  border: 1px solid #FFCCC7;
}

/* 替换后 */
.error-text {
  color: var(--error);
  background: var(--error-bg);
  border: 1px solid var(--error-border);
}
```

```css
/* 替换前 */
.page {
  background: #F5F7FA;
  color: #1F1F1F;
}

/* 替换后 */
.page {
  background: var(--bg-layout);
  color: var(--text);
}
```

## 📊 颜色使用场景

### 主题色 `--primary` (#1668DC)
- ✅ 主按钮背景
- ✅ 链接文字
- ✅ 选中状态
- ✅ 品牌元素
- ✅ 进度条
- ✅ 开关激活态
- ✅ 标签页激活指示器

**示例：**
```css
.primary-button {
  background: var(--primary);
  color: #FFFFFF;
}

.active-link {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}
```

### 错误色 `--error` (#FF4D4F)
- ✅ 错误提示文本
- ✅ 表单验证错误
- ✅ 删除按钮（危险操作）
- ✅ 错误状态标签
- ✅ 警告图标

**示例：**
```css
.form-error {
  color: var(--error);
  background: var(--error-bg);
  border-left: 4px solid var(--error);
}

.delete-button {
  color: var(--error);
}
```

### 成功色 `--success` (#52C41A)
- ✅ 成功提示
- ✅ 完成状态
- ✅ 正向操作反馈
- ✅ 绿色标签

**示例：**
```css
.success-message {
  color: var(--success);
  background: var(--success-bg);
}
```

### 警告色 `--warning` (#FAAD14)
- ✅ 警告提示
- ✅ 注意事项
- ✅ 待审核状态
- ✅ 橙色标签

**示例：**
```css
.warning-banner {
  color: var(--warning);
  background: var(--warning-bg);
  border: 1px solid var(--warning-border);
}
```

### 中性色使用场景

**页面布局：**
```css
.page-layout {
  background: var(--bg-layout);      /* 页面大背景 */
}

.content-card {
  background: var(--bg-container);   /* 内容卡片背景 */
  border: 1px solid var(--border);
}

.hover-row:hover {
  background: var(--bg-spotlight);   /* 悬停高亮 */
}
```

**文本层次：**
```css
.title {
  color: var(--text);                /* 一级标题 */
  font-size: var(--font-size-xl);
}

.description {
  color: var(--text-secondary);      /* 二级文本 */
}

.meta {
  color: var(--text-tertiary);       /* 弱提示文本 */
}

.disabled-text {
  color: var(--text-disabled);       /* 禁用状态 */
}
```

### 侧边栏深色系统

适用于导航菜单、Sider 组件：

```css
.sidebar {
  background: var(--sider-bg);
}

.menu-item {
  color: var(--sider-text);
}

.menu-item:hover {
  color: var(--sider-text-hover);
}

.menu-item-selected {
  background: var(--sider-bg-selected);
  color: var(--sider-text-hover);
}
```

## 🌓 未来扩展：深色模式

可以通过媒体查询或 class 切换实现深色模式：

```css
/* 方案 1: 媒体查询 */
@media (prefers-color-scheme: dark) {
  :root {
    --primary: #1A75E8;
    --bg-layout: #141414;
    --bg-container: #1F1F1F;
    --text: rgba(255, 255, 255, 0.85);
    --text-secondary: rgba(255, 255, 255, 0.65);
    --border: #434343;
    /* ... 其他深色主题变量 */
  }
}

/* 方案 2: class 切换 */
.dark-mode {
  --primary: #1A75E8;
  --bg-layout: #141414;
  --bg-container: #1F1F1F;
  --text: rgba(255, 255, 255, 0.85);
  /* ... */
}
```

## 💡 进阶技巧

### 1. 组合变量创建新样式
```css
.info-box {
  color: var(--primary);
  background: var(--primary-bg);
  border-left: 4px solid var(--primary);
  border-radius: var(--radius);
  padding: 12px 16px;
}
```

### 2. 使用 calc() 进行计算
```css
.hover-card {
  transition: var(--motion-duration) var(--motion-ease);
  box-shadow: var(--shadow);
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### 3. 响应式调整
```css
@media (max-width: 768px) {
  :root {
    --font-size: 13px;
    --font-size-lg: 15px;
  }
}
```

## 🔍 常见问题

### Q: 什么时候用变量，什么时候用硬编码？
**A:** 
- ✅ 使用变量：所有主题相关的颜色（主题色、状态色、文本色、背景色、边框色）
- ✅ 硬编码：纯白色 `#FFFFFF` 或纯黑色 `#000000` 在不需要主题切换时可以直接使用
- ❌ 避免硬编码：任何其他颜色值

### Q: 如何为新组件选择合适的颜色？
**A:** 遵循以下优先级：
1. 先查看是否有现成的状态色（success/warning/error/info）
2. 使用主题色 `--primary` 系列
3. 使用中性色（text/bg/border 系列）
4. 如需特殊颜色，应该添加到 theme.css 而不是单独定义

### Q: 变量名太长怎么办？
**A:** 当前的简洁命名已经优化：
```css
/* ✅ 当前命名 - 简洁清晰 */
var(--primary)
var(--text-secondary)
var(--bg-layout)

/* 已弃用的冗长命名 */
var(--primary-color)
var(--text-color-secondary)
var(--background-color-base)
```

## 📚 参考资源

- [Ant Design v5 Design Token](https://ant.design/docs/react/customize-theme-cn)
- [Ant Design 色彩系统](https://ant.design/docs/spec/colors-cn)
- [CSS Variables (MDN)](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [企业级 UI 设计规范](https://ant.design/docs/spec/overview-cn)

---

**项目**: 易宿酒店预定平台 - 商家后台管理系统  
**更新日期**: 2026-02-14  
**版本**: v2.0.0 - 企业级主题升级
