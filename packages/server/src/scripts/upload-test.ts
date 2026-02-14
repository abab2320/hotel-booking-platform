import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';

dotenv.config();
const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/api/v1`;
const UPLOAD_FILE = process.env.UPLOAD_TEST_FILE || path.join(__dirname, '../../uploads/test1.jpg');

async function api(path: string, opts: any = {}) {
    const url = `${BASE}${path}`;
    const res = await fetch(url, opts);
    const txt = await res.text();
    try { return { status: res.status, body: JSON.parse(txt) }; } catch { return { status: res.status, body: txt }; }
}

async function main() {
    if (!fs.existsSync(UPLOAD_FILE)) {
        console.error('Upload test file not found:', UPLOAD_FILE);
        process.exit(1);
    }

    // Need token for auth; try to get from env, otherwise login with test credentials
    let token = process.env.TEST_TOKEN || '';
    if (!token) {
        const email = process.env.TEST_USER_EMAIL || process.env.MERCHANT_EMAIL || 'test4@example.com';
        const password = process.env.TEST_USER_PWD || process.env.MERCHANT_PWD || 'Password123!';
        console.log('No TEST_TOKEN provided — logging in as', email);
        const loginRes = await api('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        if (loginRes && loginRes.body && loginRes.body.code === 0) {
            token = loginRes.body.data.token;
            console.log('Obtained token from login');
        } else {
            console.error('Login failed, cannot upload:', loginRes && loginRes.body ? loginRes.body : loginRes);
            process.exit(1);
        }
    }
    const form = new FormData();
    form.append('file', fs.createReadStream(UPLOAD_FILE));

    const headers: any = (form as any).getHeaders ? (form as any).getHeaders() : {};
    headers.Authorization = `Bearer ${token}`;

    console.log('Uploading file:', UPLOAD_FILE);
    const res = await axios.post(`${BASE}/upload/image`, form, { headers, maxContentLength: Infinity, maxBodyLength: Infinity });
    console.log('Upload response:', res.data);
}

main().catch(err => { console.error(err); process.exit(1); });
