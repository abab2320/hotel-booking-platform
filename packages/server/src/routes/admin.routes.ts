import { Router } from 'express';
import {
    getPendingHotels,
    getHotelDetail,
    approveHotel,
    rejectHotel,
    publishHotel,
    offlineHotel,
    restoreHotel,
    getRoomTypes
} from '../controllers/admin.controller';
import authMiddleware from '../middleware/auth.middleware';
// 角色校验中间件（可复用）
const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ code: 403, message: '无权访问此资源' });
    }
    next();
};

const router = Router();
router.use(authMiddleware, requireRole(['admin']));

router.get('/hotels/pending', getPendingHotels);
router.get('/hotels/:id', getHotelDetail);
router.post('/hotels/:id/approve', approveHotel);
router.post('/hotels/:id/reject', rejectHotel);
router.post('/hotels/:id/publish', publishHotel);
router.post('/hotels/:id/offline', offlineHotel);
router.post('/hotels/:id/restore', restoreHotel);
router.get('/hotels/:hotelId/rooms', getRoomTypes);

export default router;