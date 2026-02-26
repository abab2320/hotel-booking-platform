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
  return request.delete<void>(`/merchant/hotels/${id}`);
};

/** 提交审核 */
// TODO: 后端未实现此接口，需要后端添加 PUT /merchant/hotels/:id 并在请求体中设置 status: 'pending'
export const submitHotelForReview = (id: number) => {
  // 临时方案：使用更新接口修改状态为 pending
  return request.put(`/merchant/hotels/${id}`, { status: 'pending' });
};

// ==================== 管理员端接口 ====================

export interface AdminHotelListParams extends PaginationParams {
  status?: HotelStatus;
  keyword?: string;
}

/** 获取所有酒店列表(管理员) */
// TODO: 后端未实现此接口，需要后端添加 GET /admin/hotels 路由
// 临时方案：如果需要所有酒店，可以不传 status 参数调用 getPendingHotels 或在后端添加此接口
export const getAdminHotels = (params?: AdminHotelListParams) => {
  // 暂时使用 pending 接口，后端需要实现完整的酒店列表接口
  return request.get<PageData<Hotel>>('/admin/hotels/pending', { params });
};

/** 获取待审核酒店列表(管理员) - 支持状态筛选 */
export const getPendingHotels = (params?: AdminHotelListParams) => {
  return request.get<PageData<Hotel>>('/admin/hotels/pending', { params });
};

/** 获取酒店详情(管理员) */
export const getAdminHotelDetail = (id: number) => {
  return request.get<Hotel>(`/admin/hotels/${id}`);
};

/** 审核通过 */
export const approveHotel = (id: number) => {
  return request.post<void>(`/admin/hotels/${id}/approve`);
};

/** 审核拒绝 */
export const rejectHotel = (id: number, rejectReason: string) => {
  return request.post<void>(`/admin/hotels/${id}/reject`, { rejectReason });
};

/** 发布上线 */
export const publishHotel = (id: number) => {
  return request.post<void>(`/admin/hotels/${id}/publish`);
};

/** 下线酒店 */
export const offlineHotel = (id: number) => {
  return request.post<void>(`/admin/hotels/${id}/offline`);
};

/** 恢复上线 */
export const restoreHotel = (id: number) => {
  return request.post<void>(`/admin/hotels/${id}/restore`);
};
