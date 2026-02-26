import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import merchantRoutes from './routes/merchant.routes';
import hotelRoutes from './routes/hotel.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';
import { setupAssociations, sequelize } from './models';
import { testConnection } from './config/database';
import errorHandler from './middleware/error.middleware';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件（上传文件）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 测试路由
app.get('/api/v1/health', (req, res) => {
    res.json({
        code: 0,
        message: '服务器正在运行',
        timestamp: new Date().toISOString()
    });
});

// 注册路由
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/merchant', merchantRoutes);
app.use('/api/v1/hotels', hotelRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);

// 全局错误处理
app.use(errorHandler);

// 启动服务器
async function start() {
    try {
        await testConnection();
        setupAssociations();
        app.listen(PORT, () => {
            console.log('✅ 数据库连接成功');
            console.log(`✅ 服务器启动成功：http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ 启动失败:', error);
        process.exit(1);
    }
}

start();