import React from 'react';
import { Tag, Space } from 'antd';
import { HOTEL_STATUS_CONFIG } from '@/types/constants';
import type { HotelStatus } from '@/types';
import './index.css';

interface HotelStatusDisplayProps {
  status: HotelStatus;
  rejectReason?: string;
  /** 是否显示标签 */
  showLabel?: boolean;
  /** 是否紧凑模式 */
  compact?: boolean;
}

/**
 * 酒店状态显示组件
 * 统一展示酒店状态和拒绝原因
 */
const HotelStatusDisplay: React.FC<HotelStatusDisplayProps> = ({
  status,
  rejectReason,
  showLabel = true,
  compact = false,
}) => {
  const statusConfig = HOTEL_STATUS_CONFIG[status];

  return (
    <Space size="small" className={compact ? 'status-compact' : 'status-normal'}>
      {showLabel && <span className="status-label">当前状态：</span>}
      <Tag color={statusConfig.color} className="status-tag">
        {statusConfig.text}
      </Tag>
      {status === 'rejected' && rejectReason && (
        <span className="reject-reason">
          拒绝原因：{rejectReason}
        </span>
      )}
    </Space>
  );
};

export default HotelStatusDisplay;
