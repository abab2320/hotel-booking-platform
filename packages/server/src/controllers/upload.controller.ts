import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ code: 1, message: '未上传文件' });
        }
        // 文件信息
        const { filename, size, mimetype } = req.file;
        const url = `/uploads/${filename}`;
        res.json({
            code: 0,
            message: '上传成功',
            data: {
                url,
                filename,
                size,
                uploadedAt: new Date().toISOString(),
                mimetype
            }
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};