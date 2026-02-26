import { Request, Response, NextFunction } from 'express';

// 简单字段存在性校验中间件
export const requireFields = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const missing: string[] = [];
        for (const f of fields) {
            const val = (req.body as any)[f];
            if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) missing.push(f);
        }
        if (missing.length) return res.status(400).json({ code: 1, message: `缺少字段: ${missing.join(', ')}` });
        next();
    };
};

export default { requireFields };
