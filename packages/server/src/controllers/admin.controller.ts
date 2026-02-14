import { Request, Response } from 'express';
import { Hotel, User } from '../models';

// 获取待审核酒店列表
export const getPendingHotels = async (req: Request, res: Response) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (Number(page) - 1) * Number(pageSize);
        const { count, rows } = await Hotel.findAndCountAll({
            where: { status: 'pending' },
            include: [{ model: User, as: 'merchant', attributes: ['id', 'username'] }],
            offset,
            limit: Number(pageSize),
            order: [['createdAt', 'DESC']]
        });
        res.json({
            code: 0,
            message: 'success',
            data: {
                list: rows,
                pagination: {
                    page: Number(page),
                    pageSize: Number(pageSize),
                    total: count,
                    totalPages: Math.ceil(count / Number(pageSize))
                }
            }
        });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 获取酒店审核详情
export const getHotelDetail = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const hotel = await Hotel.findByPk(id, { include: [{ model: User, as: 'merchant', attributes: ['id', 'username'] }] });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        res.json({ code: 0, data: hotel });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 审核通过
export const approveHotel = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'pending') return res.status(400).json({ code: 1, message: '仅待审核酒店可操作' });
        await hotel.update({ status: 'approved' });
        res.json({ code: 0, message: '审核通过' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 审核拒绝
export const rejectHotel = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const { rejectReason } = req.body;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'pending') return res.status(400).json({ code: 1, message: '仅待审核酒店可操作' });
        if (!rejectReason) return res.status(400).json({ code: 1, message: '拒绝原因必填' });
        await hotel.update({ status: 'rejected', rejectReason });
        res.json({ code: 0, message: '审核拒绝' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 发布酒店
export const publishHotel = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'approved') return res.status(400).json({ code: 1, message: '仅审核通过酒店可发布' });
        await hotel.update({ status: 'published' });
        res.json({ code: 0, message: '酒店已发布' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 下线酒店
export const offlineHotel = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'published') return res.status(400).json({ code: 1, message: '仅已发布酒店可下线' });
        await hotel.update({ status: 'offline' });
        res.json({ code: 0, message: '酒店已下线' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 恢复酒店
export const restoreHotel = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'offline') return res.status(400).json({ code: 1, message: '仅下线酒店可恢复' });
        await hotel.update({ status: 'published' });
        res.json({ code: 0, message: '酒店已恢复' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};