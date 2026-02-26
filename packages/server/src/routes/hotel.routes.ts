import { Router } from 'express';
import { getHotels, getHotelDetail, getHotelRooms, getBanners, getCities } from '../controllers/hotel.controller';

const router = Router();

// 酒店列表
router.get('/', getHotels);
// 酒店详情
router.get('/:id', getHotelDetail);
// 酒店房型列表
router.get('/:id/rooms', getHotelRooms);

// Banner 列表
router.get('/banners', getBanners);

// 城市列表
router.get('/cities', getCities);

export default router;
