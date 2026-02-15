import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const header = req.headers.authorization as string | undefined;
        const token = header?.startsWith('Bearer ') ? header.slice(7) : header;
        if (!token) return res.status(401).json({ code: 401, message: '未提供 token' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded as any;
        next();
    } catch (err) {
        return res.status(401).json({ code: 401, message: 'Token 无效或已过期' });
    }
};

export default authMiddleware;