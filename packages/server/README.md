# server

本目录为后端服务（Node.js + Express + TypeScript）。

运行说明（本地开发）：

1. 复制并修改环境变量：

```bash
cp .env.example .env
# 编辑 .env，填写数据库密码与 JWT_SECRET
```

2. 安装依赖并启动（使用 pnpm）：

```bash
pnpm install
pnpm dev
```

3. 初始化数据库（会同步模型并插入示例城市）：

```bash
pnpm exec ts-node src/scripts/init-db.ts
```

4. 常用接口：
- 健康检查：GET /api/v1/health
- 注册：POST /api/v1/auth/register
- 登录：POST /api/v1/auth/login
- 酒店列表：GET /api/v1/hotels

注意：生产环境请使用数据库迁移工具（如 Sequelize CLI / umzug），不要在生产环境使用 `sync({ alter: true })`。
