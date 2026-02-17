/**
 * 拒绝原因弹窗组件
 * 用于展示酒店审核被拒绝的原因
 */
import React from 'react';
import { Modal, Button, Typography } from 'antd';

const { Paragraph } = Typography;

export interface RejectReasonModalProps {
  /** 是否显示弹窗 */
  open: boolean;
  /** 拒绝原因 */
  reason?: string;
  /** 关闭弹窗回调 */
  onClose: () => void;
}

/**
 * 拒绝原因弹窗组件
 */
const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  open,
  reason,
  onClose,
}) => {
  return (
    <Modal
      title="审核未通过原因"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          知道了
        </Button>,
      ]}
    >
      <Paragraph style={{ marginTop: 16 }}>
        {reason || '暂无原因'}
      </Paragraph>
    </Modal>
  );
};

export default RejectReasonModal;
