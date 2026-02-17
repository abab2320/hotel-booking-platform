/**
 * 管理员操作列配置
 * 管理员可以：查看、审核通过/拒绝(审核中)、发布(已通过)、下线(已发布)、恢复(已下线)
 */
import { Button, Space, Popconfirm } from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type { Hotel } from '@/types';
import type { ColumnCallbacks } from './types';

/**
 * 创建管理员操作列
 */
export const createAdminActionColumn = (
  callbacks: ColumnCallbacks
): ColumnType<Hotel> => ({
  title: '操作',
  key: 'action',
  width: 280,
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

      {/* 审核操作 - 仅审核中状态 */}
      {record.status === 'pending' && (
        <>
          {callbacks.onApprove && (
            <Popconfirm
              title="审核通过"
              description="确认通过该酒店的审核吗？"
              onConfirm={() => callbacks.onApprove?.(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
              >
                通过
              </Button>
            </Popconfirm>
          )}
          {callbacks.onReject && (
            <Button
              type="link"
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => callbacks.onReject?.(record.id)}
            >
              拒绝
            </Button>
          )}
        </>
      )}

      {/* 发布操作 - 仅已通过状态 */}
      {record.status === 'approved' && callbacks.onPublish && (
        <Popconfirm
          title="发布上线"
          description="确认发布该酒店到平台吗？发布后用户将可以看到。"
          onConfirm={() => callbacks.onPublish?.(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            size="small"
            icon={<CloudUploadOutlined />}
            style={{ color: '#1890ff' }}
          >
            发布
          </Button>
        </Popconfirm>
      )}

      {/* 下线操作 - 仅已发布状态 */}
      {record.status === 'published' && callbacks.onOffline && (
        <Popconfirm
          title="下线酒店"
          description="确认将该酒店下线吗？下线后用户将无法看到，但可以恢复。"
          onConfirm={() => callbacks.onOffline?.(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            size="small"
            icon={<CloudDownloadOutlined />}
            style={{ color: '#faad14' }}
          >
            下线
          </Button>
        </Popconfirm>
      )}

      {/* 恢复操作 - 仅已下线状态 */}
      {record.status === 'offline' && callbacks.onRestore && (
        <Popconfirm
          title="恢复上线"
          description="确认将该酒店恢复上线吗？恢复后用户将可以看到。"
          onConfirm={() => callbacks.onRestore?.(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            size="small"
            icon={<CloudUploadOutlined />}
            style={{ color: '#52c41a' }}
          >
            恢复上线
          </Button>
        </Popconfirm>
      )}
    </Space>
  ),
});
