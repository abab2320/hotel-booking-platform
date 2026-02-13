import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Hotel, RoomType } from '../models';

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

        // 构建查询条件
        const where: any = { status: 'published' };

        if (city) where.city = city;
        if (star) where.star = { [Op.in]: (star as string).split(',').map(Number) };

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