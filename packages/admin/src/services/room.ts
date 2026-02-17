import request from '@/utils/request';
import type { RoomType, RoomFormData } from '@/types';

/** 获取酒店房型列表 */
export const getRoomTypes = (hotelId: number) => {
  return request.get<RoomType[]>(`/merchant/hotels/${hotelId}/rooms`);
};

/** 添加房型 */
export const createRoom = (hotelId: number, data: RoomFormData) => {
  return request.post<RoomType>(`/merchant/hotels/${hotelId}/rooms`, data);
};

/** 更新房型 */
export const updateRoom = (hotelId: number, roomId: number, data: RoomFormData) => {
  return request.put<RoomType>(`/merchant/hotels/${hotelId}/rooms/${roomId}`, data);
};

/** 删除房型 */
export const deleteRoom = (hotelId: number, roomId: number) => {
  return request.delete(`/merchant/hotels/${hotelId}/rooms/${roomId}`);
};
