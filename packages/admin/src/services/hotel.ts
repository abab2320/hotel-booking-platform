import request from '@/utils/request';
import type {
  Hotel,
  HotelFormData,
  HotelStatus,
  PageData,
  PaginationParams,
} from '@/types';

// ==================== 商户端接口 ====================

export interface MerchantHotelListParams extends PaginationParams {
  status?: HotelStatus;
}

/** 获取我的酒店列表 */
export const getMerchantHotels = (params?: MerchantHotelListParams) => {
  return request.get<PageData<Hotel>>('/merchant/hotels', { params });
};

/** 获取酒店详情 */
export const getMerchantHotelDetail = (id: number) => {
  return request.get<Hotel>(`/merchant/hotels/${id}`);
};

/** 新增酒店 */
export const createHotel = (data: HotelFormData) => {
  return request.post<Hotel>('/merchant/hotels', data);
};

/** 更新酒店 */
export const updateHotel = (id: number, data: HotelFormData) => {
  return request.put<Hotel>(`/merchant/hotels/${id}`, data);
};

/** 删除酒店 */
export const deleteHotel = (id: number) => {
  return request.delete(`/merchant/hotels/${id}`);
};

/** 提交审核 */
export const submitHotelForReview = (id: number) => {
  return request.post(`/merchant/hotels/${id}/submit`);
};

// ==================== 管理员端接口 ====================

export interface AdminHotelListParams extends PaginationParams {
  status?: HotelStatus;
  keyword?: string;
}

/** 获取所有酒店列表(管理员) */
export const getAdminHotels = (params?: AdminHotelListParams) => {
  return request.get<PageData<Hotel>>('/admin/hotels', { params });
};

/** 获取酒店详情(管理员) */
export const getAdminHotelDetail = (id: number) => {
  return request.get<Hotel>(`/admin/hotels/${id}`);
};

/** 审核通过 */
export const approveHotel = (id: number) => {
  return request.post(`/admin/hotels/${id}/approve`);
};

/** 审核拒绝 */
export const rejectHotel = (id: number, reason: string) => {
  return request.post(`/admin/hotels/${id}/reject`, { reason });
};

/** 发布上线 */
export const publishHotel = (id: number) => {
  return request.post(`/admin/hotels/${id}/publish`);
};

/** 下线酒店 */
export const offlineHotel = (id: number) => {
  return request.post(`/admin/hotels/${id}/offline`);
};

/** 恢复上线 */
export const onlineHotel = (id: number) => {
  return request.post(`/admin/hotels/${id}/online`);
};
