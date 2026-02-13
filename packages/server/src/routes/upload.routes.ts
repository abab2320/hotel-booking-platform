import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadImage } from '../controllers/upload.controller';
import authMiddleware from '../middleware/auth.middleware';

// 创建 uploads 目录（如不存在）
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 配置
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const timestamp = Date.now();
        cb(null, `${basename}_${timestamp}${ext}`);
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('仅支持 jpg/png/webp 格式'), false);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const router = Router();
router.post('/image', authMiddleware, upload.single('file'), uploadImage);

export default router;