/**
 * HotelTable 组件
 * 导出表格列配置工厂函数和类型
 */
import type { ColumnsType } from 'antd/es/table';
import type { Hotel, UserRole } from '@/types';
import type { ColumnCallbacks } from './types';
import { createBaseHotelColumns } from './baseColumns';
import { createMerchantActionColumn } from './merchantColumns';
import { createAdminActionColumn } from './adminColumns';

/**
 * 根据角色创建完整的表格列配置
 * @param role - 用户角色
 * @param callbacks - 操作回调函数
 * @returns 完整的表格列配置
 */
export const createHotelColumns = (
  role: UserRole,
  callbacks: ColumnCallbacks
): ColumnsType<Hotel> => {
  const baseColumns = createBaseHotelColumns(callbacks);

  if (role === 'merchant') {
    return [...baseColumns, createMerchantActionColumn(callbacks)];
  }

  if (role === 'admin') {
    return [...baseColumns, createAdminActionColumn(callbacks)];
  }

  // 默认只返回基础列（无操作列）
  return baseColumns;
};

// 导出各个工厂函数
export { createBaseHotelColumns } from './baseColumns';
export { createMerchantActionColumn } from './merchantColumns';
export { createAdminActionColumn } from './adminColumns';

// 导出类型
export type { ColumnCallbacks } from './types';
