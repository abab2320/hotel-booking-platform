import dotenv from 'dotenv';
import { User, sequelize } from '../models';

dotenv.config();
const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/api/v1`;

async function api(path: string, opts: any = {}) {
    const url = `${BASE}${path}`;
    const res = await fetch(url, opts);
    const txt = await res.text();
    try { return { status: res.status, body: JSON.parse(txt) }; } catch { return { status: res.status, body: txt }; }
}

async function main() {
    await sequelize.authenticate();
    // 注册用户
    const unique = Date.now();
    const email = process.env.TEST_USER_EMAIL || `test.user.${unique}@example.com`;
    const username = `testuser_${unique}`;
    const password = process.env.TEST_USER_PWD || 'Password123!';

    console.log('Registering user:', email);
    const register = await api('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    console.log('Register:', register.body);
    let verifyToken = '';
    if (register.body && register.body.data && register.body.data.verifyToken) {
        verifyToken = register.body.data.verifyToken;
    }

    // 重发验证邮件
    const resend = await api('/auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    console.log('Resend verification:', resend.body);

    // 邮箱验证
    if (verifyToken) {
        const verify = await api(`/auth/verify?token=${verifyToken}`, { method: 'GET' });
        console.log('Verify:', verify.body);
    } else {
        console.log('No verifyToken, skip verify');
    }

    // 登录
    const login = await api('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    console.log('Login:', login.body);
    if (!login.body || login.body.code !== 0) process.exit(1);
    const token = login.body.data.token;

    // 获取profile
    const profile = await api('/auth/profile', { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
    console.log('Profile:', profile.body);

    console.log('Auth flow test completed');
}

main().catch(err => { console.error(err); process.exit(1); });
