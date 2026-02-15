import dotenv from 'dotenv';

dotenv.config();
const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}/api/v1`;

async function api(path: string, opts: any = {}) {
    const url = `${BASE}${path}`;
    const res = await fetch(url, opts);
    const txt = await res.text();
    try { return { status: res.status, body: JSON.parse(txt) }; } catch { return { status: res.status, body: txt }; }
}

async function main() {
    // 酒店列表
    const list = await api('/hotels', { method: 'GET' });
    console.log('Hotels:', list.body);
    if (!list.body || list.body.code !== 0) return;
    const first = list.body.data.list && list.body.data.list[0];
    if (!first) {
        console.log('No hotels to inspect');
        return;
    }
    const id = first.id;
    // 酒店详情
    console.log(`Get hotel ${id} detail`);
    const detail = await api(`/hotels/${id}`, { method: 'GET' });
    console.log('Detail:', detail.body);
    // 房型列表
    console.log(`Get hotel ${id} rooms`);
    const rooms = await api(`/hotels/${id}/rooms`, { method: 'GET' });
    console.log('Rooms:', rooms.body);

    // banner
    const banners = await api('/banners', { method: 'GET' });
    console.log('Banners:', banners.body);

    // 城市列表
    const cities = await api('/cities', { method: 'GET' });
    console.log('Cities:', cities.body);
}

main().catch(err => { console.error(err); process.exit(1); });
