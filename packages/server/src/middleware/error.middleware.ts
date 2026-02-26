import { Request, Response, NextFunction } from 'express';

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line no-console
    console.error(err && err.stack ? err.stack : err);
    if (res.headersSent) return next(err);
    const status = err?.status || 500;
    const message = err?.message || '服务器错误';
    res.status(status).json({ code: status === 500 ? 500 : 1, message });
}
