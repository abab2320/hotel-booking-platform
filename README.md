# 🏨 易宿酒店预订平台

> 携程前端训练营结营大作业 | 开发周期：17天 (2月7日 - 2月23日)

一个面向现代旅游出行场景的酒店预订综合服务平台，为酒店商家与终端消费者之间搭建高效、便捷的信息交互桥梁。

## 📸 项目预览


## ✨ 功能特性

### 📱 移动端 (用户)
- 🏠 **酒店查询页** - Banner轮播、城市选择、日期日历、多条件筛选
- 📋 **酒店列表页** - 筛选排序、酒店卡片、无限滚动、骨架屏加载
- 🏨 **酒店详情页** - 图片轮播、酒店信息、房型列表展示

### 💻 PC管理端 (商户/管理员)
- 🔐 **登录注册** - 用户认证、角色区分（商户/管理员）
- 📝 **酒店管理** (商户) - 酒店信息录入、编辑、房型管理、图片上传
- ✅ **审核管理** (管理员) - 酒店审核、发布上线、下线管理

### 🖥️ 后端服务
- 用户认证 (JWT)
- 酒店/房型 CRUD
- 文件上传
- 状态流转管理

## 🛠️ 技术栈

| 层级 | 技术选型 |
|------|---------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| 移动端UI | antd-mobile |
| PC端UI | Ant Design 5 |
| 状态管理 | Zustand |
| 路由 | React Router v6 |
| HTTP请求 | Axios |
| 后端服务 | Node.js + Express |
| 数据库 | MySQL + Sequelize |
| 认证方式 | JWT |

## 📁 项目结构

```
hotel-booking-platform/
├── packages/
│   ├── mobile/                 # 📱 移动端 H5
│   │   ├── src/
│   │   │   ├── pages/          # 页面组件
│   │   │   ├── components/     # 通用组件
│   │   │   ├── hooks/          # 自定义hooks
│   │   │   ├── services/       # API服务
│   │   │   ├── store/          # 状态管理
│   │   │   ├── types/          # 类型定义
│   │   │   └── utils/          # 工具函数
│   │   └── package.json
│   │
│   ├── admin/                  # 💻 PC管理端
│   │   ├── src/
│   │   │   ├── pages/          # 页面组件
│   │   │   ├── components/     # 通用组件
│   │   │   ├── services/       # API服务
│   │   │   ├── store/          # 状态管理
│   │   │   ├── types/          # 类型定义
│   │   │   └── utils/          # 工具函数
│   │   └── package.json
│   │
│   └── server/                 # 🖥️ 后端服务
│       ├── src/
│       │   ├── controllers/    # 控制器
│       │   ├── models/         # 数据模型
│       │   ├── routes/         # 路由
│       │   ├── middleware/     # 中间件
│       │   └── config/         # 配置文件
│       └── package.json
│
├── docs/                       # 📚 文档
├── package.json                # Monorepo 根配置
├── pnpm-workspace.yaml         # pnpm workspace配置
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- MySQL >= 8.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/abab2320/hotel-booking-platform.git
cd hotel-booking-platform

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动PC管理端
pnpm dev:admin

# 启动移动端
pnpm dev:mobile

# 启动后端服务
pnpm dev:server
```

### 构建

```bash
# 构建PC管理端
pnpm build:admin

# 构建移动端
pnpm build:mobile
```

## 📡 API 文档

### 基础信息

- **Base URL**: `http://localhost:3000/api/v1`
- **认证方式**: Bearer Token (JWT)

### 主要接口

| 模块 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 认证 | POST | `/auth/register` | 用户注册 |
| 认证 | POST | `/auth/login` | 用户登录 |
| 酒店(用户) | GET | `/hotels` | 获取酒店列表 |
| 酒店(用户) | GET | `/hotels/:id` | 获取酒店详情 |
| 酒店(商户) | GET | `/merchant/hotels` | 获取我的酒店 |
| 酒店(商户) | POST | `/merchant/hotels` | 新增酒店 |
| 酒店(管理员) | GET | `/admin/hotels` | 获取所有酒店 |
| 酒店(管理员) | POST | `/admin/hotels/:id/approve` | 审核通过 |

完整API文档请查看 [docs/PRD-易宿酒店预定平台.md](./docs/PRD-易宿酒店预定平台.md)

## 👥 团队分工

| 成员 | 角色 | 负责模块 |
|------|------|---------|
| 蔡昀燃 | 前端(移动端) | 用户预订系统 - 移动端3个页面 |
| 王雨菲 | 前端(PC端) | 管理后台系统 - PC端页面 |
| 邓方舟 | 后端 | API服务 + 数据库 + 部署 |

## 📋 开发规范

### Git 分支管理

```
main                 # 主分支(生产环境)
├── develop          # 开发分支
├── feature/xxx      # 功能分支
└── fix/xxx          # 修复分支
```

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式(不影响功能)
refactor: 重构
perf: 性能优化
test: 测试
chore: 构建/工具相关

示例:
feat(mobile): 完成日历组件开发
fix(admin): 修复登录状态丢失问题
```

### 代码规范

- 使用 TypeScript 进行类型检查
- 组件使用函数式组件 + Hooks
- 文件命名：组件 PascalCase，其他 camelCase
- 使用 ESLint 进行代码检查

## 📅 里程碑

| 阶段 | 日期 | 目标 |
|------|------|------|
| 第一阶段 | 2/7 - 2/11 | 项目搭建 + 核心页面框架 + 后端API |
| 第二阶段 | 2/12 - 2/17 | 功能开发 + 前后端联调 |
| 第三阶段 | 2/18 - 2/21 | 功能完善 + Bug修复 + 优化 |
| 第四阶段 | 2/22 - 2/23 | 测试 + 部署 + 文档 + 演示准备 |

## 📄 License

MIT License

---

<p align="center">Made with ❤️ by 携程前端训练营</p>
