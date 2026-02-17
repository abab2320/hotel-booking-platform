/**
 * 商户操作列配置
 * 商户可以：查看、编辑(草稿/拒绝)、提交审核(草稿/拒绝)、删除(草稿)
 */
import { Button, Space, Popconfirm } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type { Hotel } from '@/types';
import type { ColumnCallbacks } from './types';

/**
 * 创建商户操作列
 */
export const createMerchantActionColumn = (
  callbacks: ColumnCallbacks
): ColumnType<Hotel> => ({
  title: '操作',
  key: 'action',
  width: 220,
  fixed: 'right',
  render: (_: any, record: Hotel) => (
    <Space size="small">
      {/* 查看按钮 - 所有状态都可查看 */}
      {callbacks.onView && (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => callbacks.onView?.(record)}
        >
          查看
        </Button>
      )}

      {/* 编辑和提交审核 - 仅草稿和被拒绝状态 */}
      {(record.status === 'draft' || record.status === 'rejected') && (
        <>
          {callbacks.onEdit && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => callbacks.onEdit?.(record)}
            >
              编辑
            </Button>
          )}
          {callbacks.onSubmitReview && (
            <Button
              type="link"
              size="small"
              icon={<SendOutlined />}
              onClick={() => callbacks.onSubmitReview?.(record.id)}
            >
              提交审核
            </Button>
          )}
        </>
      )}

      {/* 删除 - 仅草稿状态 */}
      {record.status === 'draft' && callbacks.onDelete && (
        <Popconfirm
          title="确认删除"
          description="删除后无法恢复，确定要删除吗？"
          onConfirm={() => callbacks.onDelete?.(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      )}
    </Space>
  ),
});
