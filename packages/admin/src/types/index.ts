// ==================== 用户相关类型 ====================

/** 用户角色 */
export type UserRole = 'merchant' | 'admin';

/** 用户信息 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/** 登录请求参数 */
export interface LoginParams {
  email: string;
  password: string;
}

/** 登录响应数据 */
export interface LoginResult {
  token: string;
  user: User;
}

/** 注册请求参数 */
export interface RegisterParams {
  email: string;
  username: string;
  password: string;
  role: UserRole;
}

// ==================== 酒店相关类型 ====================

/** 酒店状态 */
export type HotelStatus =
  | 'draft' // 草稿
  | 'pending' // 审核中
  | 'approved' // 已通过(待发布)
  | 'rejected' // 未通过
  | 'published' // 已发布
  | 'offline'; // 已下线

/** 酒店星级 */
export type HotelStar = 1 | 2 | 3 | 4 | 5;

/** 酒店设施 */
export type HotelFacility =
  | 'wifi'
  | 'parking'
  | 'pool'
  | 'gym'
  | 'restaurant'
  | 'meeting'
  | 'spa'
  | 'laundry';

/** 酒店标签 */
export type HotelTag =
  | 'family'
  | 'business'
  | 'luxury'
  | 'vacation'
  | 'subway'
  | 'breakfast'
  | 'newOpen';

/** 酒店信息 */
export interface Hotel {
  id: number;
  merchantId: number;
  nameZh: string;
  nameEn: string;
  address: string;
  city: string;
  star: HotelStar;
  openDate: string;
  images: string[];
  facilities: HotelFacility[];
  tags: HotelTag[];
  nearbyAttractions?: string;
  nearbyTransport?: string;
  description?: string;
  rating?: number;
  status: HotelStatus;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

/** 创建/更新酒店参数 */
export interface HotelFormData {
  nameZh: string;
  nameEn: string;
  address: string;
  city: string;
  star: HotelStar;
  openDate: string;
  images: string[];
  facilities?: HotelFacility[];
  tags?: HotelTag[];
  nearbyAttractions?: string;
  nearbyTransport?: string;
  description?: string;
}

// ==================== 房型相关类型 ====================

/** 早餐类型 */
export type BreakfastType = 'none' | 'single' | 'double';

/** 房型信息 */
export interface RoomType {
  id: number;
  hotelId: number;
  name: string;
  images: string[];
  bedType: string;
  maxGuests: number;
  area?: number;
  price: number;
  originalPrice?: number;
  breakfast: BreakfastType;
  totalRooms: number;
  availableRooms: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountDesc?: string;
  createdAt: string;
  updatedAt: string;
}

/** 创建/更新房型参数 */
export interface RoomFormData {
  name: string;
  images?: string[];
  bedType: string;
  maxGuests: number;
  area?: number;
  price: number;
  originalPrice?: number;
  breakfast: BreakfastType;
  totalRooms: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountDesc?: string;
}

// ==================== API响应类型 ====================

/** 统一API响应格式 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 分页参数 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** 分页信息 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** 分页响应数据 */
export interface PageData<T> {
  list: T[];
  pagination: Pagination;
}

/** 分页响应 */
export type PageResponse<T> = ApiResponse<PageData<T>>;
