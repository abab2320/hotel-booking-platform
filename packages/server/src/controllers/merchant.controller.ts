import { Request, Response } from 'express';
import { Hotel, RoomType } from '../models';

// 新增酒店
export const createHotel = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { nameZh, nameEn, address, city, star, openDate, images, facilities, tags, nearbyAttractions, nearbyTransport, description } = req.body;
        if (!nameZh) return res.status(400).json({ code: 1, message: '酒店名称必填' });
        const hotel = await Hotel.create({
            merchantId,
            nameZh,
            nameEn,
            address,
            city,
            star,
            openDate,
            images,
            facilities,
            tags,
            nearbyAttractions,
            nearbyTransport,
            description,
            status: 'draft'
        });
        res.json({ code: 0, message: '酒店创建成功', data: hotel });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 获取我的酒店列表
export const getMyHotels = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { status, page = 1, pageSize = 10 } = req.query;
        const where: any = { merchantId };
        if (status) where.status = status;
        const offset = (Number(page) - 1) * Number(pageSize);
        const { count, rows } = await Hotel.findAndCountAll({
            where,
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

// 获取我的酒店详情
export const getHotelDetail = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { id } = req.params;
        const hotel = await Hotel.findOne({ where: { id, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        res.json({ code: 0, data: hotel });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 编辑酒店
export const updateHotel = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { id } = req.params;
        const hotel = await Hotel.findOne({ where: { id, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'draft') return res.status(400).json({ code: 1, message: '仅草稿酒店可编辑' });
        await hotel.update(req.body);
        res.json({ code: 0, message: '酒店更新成功', data: { id: hotel.id, status: hotel.status } });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 删除酒店
export const deleteHotel = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { id } = req.params;
        const hotel = await Hotel.findOne({ where: { id, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'draft') return res.status(400).json({ code: 1, message: '仅草稿酒店可删除' });
        await hotel.destroy();
        res.json({ code: 0, message: '酒店删除成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 获取房型列表
export const getRoomTypes = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { hotelId } = req.params;
        const hotel = await Hotel.findOne({ where: { id: hotelId, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        const rooms = await RoomType.findAll({ 
            where: { hotelId },
            order: [['createdAt', 'DESC']]
        });
        res.json({ code: 0, message: 'success', data: rooms });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 添加房型
export const createRoom = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { hotelId } = req.params;
        const hotel = await Hotel.findOne({ where: { id: hotelId, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        
        // 创建房型时，自动设置 availableRooms = totalRooms
        const roomData = {
            ...req.body,
            hotelId,
            availableRooms: req.body.totalRooms || 0
        };
        
        const room = await RoomType.create(roomData);
        res.json({ code: 0, message: '房型创建成功', data: room });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 编辑房型
export const updateRoom = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { hotelId, roomId } = req.params;
        const hotel = await Hotel.findOne({ where: { id: hotelId, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        const room = await RoomType.findOne({ where: { id: roomId, hotelId } });
        if (!room) return res.status(404).json({ code: 1, message: '房型不存在' });
        await room.update(req.body);
        res.json({ code: 0, message: '房型更新成功', data: { id: room.id } });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 删除房型
export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { hotelId, roomId } = req.params;
        const hotel = await Hotel.findOne({ where: { id: hotelId, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        const room = await RoomType.findOne({ where: { id: roomId, hotelId } });
        if (!room) return res.status(404).json({ code: 1, message: '房型不存在' });
        await room.destroy();
        res.json({ code: 0, message: '房型删除成功' });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 提交酒店审核（草稿 -> pending）
export const submitHotel = async (req: Request, res: Response) => {
    try {
        const merchantId = (req as any).user?.id;
        const { id } = req.params;
        const hotel = await Hotel.findOne({ where: { id, merchantId } });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        if (hotel.status !== 'draft') return res.status(400).json({ code: 1, message: '仅草稿酒店可提交审核' });

        // 可以在这里进行必要的字段校验，确保提交审核的酒店信息完整
        await hotel.update({ status: 'pending' });
        res.json({ code: 0, message: '已提交审核', data: { id: hotel.id, status: hotel.status } });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};