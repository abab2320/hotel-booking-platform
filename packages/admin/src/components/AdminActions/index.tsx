/**
 * 管理员审核操作组件
 * 提供审核通过、拒绝、发布、下线、恢复等操作按钮
 * 根据酒店当前状态动态显示可用的操作
 */
import React from 'react';
import { Button, Space, Modal } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  RocketOutlined,
  StopOutlined,
  ReloadOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { Hotel } from '@/types';

interface AdminActionsProps {
  /** 酒店信息 */
  hotel: Hotel;
  /** 操作加载状态 */
  loading?: boolean;
  /** 返回按钮回调 */
  onBack: () => void;
  /** 审核通过回调 */
  onApprove?: (id: number) => void;
  /** 审核拒绝回调 - 需要输入拒绝原因 */
  onReject?: (id: number) => void;
  /** 发布上线回调 */
  onPublish?: (id: number) => void;
  /** 下线回调 */
  onOffline?: (id: number) => void;
  /** 恢复上线回调 */
  onRestore?: (id: number) => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({
  hotel,
  loading = false,
  onBack,
  onApprove,
  onReject,
  onPublish,
  onOffline,
  onRestore,
}) => {
  /**
   * 审核通过弹窗
   */
  const handleApprove = () => {
    Modal.confirm({
      title: '确认审核通过',
      content: `确定要通过酒店"${hotel.nameZh}"的审核吗？`,
      okText: '确认通过',
      cancelText: '取消',
      onOk: () => {
        onApprove?.(hotel.id);
      },
    });
  };

  /**
   * 发布上线弹窗
   */
  const handlePublish = () => {
    Modal.confirm({
      title: '确认发布上线',
      content: `确定要将酒店"${hotel.nameZh}"发布到平台上吗？`,
      okText: '确认发布',
      cancelText: '取消',
      onOk: () => {
        onPublish?.(hotel.id);
      },
    });
  };

  /**
   * 下线弹窗
   */
  const handleOffline = () => {
    Modal.confirm({
      title: '确认下线',
      content: `确定要将酒店"${hotel.nameZh}"从平台下线吗？`,
      okText: '确认下线',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        onOffline?.(hotel.id);
      },
    });
  };

  /**
   * 恢复上线弹窗
   */
  const handleRestore = () => {
    Modal.confirm({
      title: '确认恢复上线',
      content: `确定要将酒店"${hotel.nameZh}"恢复上线吗？`,
      okText: '确认恢复',
      cancelText: '取消',
      onOk: () => {
        onRestore?.(hotel.id);
      },
    });
  };

  /**
   * 根据酒店状态渲染对应的操作按钮
   */
  const renderActionButtons = () => {
    const { status } = hotel;

    switch (status) {
      case 'pending':
        // 审核中：可以审核通过或拒绝
        return (
          <>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleApprove}
              loading={loading}
            >
              审核通过
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => onReject?.(hotel.id)}
              loading={loading}
            >
              审核拒绝
            </Button>
          </>
        );

      case 'approved':
        // 已通过：可以发布上线
        return (
          <Button
            type="primary"
            icon={<RocketOutlined />}
            onClick={handlePublish}
            loading={loading}
          >
            发布上线
          </Button>
        );

      case 'rejected':
        // 已拒绝：可以再次审核通过
        return (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleApprove}
            loading={loading}
          >
            审核通过
          </Button>
        );

      case 'published':
        // 已发布：可以下线
        return (
          <Button
            danger
            icon={<StopOutlined />}
            onClick={handleOffline}
            loading={loading}
          >
            下线
          </Button>
        );

      case 'offline':
        // 已下线：可以恢复上线或重新发布
        return (
          <>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRestore}
              loading={loading}
            >
              恢复上线
            </Button>
            <Button
              icon={<RocketOutlined />}
              onClick={handlePublish}
              loading={loading}
            >
              重新发布
            </Button>
          </>
        );

      default:
        // 草稿状态管理员不应该看到（已在 hook 中过滤）
        return null;
    }
  };

  return (
    <Space>
      {renderActionButtons()}
      <Button icon={<RollbackOutlined />} onClick={onBack}>
        返回列表
      </Button>
    </Space>
  );
};

export default AdminActions;
