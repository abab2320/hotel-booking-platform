import { Router } from 'express';
import {
    createHotel,
    getMyHotels,
    getHotelDetail,
    updateHotel,
    deleteHotel,
    createRoom,
    updateRoom,
    deleteRoom
} from '../controllers/merchant.controller';
import authMiddleware from '../middleware/auth.middleware';
// 角色校验中间件（需实现）
const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ code: 403, message: '无权访问此资源' });
    }
    next();
};

const router = Router();
router.use(authMiddleware, requireRole(['merchant']));

router.post('/hotels', createHotel);
router.get('/hotels', getMyHotels);
router.get('/hotels/:id', getHotelDetail);
router.put('/hotels/:id', updateHotel);
router.delete('/hotels/:id', deleteHotel);

router.post('/hotels/:hotelId/rooms', createRoom);
router.put('/hotels/:hotelId/rooms/:roomId', updateRoom);
router.delete('/hotels/:hotelId/rooms/:roomId', deleteRoom);

export default router;