import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import merchantRoutes from './routes/merchant.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';
// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 测试路由
app.get('/api/v1/health', (req, res) => {
    res.json({
        code: 0,
        message: '服务器正在运行',
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`✅ 服务器启动成功：http://localhost:${PORT}`);
});

// 注册认证路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/merchant', merchantRoutes);

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);