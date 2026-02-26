import React from 'react';
import { Button, Space, Popconfirm } from 'antd';
import {
  EditOutlined,
  RollbackOutlined,
  SendOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { Hotel } from '@/types';

interface HotelActionsProps {
  hotel: Hotel;
  loading?: boolean;
  /** 操作回调 */
  onEdit?: () => void;
  onBack?: () => void;
  onSubmitReview?: () => void;
  onDelete?: () => void;
  /** 自定义按钮配置 */
  customButtons?: React.ReactNode;
  /** 按钮尺寸 */
  size?: 'small' | 'middle' | 'large';
}

/**
 * 酒店操作按钮组件
 * 统一处理各种操作按钮的显示和交互
 */
const HotelActions: React.FC<HotelActionsProps> = ({
  hotel,
  loading = false,
  onEdit,
  onBack,
  onSubmitReview,
  onDelete,
  customButtons,
  size = 'middle',
}) => {
  const canEdit = ['draft', 'rejected'].includes(hotel.status);
  const canSubmit = hotel.status === 'draft' || hotel.status === 'rejected';
  const canDelete = hotel.status === 'draft';

  return (
    <Space size="middle">
      {canSubmit && onSubmitReview && (
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={onSubmitReview}
          loading={loading}
          size={size}
        >
          提交审核
        </Button>
      )}
      
      {canEdit && onEdit && (
        <Button 
          icon={<EditOutlined />} 
          onClick={onEdit}
          size={size}
        >
          编辑信息
        </Button>
      )}
      
      {canDelete && onDelete && (
        <Popconfirm
          title="确定要删除这个酒店吗？"
          description="删除后将无法恢复"
          onConfirm={onDelete}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            danger 
            icon={<DeleteOutlined />}
            size={size}
          >
            删除
          </Button>
        </Popconfirm>
      )}

      {/* 自定义按钮 */}
      {customButtons}
      
      {onBack && (
        <Button 
          icon={<RollbackOutlined />} 
          onClick={onBack}
          size={size}
        >
          返回列表
        </Button>
      )}
    </Space>
  );
};

export default HotelActions;
