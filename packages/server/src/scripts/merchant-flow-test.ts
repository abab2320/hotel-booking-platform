import dotenv from 'dotenv';
import { sequelize, User } from '../models';

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
    const unique = Date.now();
    const email = process.env.MERCHANT_EMAIL || `merchant.${unique}@example.com`;
    const username = `merchant_${unique}`;
    const password = process.env.MERCHANT_PWD || 'Password123!';

    // 创建并验证商户用户
    const [user] = await User.findOrCreate({ where: { email }, defaults: { username, email, password, role: 'merchant', emailVerified: true } });
    if (!user.emailVerified) { user.emailVerified = true; await user.save(); }

    console.log('Logging in merchant...');
    const login = await api('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    console.log('Login:', login.body);
    if (!login.body || login.body.code !== 0) process.exit(1);
    const token = login.body.data.token;

    // 创建酒店
    const hotelData = {
        nameZh: '自动化测试酒店', nameEn: 'AutoTest Hotel', address: '测试地址 1', city: '北京', star: 4, openDate: '2020-01-01', images: [], facilities: [], tags: [], description: '由自动化脚本创建'
    };
    const create = await api('/merchant/hotels', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(hotelData) });
    console.log('Create hotel:', create.body);
    if (!create.body || create.body.code !== 0) process.exit(1);
    const hotelId = create.body.data.id;

    // 查询酒店详情
    const detail = await api(`/merchant/hotels/${hotelId}`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
    console.log('Hotel detail:', detail.body);

    // 更新酒店
    const update = await api(`/merchant/hotels/${hotelId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ nameZh: '更新后的自动化酒店' }) });
    console.log('Update hotel:', update.body);

    // 创建房型
    const room = { name: '测试大床房', price: 299, bedType: 'King', maxGuests: 2, totalRooms: 10, breakfast: 'none' };
    const createRoom = await api(`/merchant/hotels/${hotelId}/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(room) });
    console.log('Create room:', createRoom.body);
    const roomId = createRoom.body.data && createRoom.body.data.id;

    // 更新房型
    if (roomId) {
        const updateRoom = await api(`/merchant/hotels/${hotelId}/rooms/${roomId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ price: 399 }) });
        console.log('Update room:', updateRoom.body);
    }

    // 删除房型
    if (roomId) {
        const deleteRoom = await api(`/merchant/hotels/${hotelId}/rooms/${roomId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        console.log('Delete room:', deleteRoom.body);
    }

    // 提交酒店审核
    const submit = await api(`/merchant/hotels/${hotelId}/submit`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    console.log('Submit hotel:', submit.body);

    // 删除酒店
    const deleteHotel = await api(`/merchant/hotels/${hotelId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    console.log('Delete hotel:', deleteHotel.body);

    // 我的酒店列表
    const list = await api('/merchant/hotels', { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
    console.log('My hotels:', list.body);

    console.log('Merchant flow test completed');
}

main().catch(err => { console.error(err); process.exit(1); });
