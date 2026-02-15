import dotenv from 'dotenv';

dotenv.config();

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/api/v1`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PWD = process.env.ADMIN_PASSWORD || 'AdminPass1!';

async function request(path: string, options: any = {}) {
    const url = `${BASE}${path}`;
    const res = await fetch(url, options);
    const text = await res.text();
    try {
        return { status: res.status, body: JSON.parse(text) };
    } catch (e) {
        return { status: res.status, body: text };
    }
}

async function main() {
    try {
        console.log('Login as admin:', ADMIN_EMAIL);
        const login = await request('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PWD })
        });
        console.log('Login response:', login.status, login.body);
        if (!login.body || login.body.code !== 0) {
            console.error('Admin login failed, aborting');
            process.exit(1);
        }
        const token = login.body.data.token;

        const hotelId = process.argv[2] || '1';

        // 审核通过
        console.log(`Approve hotel ${hotelId}`);
        const approve = await request(`/admin/hotels/${hotelId}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        console.log('Approve response:', approve.status, approve.body);

        // 拒绝审核
        console.log(`Reject hotel ${hotelId}`);
        const reject = await request(`/admin/hotels/${hotelId}/reject`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        console.log('Reject response:', reject.status, reject.body);

        // 下线酒店
        console.log(`Offline hotel ${hotelId}`);
        const offline = await request(`/admin/hotels/${hotelId}/offline`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        console.log('Offline response:', offline.status, offline.body);

        // 恢复酒店
        console.log(`Restore hotel ${hotelId}`);
        const restore = await request(`/admin/hotels/${hotelId}/restore`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        console.log('Restore response:', restore.status, restore.body);

        // 发布酒店
        console.log(`Publish hotel ${hotelId}`);
        const publish = await request(`/admin/hotels/${hotelId}/publish`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        console.log('Publish response:', publish.status, publish.body);

        // 酒店详情
        console.log(`Get hotel ${hotelId} detail`);
        const detail = await request(`/admin/hotels/${hotelId}`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
        console.log('Detail response:', detail.status, detail.body);

        console.log('Done');
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error in admin-approval-test:', err);
        process.exit(1);
    }
}

main();
