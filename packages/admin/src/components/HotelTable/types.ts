/**
 * HotelTable 组件类型定义
 */
import type { Hotel } from '@/types';

/** 列配置回调函数类型 */
export interface ColumnCallbacks {
  /** 查看详情 */
  onView?: (hotel: Hotel) => void;
  /** 编辑 */
  onEdit?: (hotel: Hotel) => void;
  /** 删除 */
  onDelete?: (hotelId: number) => void;
  /** 提交审核 */
  onSubmitReview?: (hotelId: number) => void;
  /** 查看拒绝原因 */
  onViewRejectReason?: (reason?: string) => void;
  /** 审核通过 */
  onApprove?: (hotelId: number) => void;
  /** 审核拒绝 */
  onReject?: (hotelId: number) => void;
  /** 发布上线 */
  onPublish?: (hotelId: number) => void;
  /** 下线 */
  onOffline?: (hotelId: number) => void;
  /** 恢复（从已下线恢复到已发布） */
  onRestore?: (hotelId: number) => void;
}
