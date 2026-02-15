import { Banner, City } from '../models';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Hotel, RoomType } from '../models';

// 获取 Banner 列表
export const getBanners = async (req: Request, res: Response) => {
    try {
        const banners = await Banner.findAll();
        res.json({ code: 0, message: 'success', data: banners });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 获取城市列表
export const getCities = async (req: Request, res: Response) => {
    try {
        const { hot } = req.query;
        const where: any = {};
        if (hot) where.hot = true;
        const cities = await City.findAll({ where });
        res.json({ code: 0, message: 'success', data: cities });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 获取酒店列表
export const getHotels = async (req: Request, res: Response) => {
    try {
        const {
            city,
            star,
            minPrice,
            maxPrice,
            keyword,
            tags,
            page = 1,
            pageSize = 10
        } = req.query;
        const where: any = { status: 'published' };
        if (city) where.city = city;
        if (star) where.star = { [Op.in]: (star as string).split(',').map(Number) };
        if (minPrice) where.minPrice = { [Op.gte]: Number(minPrice) };
        if (maxPrice) where.maxPrice = { [Op.lte]: Number(maxPrice) };
        if (keyword) where.nameZh = { [Op.like]: `%${keyword}%` };
        // 分页
        const offset = (Number(page) - 1) * Number(pageSize);
        const { count, rows } = await Hotel.findAndCountAll({
            where,
            include: [{ model: RoomType, as: 'rooms' }],
            offset,
            limit: Number(pageSize),
            order: [['createdAt', 'DESC']]
        });
        res.json({
            code: 0,
            message: 'success',
            data: {
                list: rows.map(hotel => {
                    const rooms = (hotel as any).rooms || [];
                    const prices = rooms.map((r: any) => Number(r.price) || 0);
                    const minPrice = prices.length ? Math.min(...prices) : 0;
                    const maxPrice = prices.length ? Math.max(...prices) : 0;
                    return {
                        id: hotel.id,
                        nameZh: hotel.nameZh,
                        city: hotel.city,
                        star: hotel.star,
                        images: hotel.images,
                        minPrice,
                        maxPrice
                    };
                }),
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

// 获取酒店详情
export const getHotelDetail = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const hotel = await Hotel.findByPk(id, { include: [{ model: RoomType, as: 'rooms' }] });
        if (!hotel) return res.status(404).json({ code: 1, message: '酒店不存在' });
        res.json({ code: 0, message: 'success', data: hotel });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};

// 获取酒店房型列表
export const getHotelRooms = async (req: Request, res: Response) => {
    try {
        let { id } = req.params;
        id = Array.isArray(id) ? id[0] : id;
        const rooms = await RoomType.findAll({ where: { hotelId: id } });
        res.json({ code: 0, message: 'success', data: { list: rooms } });
    } catch (error) {
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
};