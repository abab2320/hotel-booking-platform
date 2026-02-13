import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// 简单的邮件发送占位（此函数应替换为真实发送实现）
async function sendVerificationEmail(email: string, token: string) {
    // TODO: 集成真实邮件服务（SMTP / SendGrid / SES 等）
    // 目前仅在控制台打印，方便本地开发调试
    // eslint-disable-next-line no-console
    console.log(`Send verification to ${email}: http://localhost:3000/api/v1/auth/verify?token=${token}`);
}

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ code: 1, message: 'username、email 和 password 为必填项' });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ code: 1, message: '邮箱已被占用' });

        const user = await User.create({ username, email, password, role: role || 'merchant' });

        // 生成并发送验证邮件
        const token = await (user as any).generateVerificationToken?.();
        if (token) await sendVerificationEmail(user.email, token);

        return res.json({
            code: 0,
            message: '注册成功，已发送验证邮件（开发环境会在控制台打印）',
            data: { id: user.id, username: user.username, email: user.email }
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

export const verify = async (req: Request, res: Response) => {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') return res.status(400).json({ code: 1, message: '缺少 token' });

        const user = await User.findOne({ where: { verificationToken: token } });
        if (!user) return res.status(400).json({ code: 1, message: '无效的 token' });

        if (user.verificationExpires && user.verificationExpires.getTime() < Date.now()) {
            return res.status(400).json({ code: 1, message: 'token 已过期，请重新发送验证邮件' });
        }

        user.emailVerified = true;
        await (user as any).clearVerification?.();

        return res.json({ code: 0, message: '邮箱验证成功' });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

export const resendVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ code: 1, message: '缺少 email' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ code: 1, message: '用户不存在' });
        if (user.emailVerified) return res.status(400).json({ code: 1, message: '邮箱已验证' });

        // 节流：60 秒内不允许重复发送
        const now = Date.now();
        if (user.lastVerificationSentAt && (now - user.lastVerificationSentAt.getTime()) < 60 * 1000) {
            return res.status(429).json({ code: 1, message: '请稍后再试（发送频率过快）' });
        }

        const token = await (user as any).generateVerificationToken?.();
        if (token) await sendVerificationEmail(user.email, token);

        return res.json({ code: 0, message: '已重新发送验证邮件（开发环境会在控制台打印）' });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ code: 1, message: 'email 和 password 为必填项' });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ code: 401, message: '邮箱或密码错误' });

        const isValid = await (user as any).comparePassword(password);
        if (!isValid) return res.status(401).json({ code: 401, message: '邮箱或密码错误' });

        if (!user.emailVerified) return res.status(403).json({ code: 403, message: '请先完成邮箱验证' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

        return res.json({ code: 0, message: '登录成功', data: { token, user: { id: user.id, email: user.email, username: user.username, role: user.role } } });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

export const profile = async (req: Request, res: Response) => {
    try {
        // 假设 auth 中间件已把 req.user 填充为解码后的 token
        const userId = (req as any).user?.id;
        if (!userId) return res.status(401).json({ code: 401, message: '未授权' });

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ code: 1, message: '用户不存在' });

        return res.json({ code: 0, data: { id: user.id, username: user.username, email: user.email, role: user.role, emailVerified: user.emailVerified } });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        return res.status(500).json({ code: 500, message: '服务器错误' });
    }
};
