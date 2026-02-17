/**
 * Mock 数据 - 用于开发测试
 * 当后端 API 未就绪时，可以使用此文件的模拟数据
 */

import type { Hotel, HotelStatus, HotelStar } from '@/types';

/** 生成随机酒店数据 */
export const generateMockHotel = (id: number, status?: HotelStatus): Hotel => {
  const statuses: HotelStatus[] = ['draft', 'pending', 'approved', 'rejected', 'published', 'offline'];
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '西安'];
  const stars: HotelStar[] = [1, 2, 3, 4, 5];
  
  const randomStatus = status || statuses[Math.floor(Math.random() * statuses.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomStar = stars[Math.floor(Math.random() * stars.length)];
  
  return {
    id,
    merchantId: 1,
    nameZh: `${randomCity}测试酒店${id}号`,
    nameEn: `Test Hotel ${id} in ${randomCity}`,
    address: `${randomCity}市测试区测试街道${id}号`,
    city: randomCity,
    star: randomStar,
    openDate: `202${Math.floor(Math.random() * 4)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    ],
    facilities: ['wifi', 'parking', 'pool', 'gym'],
    tags: ['business', 'luxury'],
    nearbyAttractions: '距离市中心3公里，距离火车站5公里',
    nearbyTransport: '地铁1号线测试站步行10分钟',
    description: '这是一家位于市中心的高端商务酒店，提供优质的住宿服务。',
    rating: 4.5,
    status: randomStatus,
    rejectReason: randomStatus === 'rejected' ? '酒店图片不清晰，请重新上传高清图片' : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/** Mock 酒店列表数据 */
export const mockHotelList: Hotel[] = Array.from({ length: 25 }, (_, i) => generateMockHotel(i + 1));

/** 获取 Mock 酒店列表（支持分页） */
export const getMockHotelList = (params?: {
  page?: number;
  pageSize?: number;
  status?: HotelStatus;
}) => {
  const { page = 1, pageSize = 10, status } = params || {};
  
  // 根据状态筛选
  let filteredList = status 
    ? mockHotelList.filter(hotel => hotel.status === status)
    : mockHotelList;
  
  // 计算分页
  const total = filteredList.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredList.slice(start, end);
  
  return {
    list,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
};

/** Mock 删除酒店 */
export const mockDeleteHotel = (id: number) => {
  const index = mockHotelList.findIndex(hotel => hotel.id === id);
  if (index > -1) {
    mockHotelList.splice(index, 1);
    return { success: true, message: '删除成功' };
  }
  return { success: false, message: '酒店不存在' };
};

/** Mock 提交审核 */
export const mockSubmitHotelForReview = (id: number) => {
  const hotel = mockHotelList.find(hotel => hotel.id === id);
  if (hotel) {
    hotel.status = 'pending';
    hotel.updatedAt = new Date().toISOString();
    return { success: true, message: '已提交审核' };
  }
  return { success: false, message: '酒店不存在' };
};

// 导出 Mock 数据供测试使用
export default {
  mockHotelList,
  getMockHotelList,
  mockDeleteHotel,
  mockSubmitHotelForReview,
  generateMockHotel,
};
