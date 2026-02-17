/**
 * 应用常量定义
 */

import type { HotelStatus, HotelStar } from './index';

// ==================== 酒店相关常量 ====================

/** 酒店状态配置 */
export const HOTEL_STATUS_CONFIG: Record<
  HotelStatus,
  { text: string; color: string; description: string }
> = {
  draft: { 
    text: '草稿', 
    color: 'default', 
    description: '酒店信息尚未完善或未提交审核' 
  },
  pending: { 
    text: '审核中', 
    color: 'processing', 
    description: '已提交审核，等待管理员审核' 
  },
  approved: { 
    text: '已通过', 
    color: 'success', 
    description: '审核已通过，等待发布上线' 
  },
  rejected: { 
    text: '未通过', 
    color: 'error', 
    description: '审核未通过，需要修改后重新提交' 
  },
  published: { 
    text: '已发布', 
    color: 'blue', 
    description: '已在平台上发布，用户可见' 
  },
  offline: { 
    text: '已下线', 
    color: 'warning', 
    description: '已从平台下线，用户不可见' 
  },
};

/** 酒店星级配置 */
export const HOTEL_STAR_OPTIONS: Array<{ label: string; value: HotelStar }> = [
  { label: '一星级', value: 1 },
  { label: '二星级', value: 2 },
  { label: '三星级', value: 3 },
  { label: '四星级', value: 4 },
  { label: '五星级', value: 5 },
];

/** 酒店设施配置 */
export const HOTEL_FACILITY_CONFIG = {
  wifi: { label: '免费WiFi', icon: '📶' },
  parking: { label: '停车场', icon: '🅿️' },
  pool: { label: '游泳池', icon: '🏊' },
  gym: { label: '健身房', icon: '💪' },
  restaurant: { label: '餐厅', icon: '🍽️' },
  meeting: { label: '会议室', icon: '👔' },
  spa: { label: 'SPA', icon: '💆' },
  laundry: { label: '洗衣服务', icon: '👕' },
};

/** 酒店标签配置 */
export const HOTEL_TAG_CONFIG = {
  family: { label: '亲子', color: 'magenta' },
  business: { label: '商务', color: 'blue' },
  luxury: { label: '豪华', color: 'gold' },
  vacation: { label: '度假', color: 'cyan' },
  subway: { label: '地铁周边', color: 'green' },
  breakfast: { label: '含早餐', color: 'orange' },
  newOpen: { label: '新开业', color: 'red' },
};

// ==================== 路由路径常量 ====================

export const ROUTES = {
  // 公共路由
  LOGIN: '/login',
  REGISTER: '/register',
  
  // 商户端路由
  MERCHANT: {
    HOTELS: '/merchant/hotels',
    HOTEL_NEW: '/merchant/hotels/new',
    HOTEL_DETAIL: (id: number | string) => `/merchant/hotels/${id}`,
    HOTEL_EDIT: (id: number | string) => `/merchant/hotels/${id}/edit`,
  },
  
  // 管理员路由
  ADMIN: {
    HOTELS: '/admin/hotels',
    HOTEL_DETAIL: (id: number | string) => `/admin/hotels/${id}`,
  },
};

// ==================== 本地存储键名 ====================

export const STORAGE_KEYS = {
  TOKEN: 'hotel_token',
  USER_INFO: 'hotel_user_info',
};

// ==================== 业务配置常量 ====================

/** 图片上传配置 */
export const UPLOAD_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_COUNT: 10, // 最多上传10张
  ACCEPT: 'image/jpeg,image/jpg,image/png,image/webp',
  ACCEPT_TEXT: 'JPG、PNG、WEBP',
};

/** 分页配置 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

/** 表单验证规则 */
export const FORM_RULES = {
  HOTEL_NAME_ZH: {
    required: true,
    message: '请输入酒店中文名称',
    min: 2,
    max: 50,
  },
  HOTEL_NAME_EN: {
    required: true,
    message: '请输入酒店英文名称',
    min: 2,
    max: 100,
  },
  ADDRESS: {
    required: true,
    message: '请输入酒店地址',
    min: 5,
    max: 200,
  },
  CITY: {
    required: true,
    message: '请选择城市',
  },
  STAR: {
    required: true,
    message: '请选择酒店星级',
  },
  OPEN_DATE: {
    required: true,
    message: '请选择开业时间',
  },
  IMAGES: {
    required: true,
    message: '请至少上传1张酒店图片',
    min: 1,
    max: 10,
  },
};
